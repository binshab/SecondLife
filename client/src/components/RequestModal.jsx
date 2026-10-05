import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin, Tag, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RequestModal({ listing, onClose, onSubmitRequest }) {
  if (!listing) return null;

  const [quantity, setQuantity] = useState(1);
  const [intendedProject, setIntendedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!intendedProject.trim()) {
      setError('Please share what project you intend to build or reason for requesting.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmitRequest({
        listingId: listing.id,
        componentName: listing.componentName,
        requestedQuantity: quantity,
        intendedProject: intendedProject.trim(),
        ownerName: listing.postedBy,
        ownerLocation: listing.location,
        ownerEmail: 'owner@college.edu'
      });

      setSuccess(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '0.35rem' }}>
              Reuse Request
            </span>
            <h2 style={{ fontSize: '1.45rem' }}>Request Component</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Listing Preview Pill */}
        <div style={{ 
          backgroundColor: 'var(--bg-subtle)', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>
                {listing.componentName}
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <User size={13} /> {listing.postedBy}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <MapPin size={13} /> {listing.location}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${listing.reuseMode === 'Free Donation' ? 'badge-emerald' : 'badge-amber'}`}>
                {listing.reuseMode}
              </span>
              {listing.reuseMode === 'Low-cost Transfer' && (
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  ₹{listing.price}
                </div>
              )}
            </div>
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>
              <CheckCircle2 size={54} style={{ margin: '0 auto' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>Request Sent Successfully!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              The component owner has been notified. You can check the request status under <strong>My Requests</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ 
                padding: '0.65rem 0.9rem', 
                backgroundColor: 'var(--accent-rose-light)', 
                color: 'var(--accent-rose)', 
                borderRadius: 'var(--radius-md)', 
                fontSize: '0.85rem',
                marginBottom: '1rem',
                border: '1px solid var(--accent-rose-border)'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Quantity Needed (Max available: {listing.quantity})
              </label>
              <input
                type="number"
                min="1"
                max={listing.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(listing.quantity, parseInt(e.target.value) || 1)))}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Intended Project or Purpose *
              </label>
              <textarea
                rows="3"
                value={intendedProject}
                onChange={(e) => setIntendedProject(e.target.value)}
                placeholder="e.g. I want to reuse this component for my Smart Parking Assistant project."
                className="form-textarea"
                required
              />
              <span style={{ fontSize: '0.76rem', color: 'var(--text-subtle)', display: 'block', marginTop: '0.25rem' }}>
                Helps the component owner understand how you will give this electronic part a second life.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                <Send size={15} />
                <span>{loading ? 'Submitting...' : 'Send Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
