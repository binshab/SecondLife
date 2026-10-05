import React, { useState } from 'react';
import { 
  Recycle, 
  Cpu, 
  Sparkles, 
  Compass, 
  Share2, 
  Layers, 
  Inbox, 
  TrendingUp, 
  Menu, 
  X,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, onResetDemo, pendingRequestsCount = 1 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  const handleNav = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = async () => {
    if (onResetDemo) {
      await onResetDemo();
      setResetFeedback(true);
      setTimeout(() => setResetFeedback(false), 2200);
    }
  };

  return (
    <header className="header-bar">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => handleNav('dashboard')}>
          <div className="brand-logo-badge">
            <Recycle size={26} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-name">
              SECOND<span className="highlight">LIFE</span> ♻️
            </div>
            <span className="brand-tagline">Give unused electronics a second life</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-links-desktop">
          <button 
            className={`nav-link-btn ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            Dashboard
          </button>
          
          <button 
            className={`nav-link-btn ${activePage === 'my-components' ? 'active' : ''}`}
            onClick={() => handleNav('my-components')}
          >
            <Cpu size={16} />
            My Components
          </button>

          <button 
            className={`nav-link-btn ${activePage === 'projects' ? 'active' : ''}`}
            onClick={() => handleNav('projects')}
          >
            <Compass size={16} />
            Projects
          </button>

          <button 
            className={`nav-link-btn ${activePage === 'share-components' ? 'active' : ''}`}
            onClick={() => handleNav('share-components')}
          >
            <Share2 size={16} />
            Share
          </button>

          <button 
            className={`nav-link-btn ${activePage === 'available-components' ? 'active' : ''}`}
            onClick={() => handleNav('available-components')}
          >
            <Layers size={16} />
            Marketplace
          </button>

          <button 
            className={`nav-link-btn ${activePage === 'requests' ? 'active' : ''}`}
            onClick={() => handleNav('requests')}
            style={{ position: 'relative' }}
          >
            <Inbox size={16} />
            Requests
            {pendingRequestsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)'
              }} />
            )}
          </button>

          <button 
            className={`nav-link-btn ${activePage === 'impact' ? 'active' : ''}`}
            onClick={() => handleNav('impact')}
          >
            <TrendingUp size={16} />
            Impact
          </button>
        </nav>

        {/* Main CTA & Demo Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className={`nav-cta-btn ${activePage === 'what-can-i-build' ? 'active' : ''}`}
            onClick={() => handleNav('what-can-i-build')}
          >
            <Sparkles size={16} />
            What Can I Build?
          </button>

          <button 
            className="demo-preset-pill"
            onClick={handleReset}
            title="Reset to official Hackathon Demo State (ESP32, Ultrasonic, LED, Buzzer)"
          >
            {resetFeedback ? (
              <>
                <CheckCircle2 size={13} />
                Demo Seeded!
              </>
            ) : (
              <>
                <RotateCcw size={13} />
                Demo Reset
              </>
            )}
          </button>

          {/* Mobile hamburger */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="mobile-menu-drawer">
          <button 
            className={`nav-link-btn ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'my-components' ? 'active' : ''}`}
            onClick={() => handleNav('my-components')}
          >
            <Cpu size={16} /> My Components
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'what-can-i-build' ? 'active' : ''}`}
            onClick={() => handleNav('what-can-i-build')}
          >
            <Sparkles size={16} /> What Can I Build? (Main Feature)
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'projects' ? 'active' : ''}`}
            onClick={() => handleNav('projects')}
          >
            <Compass size={16} /> Browse Projects
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'share-components' ? 'active' : ''}`}
            onClick={() => handleNav('share-components')}
          >
            <Share2 size={16} /> Share Components
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'available-components' ? 'active' : ''}`}
            onClick={() => handleNav('available-components')}
          >
            <Layers size={16} /> Available Components
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'requests' ? 'active' : ''}`}
            onClick={() => handleNav('requests')}
          >
            <Inbox size={16} /> My Requests
          </button>
          <button 
            className={`nav-link-btn ${activePage === 'impact' ? 'active' : ''}`}
            onClick={() => handleNav('impact')}
          >
            <TrendingUp size={16} /> Impact Dashboard
          </button>
        </div>
      )}
    </header>
  );
}
