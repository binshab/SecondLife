import React from 'react';
import { 
  X, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Recycle, 
  Layers, 
  ListOrdered, 
  ArrowRight,
  Code
} from 'lucide-react';
import { FeasibilityBadge, WasteBadge } from './UIBadges';

export default function ProjectDetailModal({ 
  projectMatch, 
  onClose, 
  onFindMissingComponents 
}) {
  if (!projectMatch) return null;

  const {
    project,
    feasibilityScore = 0,
    matchGrade = '',
    matchedCount = 0,
    totalRequiredCount = (project?.requiredComponents?.length || 0),
    availableComponents = [],
    missingComponents = [],
    estimatedWasteDivertedGrams = 0,
    calculationDetail = '',
    whyThisProject = '',
    aiRecommendation
  } = projectMatch;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span className="badge badge-emerald">{project.category}</span>
              <span className="badge badge-gray">{project.difficulty}</span>
              {project.estimatedTime && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                  ⏱️ {project.estimatedTime}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>{project.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Tagline / Overview */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
          {project.description}
        </p>

        {/* AI Recommendation Banner */}
        <div className="ai-recommendation-box">
          <div className="ai-header-tag">
            <Sparkles size={13} />
            AI Recommendation & Engineering Insight
          </div>
          <div className="ai-headline">
            {aiRecommendation?.headline || `Smart Recommendation (${feasibilityScore}%)`}
          </div>
          <p className="ai-explanation-text">
            {aiRecommendation?.explanation || whyThisProject || `Based on your available components, ${project.name} is a strong match.`}
          </p>
          <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#047857', fontWeight: '600' }}>
            {aiRecommendation?.sustainabilityNote || `Reusing these components diverts an estimated ${estimatedWasteDivertedGrams}g of e-waste.`}
          </div>
        </div>

        {/* Feasibility Breakdown & Math Formula */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Feasibility & Compatibility</span>
          </h4>
          <FeasibilityBadge score={feasibilityScore} matchGrade={matchGrade} />
          
          <div style={{ 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)', 
            backgroundColor: 'var(--bg-subtle)', 
            padding: '0.6rem 0.85rem', 
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            marginTop: '0.5rem'
          }}>
            <strong>Formula:</strong> {calculationDetail || `(${matchedCount} available / ${totalRequiredCount} required) × 100 = ${feasibilityScore}%`}
            <span style={{ display: 'block', marginTop: '0.2rem', color: 'var(--text-subtle)' }}>
              Why it matches: {whyThisProject}
            </span>
          </div>
        </div>

        {/* Environmental Waste Reduction Callout */}
        <div style={{ 
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', 
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#065f46', textTransform: 'uppercase' }}>
              Environmental Sustainability Impact
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#047857', marginTop: '0.2rem' }}>
              Estimated e-waste diverted: {estimatedWasteDivertedGrams} g
            </div>
            <div style={{ fontSize: '0.78rem', color: '#065f46', marginTop: '0.2rem' }}>
              Sum of standard component weights (ESP32: 25g, Sensors: ~10g, LEDs: 1g) kept in active reuse.
            </div>
          </div>
          <span style={{ fontSize: '2.5rem' }}>♻️</span>
        </div>

        {/* Components Comparison: Available vs Missing */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem' }}>
            Component Requirements ({matchedCount} of {totalRequiredCount} Ready)
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Available */}
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #bbf7d0', 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem' 
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#166534', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={16} /> Available in Inventory ({availableComponents.length})
              </div>
              {availableComponents.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>No components currently in inventory.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {availableComponents.map((comp, idx) => (
                    <li key={idx} style={{ fontSize: '0.84rem', color: '#14532d', display: 'flex', justifyContent: 'space-between' }}>
                      <span>✓ {comp.name} {comp.requiredQty > 1 ? `×${comp.requiredQty}` : ''}</span>
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>~{comp.totalReusedWeight || comp.unitWeight}g</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Missing */}
            <div style={{ 
              backgroundColor: missingComponents.length > 0 ? '#fff1f2' : '#f8fafc', 
              border: `1px solid ${missingComponents.length > 0 ? '#fecdd3' : '#e2e8f0'}`, 
              borderRadius: 'var(--radius-md)', 
              padding: '1rem' 
            }}>
              <div style={{ 
                fontSize: '0.85rem', 
                fontWeight: '700', 
                color: missingComponents.length > 0 ? '#9f1239' : '#475569', 
                marginBottom: '0.65rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem' 
              }}>
                <AlertCircle size={16} /> Missing Components ({missingComponents.length})
              </div>
              {missingComponents.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: '600' }}>
                  🎉 None! You have 100% of required parts.
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {missingComponents.map((comp, idx) => (
                    <li key={idx} style={{ fontSize: '0.84rem', color: '#881337', display: 'flex', justifyContent: 'space-between' }}>
                      <span>✗ {comp.name} {comp.requiredQty > 1 ? `×${comp.requiredQty}` : ''}</span>
                      <span style={{ color: '#e11d48' }}>Needed</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Project Workflow Steps */}
        {project.workflow && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ListOrdered size={18} /> Implementation Overview & Wiring Steps
            </h4>
            <div style={{ 
              backgroundColor: 'var(--bg-subtle)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {project.workflow.map((step, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid var(--border-subtle)', 
          paddingTop: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          {missingComponents.length > 0 ? (
            <button 
              className="btn-primary"
              onClick={() => {
                onClose();
                if (onFindMissingComponents) {
                  onFindMissingComponents(missingComponents[0]?.name || '');
                }
              }}
            >
              <Layers size={16} />
              <span>Find Missing ({missingComponents[0]?.name}) in Marketplace</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.92rem' }}>
              ✅ You are ready to start building this project!
            </div>
          )}

          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
