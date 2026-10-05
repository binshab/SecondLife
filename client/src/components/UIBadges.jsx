import React from 'react';

export function StatCard({ icon: Icon, iconColor = 'green', label, value, subtext, badge }) {
  const iconBg = iconColor === 'green' ? 'var(--primary-light)' :
                 iconColor === 'blue' ? 'var(--secondary-light)' :
                 iconColor === 'amber' ? 'var(--accent-amber-light)' : 'var(--bg-subtle)';
  const iconFill = iconColor === 'green' ? 'var(--primary)' :
                   iconColor === 'blue' ? 'var(--secondary)' :
                   iconColor === 'amber' ? 'var(--accent-amber)' : 'var(--text-muted)';

  return (
    <div className="stat-card">
      <div className="stat-icon-box" style={{ backgroundColor: iconBg, color: iconFill }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <div className="stat-value">
          {value}
          {badge && <span className="stat-estimate-badge">{badge}</span>}
        </div>
        <div className="stat-label">{label}</div>
        {subtext && <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>{subtext}</div>}
      </div>
    </div>
  );
}

export function FeasibilityBadge({ score, matchGrade = '', showProgress = true }) {
  let gradeColor = 'var(--text-muted)';
  let fillColor = '#94a3b8';
  let badgeClass = 'badge-gray';

  if (score >= 90) {
    gradeColor = 'var(--primary)';
    fillColor = 'var(--primary)';
    badgeClass = 'badge-emerald';
  } else if (score >= 75) {
    gradeColor = '#0d9488';
    fillColor = '#0d9488';
    badgeClass = 'badge-teal';
  } else if (score >= 50) {
    gradeColor = 'var(--accent-amber)';
    fillColor = 'var(--accent-amber)';
    badgeClass = 'badge-amber';
  } else {
    gradeColor = '#64748b';
    fillColor = '#64748b';
    badgeClass = 'badge-gray';
  }

  return (
    <div className="feasibility-box">
      <div className="feasibility-header">
        <span className="feasibility-label">
          Feasibility:
          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
            {matchGrade || (score >= 90 ? 'Excellent' : score >= 75 ? 'Strong match' : score >= 50 ? 'Partial' : 'Low')}
          </span>
        </span>
        <span className="feasibility-percentage" style={{ color: gradeColor }}>
          {score}%
        </span>
      </div>

      {showProgress && (
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: fillColor }}
          />
        </div>
      )}
    </div>
  );
}

export function WasteBadge({ grams, isEstimate = true }) {
  const displayVal = grams >= 1000 ? `${(grams / 1000).toFixed(2)} kg` : `${grams} g`;
  return (
    <div className="waste-badge" title="Estimated electronic component waste diverted from municipal garbage">
      <span style={{ fontSize: '0.95rem' }}>🌱</span>
      <span>{isEstimate ? 'Est. Diverted:' : 'Diverted:'} <strong>{displayVal}</strong></span>
    </div>
  );
}
