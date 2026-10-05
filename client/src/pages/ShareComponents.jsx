import React, { useState } from 'react';
import { 
  Share2, 
  Plus, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Coins, 
  HeartHandshake 
} from 'lucide-react';
import { COMPONENT_CATEGORIES } from '../utils/seedData';
import confetti from 'canvas-confetti';

export default function ShareComponents({ onAddListing, onNavigate }) {
  const [componentName, setComponentName] = useState('');
  const [category, setCategory] = useState('Microcontroller');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Working');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('KCG College area, Chennai');
  const [reuseMode, setReuseMode] = useState('Free Donation');
  const [price, setPrice] = useState('');
  const [postedBy, setPostedBy] = useState('You (Demo User)');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Demo flow quick-fill (Step 7: Arduino UNO, Working, Free Donation)
  const loadDemoStep7Preset = () => {
    setComponentName('Arduino UNO');
    setCategory('Microcontroller');
    setQuantity(1);
    setCondition('Working');
    setDescription('Original Arduino UNO R3 from my 2nd semester lab. Kept safely in anti-static bag.');
    setLocation('KCG College area, Chennai');
    setReuseMode('Free Donation');
    setPrice('');
    setPostedBy('You (Demo User)');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!componentName.trim()) {
      setError('Component name is required');
      return;
    }
    if (reuseMode === 'Low-cost Transfer' && (!price || Number(price) <= 0)) {
      setError('Please specify an expected fair price for low-cost transfer');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onAddListing({
        componentName: componentName.trim(),
        category,
        quantity: Number(quantity) || 1,
        condition,
        description: description.trim(),
        location: location.trim(),
        reuseMode,
        price: reuseMode === 'Low-cost Transfer' ? Number(price) : 0,
        postedBy: postedBy.trim()
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
        onNavigate('available-components');
      }, 1600);
    } catch (err) {
      setError(err.message || 'Failed to list component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Share2 size={32} color="var(--primary)" />
              Share Unused Components
            </h1>
            <p className="page-subtitle">
              Don't let working electronic modules sit idle in your drawers. List them so fellow students and project teams can give them a second life.
            </p>
          </div>

          <button 
            type="button" 
            className="demo-preset-pill"
            onClick={loadDemoStep7Preset}
          >
            <Sparkles size={14} /> Quick-Fill Demo (Arduino UNO - Free Donation)
          </button>
        </div>
      </section>

      {/* Main Form Container */}
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border-card)', 
          borderRadius: 'var(--radius-xl)', 
          padding: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                <CheckCircle2 size={56} style={{ margin: '0 auto' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Listing Created Successfully!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Your {componentName} is now listed under <strong>Available Components</strong> for community reuse. Redirecting to Marketplace...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  backgroundColor: 'var(--accent-rose-light)', 
                  color: 'var(--accent-rose)', 
                  borderRadius: 'var(--radius-md)', 
                  fontSize: '0.88rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--accent-rose-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Component Name */}
              <div className="form-group">
                <label className="form-label">Component Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Arduino UNO, Servo Motor, OLED Display"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  required
                />
              </div>

              {/* Category & Quantity */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {COMPONENT_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity Available</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Condition & Location */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Condition</label>
                  <select
                    className="form-select"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="Working">Working (Tested)</option>
                    <option value="Untested">Untested (Kept safely)</option>
                    <option value="Minor Defect">Minor Defect (For scrap/parts)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location (Campus / City) *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. KCG College area, Chennai"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Reuse Mode Selector (Free Donation vs Low-cost Transfer) */}
              <div className="form-group" style={{ margin: '1.5rem 0' }}>
                <label className="form-label">Reuse Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.4rem' }}>
                  {/* Option 1: Free Donation */}
                  <div
                    onClick={() => setReuseMode('Free Donation')}
                    style={{
                      border: reuseMode === 'Free Donation' ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                      backgroundColor: reuseMode === 'Free Donation' ? 'var(--primary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '700', color: 'var(--primary)' }}>
                      <HeartHandshake size={20} />
                      <span>Free Donation</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Pass on to fellow makers with zero charge to support student education.
                    </span>
                  </div>

                  {/* Option 2: Low-cost Transfer */}
                  <div
                    onClick={() => setReuseMode('Low-cost Transfer')}
                    style={{
                      border: reuseMode === 'Low-cost Transfer' ? '2px solid var(--secondary)' : '1px solid var(--border-card)',
                      backgroundColor: reuseMode === 'Low-cost Transfer' ? 'var(--secondary-light)' : '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '700', color: 'var(--secondary)' }}>
                      <Coins size={20} />
                      <span>Low-cost Transfer</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Nominal recovery price (e.g. ₹50 - ₹150) to offset purchase cost.
                    </span>
                  </div>
                </div>
              </div>

              {/* Price input if Low-cost Transfer */}
              {reuseMode === 'Low-cost Transfer' && (
                <div className="form-group" style={{ 
                  backgroundColor: 'var(--secondary-light)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--secondary-border)' 
                }}>
                  <label className="form-label" style={{ color: '#0369a1' }}>
                    Expected Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 100"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required={reuseMode === 'Low-cost Transfer'}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#0284c7', display: 'block', marginTop: '0.35rem' }}>
                    Note: Handover payment is settled directly between peers in person. No online gateway needed.
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Notes & Condition Details</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="e.g. Pins are unbent, worked on our robotics project last term."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => onNavigate('available-components')}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  <Plus size={18} />
                  <span>{loading ? 'Publishing...' : 'List Component for Reuse'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
