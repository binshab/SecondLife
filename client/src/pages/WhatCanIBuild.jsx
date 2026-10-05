import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  Cpu, 
  Layers, 
  ArrowRight, 
  SlidersHorizontal,
  Flame,
  Scale,
  RefreshCw,
  Info
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import confetti from 'canvas-confetti';

export default function WhatCanIBuild({ 
  inventory = [], 
  onRunMatch, 
  matchResults = [], 
  loading = false, 
  onViewProjectDetails,
  onNavigate 
}) {
  // Allow user to check/uncheck components to simulate what-if scenarios
  const [selectedCompIds, setSelectedCompIds] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // all, ready, high, partial
  const [searched, setSearched] = useState(false);

  // Initialize selected components from inventory
  useEffect(() => {
    if (inventory.length > 0 && selectedCompIds.length === 0) {
      setSelectedCompIds(inventory.map(item => item.id));
    }
  }, [inventory]);

  const toggleComponent = (id) => {
    if (selectedCompIds.includes(id)) {
      setSelectedCompIds(selectedCompIds.filter(i => i !== id));
    } else {
      setSelectedCompIds([...selectedCompIds, id]);
    }
  };

  const selectAll = () => {
    setSelectedCompIds(inventory.map(i => i.id));
  };

  const handleFindProjects = async () => {
    const selectedItems = inventory.filter(i => selectedCompIds.includes(i.id));
    setSearched(true);
    await onRunMatch(selectedItems);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // Filter matched results
  const filteredResults = matchResults.filter(match => {
    if (activeFilter === 'ready') return match.feasibilityScore === 100;
    if (activeFilter === 'high') return match.feasibilityScore >= 75;
    if (activeFilter === 'partial') return match.feasibilityScore >= 50 && match.feasibilityScore < 75;
    return true;
  });

  const topMatch = matchResults[0];

  return (
    <div>
      {/* Hero Section */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Sparkles size={32} color="var(--primary)" />
              What Can I Build?
            </h1>
            <p className="page-subtitle">
              Our deterministic matching algorithm compares your physical components against our predefined project library and computes exact feasibility scores and waste reduction.
            </p>
          </div>
        </div>
      </section>

      {/* Component Selection Sandbox Card */}
      <section style={{ 
        backgroundColor: 'var(--bg-surface)', 
        border: '1px solid var(--border-card)', 
        borderRadius: 'var(--radius-xl)', 
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
              Your Available Components
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select which components you want to include in this matching calculation:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn-secondary btn-sm"
              onClick={selectAll}
            >
              Select All ({inventory.length})
            </button>
            <button 
              className="btn-secondary btn-sm"
              onClick={() => onNavigate('my-components')}
            >
              + Add More Hardware
            </button>
          </div>
        </div>

        {inventory.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No components found in your inventory. Add some components or load demo hardware!
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.65rem', 
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            {inventory.map(item => {
              const isSelected = selectedCompIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleComponent(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.86rem',
                    fontWeight: '600',
                    border: isSelected ? '1px solid var(--primary-border)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? 'var(--primary)' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '10px'
                  }}>
                    {isSelected && <Check size={11} strokeWidth={3} />}
                  </div>
                  <span>{item.name}</span>
                  <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>({item.quantity})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Prominent Action Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn-primary"
            style={{ 
              padding: '0.95rem 2.5rem', 
              fontSize: '1.1rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.3)'
            }}
            onClick={handleFindProjects}
            disabled={loading || selectedCompIds.length === 0}
          >
            <Sparkles size={20} />
            <span>{loading ? 'Evaluating Projects...' : 'Find What I Can Build'}</span>
          </button>
        </div>
      </section>

      {/* Top Match Spotlight (if matches exist) */}
      {topMatch && topMatch.feasibilityScore > 0 && (
        <section style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)', 
          border: '2px solid var(--primary-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: 'var(--shadow-hover)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                  ★ #1 Best Match ({topMatch.feasibilityScore}% Compatibility)
                </span>
                <span className="badge badge-gray">{topMatch.project.category}</span>
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {topMatch.project.name}
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginBottom: '1rem', maxWidth: '620px' }}>
                {topMatch.project.description}
              </p>

              {/* Mathematical calculation breakdown */}
              <div style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.86rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  Calculation: {topMatch.calculationDetail}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {topMatch.whyThisProject}
                </div>
              </div>

              {/* Status pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem' }}>
                {topMatch.availableComponents.map((c, i) => (
                  <span key={i} className="comp-pill available">
                    <Check size={11} strokeWidth={3} /> {c.name}
                  </span>
                ))}
                {topMatch.missingComponents.map((c, i) => (
                  <span key={i} className="comp-pill missing">
                    ✗ Missing: {c.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics & CTA */}
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '1.25rem', 
              borderRadius: 'var(--radius-lg)', 
              border: '1px solid var(--border-subtle)',
              minWidth: '220px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: '700' }}>
                Estimated E-Waste Diverted
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', fontFamily: 'Outfit, sans-serif' }}>
                {topMatch.estimatedWasteDivertedGrams} g
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', marginBottom: '1rem' }}>
                Physical hardware reused
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%' }}
                onClick={() => onViewProjectDetails(topMatch)}
              >
                <span>View Full Project</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
              All Ranked Project Matches ({matchResults.length})
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Ranked in descending order of component compatibility and feasibility score.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-subtle)', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
            <button 
              className={`nav-link-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({matchResults.length})
            </button>
            <button 
              className={`nav-link-btn ${activeFilter === 'high' ? 'active' : ''}`}
              onClick={() => setActiveFilter('high')}
            >
              Strong (≥75%)
            </button>
            <button 
              className={`nav-link-btn ${activeFilter === 'ready' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ready')}
            >
              100% Ready
            </button>
            <button 
              className={`nav-link-btn ${activeFilter === 'partial' ? 'active' : ''}`}
              onClick={() => setActiveFilter('partial')}
            >
              Partial (50-74%)
            </button>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects-grid">
        {filteredResults.map((match, idx) => (
          <ProjectCard
            key={match.project.id}
            projectMatch={match}
            rankIndex={idx}
            onViewDetails={onViewProjectDetails}
          />
        ))}
      </section>
    </div>
  );
}
