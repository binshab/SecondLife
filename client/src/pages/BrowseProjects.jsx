import React, { useState } from 'react';
import { Compass, Search, Filter, Gauge, Sparkles } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

export default function BrowseProjects({ 
  projects = [], 
  matchResults = [], 
  onViewProjectDetails, 
  onNavigate 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = ['All', 'IoT & Automation', 'Agriculture & Green Tech', 'Environment & Climate', 'Smart Campus & Hygiene', 'Robotics & Assistive Tech', 'Security & Safety', 'Health & Environment', 'Education & Tools', 'Home & Energy Saving'];
  const difficulties = ['All', 'Beginner', 'Intermediate'];

  // Map each project to its match evaluation if available
  const evaluatedProjects = projects.map(proj => {
    const existingMatch = matchResults.find(m => m.project.id === proj.id);
    if (existingMatch) return existingMatch;
    return {
      project: proj,
      feasibilityScore: proj.feasibilityScore || 0,
      matchGrade: proj.matchGrade || 'Low match',
      matchedCount: proj.matchedCount || 0,
      totalRequiredCount: proj.requiredComponents?.length || 0,
      availableComponents: proj.availableComponents || [],
      missingComponents: proj.missingComponents || proj.requiredComponents || [],
      estimatedWasteDivertedGrams: proj.estimatedWasteDivertedGrams || 0,
      whyThisProject: proj.whyThisProject || ''
    };
  });

  // Filter based on search and dropdowns
  const filtered = evaluatedProjects.filter(item => {
    const p = item.project;
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const q = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.requiredComponents.some(c => c.name.toLowerCase().includes(q));

    return matchCat && matchDiff && matchSearch;
  });

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-title-row">
          <div>
            <h1 className="page-title">
              <Compass size={32} color="var(--primary)" />
              Predefined Project Library
            </h1>
            <p className="page-subtitle">
              Explore 12 realistic electronics and IoT builds designed specifically for component reuse and e-waste reduction in academic labs.
            </p>
          </div>

          <button 
            className="btn-primary"
            onClick={() => onNavigate('what-can-i-build')}
          >
            <Sparkles size={16} />
            <span>Match With My Inventory</span>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search project or component (e.g. ESP32, Ultrasonic)..."
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

          {/* Difficulty */}
          <div>
            <select
              className="form-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Projects List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filtered.length}</strong> predefined projects
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Compass size={32} />
          </div>
          <h3>No projects match your filter</h3>
          <p>Try resetting the search keyword or selecting a different category.</p>
          <button 
            className="btn-secondary"
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((item, idx) => (
            <ProjectCard
              key={item.project.id}
              projectMatch={item}
              onViewDetails={onViewProjectDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
