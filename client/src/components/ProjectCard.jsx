import React from 'react';
import { Check, X, ArrowRight, Clock, Gauge } from 'lucide-react';
import { FeasibilityBadge, WasteBadge } from './UIBadges';

export default function ProjectCard({ 
  projectMatch, 
  onViewDetails, 
  rankIndex = null,
  compact = false 
}) {
  const {
    project,
    feasibilityScore = 0,
    matchGrade = '',
    matchedCount = 0,
    totalRequiredCount = (project?.requiredComponents?.length || 0),
    availableComponents = [],
    missingComponents = [],
    estimatedWasteDivertedGrams = 0,
    whyThisProject = ''
  } = projectMatch || {};

  if (!project) return null;

  return (
    <div className={`project-card ${rankIndex === 0 && feasibilityScore >= 75 ? 'highlight-rank-1' : ''}`}>
      {rankIndex === 0 && feasibilityScore >= 75 && (
        <div className="rank-ribbon">
          ★ Top Recommended
        </div>
      )}

      <div>
        <div className="project-header-meta">
          <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
            {project.category}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            <Gauge size={13} />
            <span>{project.difficulty}</span>
          </div>
        </div>

        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-desc">{project.description}</p>

        {/* Feasibility Metric */}
        <FeasibilityBadge score={feasibilityScore} matchGrade={matchGrade} />

        {/* Component Availability summary */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.84rem',
          fontWeight: '600',
          marginBottom: '0.65rem'
        }}>
          <span>Available components:</span>
          <span style={{ color: matchedCount === totalRequiredCount ? 'var(--primary)' : 'var(--text-main)' }}>
            {matchedCount} / {totalRequiredCount}
          </span>
        </div>

        {/* Visual Component Checklist Pills */}
        <div className="component-status-pills">
          {availableComponents.map((comp, idx) => (
            <span key={`avail-${idx}`} className="comp-pill available" title={`${comp.name} is in your inventory`}>
              <Check size={11} strokeWidth={3} />
              {comp.name} {comp.requiredQty > 1 ? `(${comp.requiredQty})` : ''}
            </span>
          ))}
          {missingComponents.map((comp, idx) => (
            <span key={`miss-${idx}`} className="comp-pill missing" title={`Missing: ${comp.name}`}>
              <X size={11} strokeWidth={3} />
              {comp.name}
            </span>
          ))}
        </div>

        {/* Why this project? */}
        {whyThisProject && !compact && (
          <div className="why-callout">
            <strong>Why this project?</strong> {whyThisProject}
          </div>
        )}
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <WasteBadge grams={estimatedWasteDivertedGrams} />
        
        <button 
          className="btn-primary btn-sm"
          onClick={() => onViewDetails(projectMatch)}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
