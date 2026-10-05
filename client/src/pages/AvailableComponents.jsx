import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  MapPin, 
  User, 
  HeartHandshake, 
  Coins, 
  Send, 
  Plus, 
  Filter,
  CheckCircle2
} from 'lucide-react';
import RequestModal from '../components/RequestModal';

export default function AvailableComponents({ 
  listings = [], 
  onRequestComponent, 
  onNavigate,
  highlightComponentName = '' 
}) {
  const [searchTerm, setSearchTerm] = useState(highlightComponentName || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [activeRequestListing, setActiveRequestListing] = useState(null);

  const categories = ['All', 'Microcontroller', 'Sensor', 'Display', 'Motor', 'Communication', 'Basic Electronics'];
  const modes = ['All', 'Free Donation', 'Low-cost Transfer'];

  const filtered = listings.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchMode = selectedMode === 'All' || item.reuseMode === selectedMode;
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      item.componentName.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.postedBy.toLowerCase().includes(q);

    return matchCat && matchMode && matchSearch;
  });

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Layers size={32} color="var(--primary)" />
              Available Components Marketplace
            </h1>
            <p className="page-subtitle">
              Browse electronic modules listed by students and labs across Chennai. Request what you need to complete your reuse build.
            </p>
          </div>

          <button 
            className="btn-primary"
            onClick={() => onNavigate('share-components')}
          >
            <Plus size={16} />
            <span>List My Unused Parts</span>
          </button>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search component (e.g. Servo, Arduino)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Mode */}
          <div>
            <select
              className="form-select"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
            >
              {modes.map(m => (
                <option key={m} value={m}>{m === 'All' ? 'All Transfer Types' : m}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length}</strong> available component listings
        </span>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Layers size={32} />
          </div>
          <h3>No available components found</h3>
          <p>Try searching for a different component or clear your filters.</p>
          <button 
            className="btn-secondary"
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedMode('All'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '1.25rem' 
        }}>
          {filtered.map((item) => (
            <div 
              key={item.id} 
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                    {item.category}
                  </span>
                  
                  <span className={`badge ${item.reuseMode === 'Free Donation' ? 'badge-emerald' : 'badge-amber'}`}>
                    {item.reuseMode === 'Free Donation' ? (
                      <>
                        <HeartHandshake size={13} />
                        Free Donation
                      </>
                    ) : (
                      <>
                        <Coins size={13} />
                        ₹{item.price}
                      </>
                    )}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
                  {item.componentName}
                </h3>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>
                    Qty: {item.quantity}
                  </span>
                  <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>
                    {item.condition}
                  </span>
                </div>

                {item.description && (
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {item.description}
                  </p>
                )}

                {/* Location & Poster Meta */}
                <div style={{ 
                  backgroundColor: 'var(--bg-subtle)', 
                  padding: '0.65rem 0.85rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.8rem',
                  color: 'var(--text-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} color="var(--primary)" />
                    <span>{item.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User size={13} color="var(--text-muted)" />
                    <span>Posted by: <strong>{item.postedBy}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => setActiveRequestListing(item)}
                >
                  <Send size={15} />
                  <span>Request Component</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      {activeRequestListing && (
        <RequestModal
          listing={activeRequestListing}
          onClose={() => setActiveRequestListing(null)}
          onSubmitRequest={onRequestComponent}
        />
      )}
    </div>
  );
}
