import React from 'react';
import { 
  TrendingUp, 
  Recycle, 
  CheckCircle2, 
  Scale, 
  Layers, 
  Award, 
  Leaf, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';
import { StatCard } from '../components/UIBadges';

export default function ImpactDashboard({ impactData, onNavigate }) {
  const {
    componentsListed = 127,
    componentsReused = 42,
    projectsEnabled = 18,
    estimatedEwasteDivertedKg = '1.81',
    estimatedEwasteDivertedGrams = 1810,
    userContributionCount = 6,
    history = []
  } = impactData || {};

  // Find max for visual chart scaling
  const maxReused = Math.max(...history.map(h => h.componentsReused || 1), 50);

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <TrendingUp size={32} color="var(--primary)" />
              Sustainability & Impact Dashboard
            </h1>
            <p className="page-subtitle">
              Every reused sensor, microcontroller, and passive component keeps toxic heavy metals out of municipal landfills and conserves virgin semiconductor materials.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-emerald" style={{ padding: '0.4rem 0.85rem' }}>
              <Leaf size={14} /> Zero E-waste Campus Initiative
            </span>
          </div>
        </div>
      </section>

      {/* Main 4 Metric Cards */}
      <section className="stats-grid">
        <StatCard 
          icon={Layers}
          iconColor="blue"
          label="Components Listed"
          value={componentsListed}
          subtext="Shared by community members"
        />

        <StatCard 
          icon={Recycle}
          iconColor="green"
          label="Components Reused"
          value={componentsReused}
          subtext="Active components repurposed"
        />

        <StatCard 
          icon={CheckCircle2}
          iconColor="amber"
          label="Projects Enabled"
          value={projectsEnabled}
          subtext="Student prototypes completed"
        />

        <StatCard 
          icon={Scale}
          iconColor="green"
          label="Estimated E-Waste Diverted"
          value={`${estimatedEwasteDivertedKg} kg`}
          badge="ESTIMATE"
          subtext={`~${estimatedEwasteDivertedGrams} grams total`}
        />
      </section>

      {/* "Your Contribution" Card */}
      <section style={{ 
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '2rem',
        color: '#ffffff',
        marginBottom: '2.5rem',
        boxShadow: '0 10px 25px rgba(5, 150, 105, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              padding: '0.3rem 0.75rem', 
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: '700',
              marginBottom: '0.75rem'
            }}>
              <Award size={14} /> Your Personal Impact
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
              Your Contribution
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#ecfdf5', maxWidth: '580px', lineHeight: '1.6' }}>
              You helped give <strong>{userContributionCount} electronic components</strong> a second life through inventory cataloging and marketplace sharing.
            </p>
          </div>

          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#d1fae5' }}>
              Personal Waste Diverted
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'Outfit, sans-serif' }}>
              ~175 g
            </div>
            <div style={{ fontSize: '0.75rem', color: '#ecfdf5' }}>
              Based on your active parts
            </div>
          </div>
        </div>
      </section>

      {/* Visual Chart: Components Reused Over Time */}
      <section style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-card)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '2rem',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary)" />
              Components Reused Over Time
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Monthly progression of electronics reused by students and clubs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--primary)' }} />
              Cumulative Reused Modules
            </span>
          </div>
        </div>

        {/* Clean Modern Bar Chart */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: '1.25rem', 
          height: '240px', 
          padding: '1rem 0.5rem 2rem 0.5rem',
          borderBottom: '2px solid var(--border-subtle)',
          position: 'relative'
        }}>
          {history.map((item, idx) => {
            const heightPercent = Math.round((item.componentsReused / maxReused) * 100);
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                  {item.componentsReused}
                </span>

                <div 
                  style={{ 
                    width: '100%', 
                    maxWidth: '44px',
                    height: `${heightPercent}%`, 
                    background: idx === history.length - 1 
                      ? 'linear-gradient(180deg, #059669 0%, #10b981 100%)' 
                      : 'linear-gradient(180deg, #10b981 0%, #a7f3d0 100%)',
                    borderRadius: '8px 8px 2px 2px',
                    transition: 'height 0.6s ease',
                    boxShadow: idx === history.length - 1 ? '0 4px 12px rgba(5, 150, 105, 0.3)' : 'none'
                  }}
                  title={`${item.month}: ${item.componentsReused} components (${item.wasteDivertedGrams}g diverted)`}
                />

                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: idx === history.length - 1 ? '700' : '500', 
                  color: idx === history.length - 1 ? 'var(--primary)' : 'var(--text-subtle)', 
                  marginTop: '0.65rem',
                  whiteSpace: 'nowrap'
                }}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scientific Transparency & Weight Methodology */}
      <section style={{ 
        backgroundColor: 'var(--bg-subtle)', 
        border: '1px solid var(--border-subtle)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: 'var(--text-main)' }}>
          <Info size={18} color="var(--primary)" />
          <span>Waste Reduction Calculation Methodology</span>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          SecondLife calculates <strong>Estimated E-waste Diverted</strong> using standard approximate laboratory weights of hardware:
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', 
          gap: '0.6rem',
          marginTop: '0.25rem'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            ESP32 / UNO: <strong>~25g</strong>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            Ultrasonic / Gas: <strong>~10g</strong>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            OLED Display: <strong>~15g</strong>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            Servo Motor: <strong>~9g</strong>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            Piezo Buzzer: <strong>~5g</strong>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
            LED: <strong>~1g</strong>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.4rem', fontStyle: 'italic' }}>
          * Clearly labeled as an ESTIMATE. The purpose is to demonstrate the tangible environmental impact of electronic component reuse.
        </div>
      </section>
    </div>
  );
}
