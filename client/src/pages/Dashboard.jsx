import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Share2, 
  Recycle, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import { StatCard } from '../components/UIBadges';
import ProjectCard from '../components/ProjectCard';

export default function Dashboard({ 
  inventory = [], 
  onNavigate, 
  onViewProjectDetails, 
  impactData,
  topRecommendations = [] 
}) {
  return (
    <div>
      {/* Hero Welcome */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              Welcome to SecondLife ♻️
            </h1>
            <p className="page-subtitle">
              Turn unused electronics into your next project. Give circuit boards, sensors, and microcontrollers a second chance instead of ending in landfills.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-emerald" style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}>
              <Cpu size={14} /> Active Inventory: {inventory.length} Components
            </span>
          </div>
        </div>
      </section>

      {/* Two Large Primary Action Cards */}
      <section className="action-cards-grid">
        {/* Card A: WHAT CAN I BUILD */}
        <div className="action-card card-featured">
          <div>
            <div className="card-top-icon green">
              <Sparkles size={28} />
            </div>
            <h3>WHAT CAN I BUILD?</h3>
            <p>
              Tell us what components you physically have and discover realistic engineering projects you can create right now.
            </p>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%' }}
            onClick={() => onNavigate('what-can-i-build')}
          >
            <span>Find Projects</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Card B: SHARE MY COMPONENTS */}
        <div className="action-card">
          <div>
            <div className="card-top-icon blue">
              <Share2 size={28} />
            </div>
            <h3>SHARE MY COMPONENTS</h3>
            <p>
              Have unused electronics left over from a past semester, hobby project, or college lab? List them for free donation or low-cost transfer.
            </p>
          </div>

          <button 
            className="btn-secondary" 
            style={{ width: '100%' }}
            onClick={() => onNavigate('share-components')}
          >
            <span>List Components</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Impact Statistics Row */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="var(--primary)" />
            Community Sustainability Impact
          </h2>
          <button 
            className="btn-secondary btn-sm"
            onClick={() => onNavigate('impact')}
          >
            View Full Report
          </button>
        </div>

        <div className="stats-grid">
          <StatCard 
            icon={Recycle}
            iconColor="green"
            label="Components Reused"
            value={impactData?.componentsReused || 42}
            subtext="Hardware given a 2nd life"
          />

          <StatCard 
            icon={CheckCircle2}
            iconColor="blue"
            label="Projects Enabled"
            value={impactData?.projectsEnabled || 18}
            subtext="Student prototypes built"
          />

          <StatCard 
            icon={Scale}
            iconColor="green"
            label="E-waste Diverted"
            value={`${impactData?.estimatedEwasteDivertedKg || '1.81'} kg`}
            badge="ESTIMATE"
            subtext="Prevented from landfills"
          />

          <StatCard 
            icon={Layers}
            iconColor="amber"
            label="Active Listings"
            value={impactData?.activeListings || 8}
            subtext="Available in Chennai area"
          />
        </div>
      </section>

      {/* "Recommended for You" Section (3 Project Cards based on user's components) */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              Recommended for You
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Top projects matched against your {inventory.length} physical components ({inventory.map(c => c.name).join(', ') || 'None'})
            </p>
          </div>

          <button 
            className="btn-secondary btn-sm"
            onClick={() => onNavigate('what-can-i-build')}
          >
            See All Matches
          </button>
        </div>

        <div className="projects-grid">
          {topRecommendations.slice(0, 3).map((match, idx) => (
            <ProjectCard 
              key={match.project.id}
              projectMatch={match}
              rankIndex={idx}
              onViewDetails={onViewProjectDetails}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
