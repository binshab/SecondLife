import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MyComponents from './pages/MyComponents';
import WhatCanIBuild from './pages/WhatCanIBuild';
import BrowseProjects from './pages/BrowseProjects';
import ShareComponents from './pages/ShareComponents';
import AvailableComponents from './pages/AvailableComponents';
import MyRequests from './pages/MyRequests';
import ImpactDashboard from './pages/ImpactDashboard';
import ProjectDetailModal from './components/ProjectDetailModal';
import { api } from './services/api';
import { Sparkles, Recycle, Heart } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [projects, setProjects] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);

  // Modal state
  const [selectedProjectForModal, setSelectedProjectForModal] = useState(null);
  const [highlightMarketplaceItem, setHighlightMarketplaceItem] = useState('');

  // Initial load
  const loadAllData = async () => {
    try {
      setLoading(true);
      const [inv, projs, lists, reqs, impact] = await Promise.all([
        api.getInventory(),
        api.getProjects(),
        api.getListings(),
        api.getRequests(),
        api.getImpact()
      ]);

      setInventory(inv);
      setProjects(projs);
      setListings(lists);
      setRequests(reqs);
      setImpactData(impact);

      // Perform initial match
      const matched = await api.matchProjects(inv);
      setMatchResults(matched);
    } catch (err) {
      console.error("Error loading SecondLife data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Matching handler
  const handleRunMatch = async (componentsToMatch) => {
    try {
      setMatchLoading(true);
      const results = await api.matchProjects(componentsToMatch || inventory);
      setMatchResults(results);
    } catch (err) {
      console.error("Error running match:", err);
    } finally {
      setMatchLoading(false);
    }
  };

  // Inventory actions
  const handleAddInventory = async (item) => {
    const created = await api.addInventoryItem(item);
    const updated = [...inventory, created];
    setInventory(updated);
    handleRunMatch(updated);
  };

  const handleUpdateInventory = async (id, updates) => {
    const updated = await api.updateInventoryItem(id, updates);
    const list = inventory.map(i => i.id === id ? updated : i);
    setInventory(list);
    handleRunMatch(list);
  };

  const handleDeleteInventory = async (id) => {
    await api.deleteInventoryItem(id);
    const list = inventory.filter(i => i.id !== id);
    setInventory(list);
    handleRunMatch(list);
  };

  // Reset demo state (ESP32, Ultrasonic, LED, Buzzer)
  const handleResetDemo = async () => {
    const result = await api.resetDemoData();
    setInventory(result.inventory);
    setListings(result.listings);
    setRequests(result.requests);
    const matched = await api.matchProjects(result.inventory);
    setMatchResults(matched);
    const impact = await api.getImpact();
    setImpactData(impact);
  };

  // Listings actions
  const handleAddListing = async (listingData) => {
    const created = await api.createListing(listingData);
    setListings([created, ...listings]);
    const impact = await api.getImpact();
    setImpactData(impact);
  };

  // Requests actions
  const handleRequestComponent = async (requestData) => {
    const created = await api.createRequest(requestData);
    setRequests([created, ...requests]);
    const impact = await api.getImpact();
    setImpactData(impact);
  };

  const handleUpdateRequestStatus = async (id, { status, handoverNotes }) => {
    const updated = await api.updateRequestStatus(id, { status, handoverNotes });
    setRequests(requests.map(r => r.id === id ? updated : r));
    const impact = await api.getImpact();
    setImpactData(impact);
  };

  // Switch to Marketplace with search query for missing component
  const handleFindMissingComponents = (componentName) => {
    setHighlightMarketplaceItem(componentName);
    setActivePage('available-components');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Count pending incoming requests
  const pendingIncomingCount = requests.filter(r => r.type === 'incoming' && r.status === 'Pending').length;

  return (
    <div className="app-container">
      {/* Sticky Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'available-components') {
            setHighlightMarketplaceItem('');
          }
        }} 
        onResetDemo={handleResetDemo}
        pendingRequestsCount={pendingIncomingCount}
      />

      {/* Main Page Router */}
      <main className="main-wrapper">
        {activePage === 'dashboard' && (
          <Dashboard 
            inventory={inventory}
            onNavigate={setActivePage}
            onViewProjectDetails={setSelectedProjectForModal}
            impactData={impactData}
            topRecommendations={matchResults}
          />
        )}

        {activePage === 'my-components' && (
          <MyComponents 
            inventory={inventory}
            onAdd={handleAddInventory}
            onUpdate={handleUpdateInventory}
            onDelete={handleDeleteInventory}
            onResetDemo={handleResetDemo}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'what-can-i-build' && (
          <WhatCanIBuild 
            inventory={inventory}
            onRunMatch={handleRunMatch}
            matchResults={matchResults}
            loading={matchLoading}
            onViewProjectDetails={setSelectedProjectForModal}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'projects' && (
          <BrowseProjects 
            projects={projects}
            matchResults={matchResults}
            onViewProjectDetails={setSelectedProjectForModal}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'share-components' && (
          <ShareComponents 
            onAddListing={handleAddListing}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'available-components' && (
          <AvailableComponents 
            listings={listings}
            onRequestComponent={handleRequestComponent}
            onNavigate={setActivePage}
            highlightComponentName={highlightMarketplaceItem}
          />
        )}

        {activePage === 'requests' && (
          <MyRequests 
            requests={requests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'impact' && (
          <ImpactDashboard 
            impactData={impactData}
            onNavigate={setActivePage}
          />
        )}
      </main>

      {/* Project Details Modal */}
      {selectedProjectForModal && (
        <ProjectDetailModal 
          projectMatch={selectedProjectForModal}
          onClose={() => setSelectedProjectForModal(null)}
          onFindMissingComponents={handleFindMissingComponents}
        />
      )}

      {/* Clean Footer */}
      <footer className="footer-bar">
        <div className="footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Recycle size={18} />
            </div>
            <div>
              <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>SECOND LIFE ♻️</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', marginLeft: '0.5rem' }}>
                "Give unused electronics a second life."
              </span>
            </div>
          </div>

          <div className="footer-text">
            Built for Academic Project Teams, Hackathon Demos, & Sustainable Makers
          </div>
        </div>
      </footer>
    </div>
  );
}
