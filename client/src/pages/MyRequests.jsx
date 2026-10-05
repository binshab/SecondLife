import React, { useState } from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  User, 
  Mail, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyRequests({ 
  requests = [], 
  onUpdateRequestStatus, 
  onNavigate 
}) {
  const [activeTab, setActiveTab] = useState('outgoing'); // 'outgoing' (Sent) vs 'incoming' (Received)
  const [handoverNoteInput, setHandoverNoteInput] = useState('');
  const [activeAcceptingId, setActiveAcceptingId] = useState(null);

  const outgoing = requests.filter(r => r.type === 'outgoing' || r.requesterName.includes('You'));
  const incoming = requests.filter(r => r.type === 'incoming' || r.ownerName.includes('You'));

  const handleAccept = async (requestId) => {
    const note = handoverNoteInput.trim() || 'Accepted! Contact me to arrange campus pickup.';
    await onUpdateRequestStatus(requestId, {
      status: 'Accepted',
      handoverNotes: note
    });
    setActiveAcceptingId(null);
    setHandoverNoteInput('');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleReject = async (requestId) => {
    await onUpdateRequestStatus(requestId, {
      status: 'Rejected',
      handoverNotes: 'Sorry, this component is no longer available.'
    });
  };

  const renderStatusBadge = (status) => {
    if (status === 'Accepted') {
      return (
        <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={13} />
          Accepted
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="badge badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <XCircle size={13} />
          Rejected
        </span>
      );
    }
    return (
      <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
        <Clock size={13} />
        Pending
      </span>
    );
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Inbox size={32} color="var(--primary)" />
              My Component Requests
            </h1>
            <p className="page-subtitle">
              Track requests you have sent to source missing components, and manage incoming requests from peers for components you listed.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
            <button
              className={`nav-link-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('outgoing')}
            >
              <ArrowUpRight size={15} />
              Requests I Sent ({outgoing.length})
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'incoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('incoming')}
            >
              <ArrowDownLeft size={15} />
              Incoming Requests ({incoming.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Request Lists */}
      {activeTab === 'outgoing' ? (
        <div>
          {outgoing.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox size={32} />
              </div>
              <h3>No outgoing requests yet</h3>
              <p>When you browse Available Components, click "Request Component" to source parts for your builds.</p>
              <button className="btn-primary" onClick={() => onNavigate('available-components')}>
                Browse Marketplace
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {outgoing.map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.4rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                          {req.componentName}
                        </h3>
                        <span className="badge badge-gray">Qty: {req.requestedQuantity}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        Requested from: <strong>{req.ownerName}</strong> • {req.ownerLocation}
                      </div>
                    </div>

                    <div>
                      {renderStatusBadge(req.status)}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>Intended Project:</strong> "{req.intendedProject}"
                  </div>

                  {/* If Accepted, show the connect / handover instructions */}
                  {req.status === 'Accepted' && (
                    <div style={{
                      backgroundColor: 'var(--primary-light)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '700', color: '#065f46', marginBottom: '0.35rem' }}>
                        <CheckCircle2 size={16} />
                        Request Accepted! Handover Details:
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#047857', marginBottom: '0.5rem' }}>
                        {req.handoverNotes || 'Request accepted. Contact the component owner to arrange the handover.'}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: '#065f46', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>📧 Contact: <strong>{req.ownerEmail || 'deepa.robotics@college.edu'}</strong></span>
                        <span>📍 Location: <strong>{req.ownerLocation}</strong></span>
                      </div>
                    </div>
                  )}

                  {req.status === 'Rejected' && (
                    <div style={{
                      backgroundColor: 'var(--accent-rose-light)',
                      border: '1px solid var(--accent-rose-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.84rem',
                      color: 'var(--accent-rose)'
                    }}>
                      {req.handoverNotes || 'This request was declined by the owner.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Incoming Requests Tab */
        <div>
          {incoming.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox size={32} />
              </div>
              <h3>No incoming requests</h3>
              <p>When other students request components from your shared listings, they will appear here for you to accept.</p>
              <button className="btn-primary" onClick={() => onNavigate('share-components')}>
                List More Components
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {incoming.map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.4rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                          {req.componentName}
                        </h3>
                        <span className="badge badge-gray">Qty: {req.requestedQuantity}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                        Requested by: <strong>{req.requesterName}</strong> ({req.requesterEmail || 'student@college.edu'})
                      </div>
                    </div>

                    <div>
                      {renderStatusBadge(req.status)}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <strong>Intended Project:</strong> "{req.intendedProject}"
                  </div>

                  {req.status === 'Pending' && (
                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                      {activeAcceptingId === req.id ? (
                        <div style={{ 
                          backgroundColor: 'var(--bg-subtle)', 
                          padding: '1rem', 
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)' 
                        }}>
                          <label className="form-label" style={{ fontSize: '0.84rem' }}>
                            Handover Notes for Requester (Pickup location & time)
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Meet me at College Makers Lab Room 204 at 4 PM"
                            value={handoverNoteInput}
                            onChange={(e) => setHandoverNoteInput(e.target.value)}
                            style={{ marginBottom: '0.75rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn-secondary btn-sm" onClick={() => setActiveAcceptingId(null)}>
                              Cancel
                            </button>
                            <button className="btn-primary btn-sm" onClick={() => handleAccept(req.id)}>
                              Confirm Accept & Send Handover Details
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn-danger-outline btn-sm"
                            onClick={() => handleReject(req.id)}
                          >
                            Decline
                          </button>
                          <button 
                            className="btn-primary btn-sm"
                            onClick={() => {
                              setActiveAcceptingId(req.id);
                              setHandoverNoteInput('Accepted! Contact me to arrange campus handover.');
                            }}
                          >
                            <CheckCircle2 size={14} />
                            <span>Accept Request</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {req.status === 'Accepted' && (
                    <div style={{
                      backgroundColor: 'var(--primary-light)',
                      border: '1px solid var(--primary-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      fontSize: '0.84rem',
                      color: '#065f46'
                    }}>
                      ✅ Request accepted. Handover note: "{req.handoverNotes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
