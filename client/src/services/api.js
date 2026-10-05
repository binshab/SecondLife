import {
  INITIAL_USER_INVENTORY,
  INITIAL_LISTINGS,
  INITIAL_REQUESTS,
  PREDEFINED_PROJECTS,
  INITIAL_IMPACT_HISTORY,
  COMPONENT_CATEGORIES,
  COMPONENT_WEIGHTS
} from '../utils/seedData.js';

// Local storage keys for resilient offline/standalone persistence
const STORAGE_KEYS = {
  INVENTORY: 'secondlife_inventory',
  LISTINGS: 'secondlife_listings',
  REQUESTS: 'secondlife_requests',
  IMPACT: 'secondlife_impact'
};

function getLocal(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // ignore
  }
}

// Ensure defaults in localStorage
if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
  setLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
}
if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
  setLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
}
if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
  setLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
}

// API Service
export const api = {
  // Inventory
  async getInventory() {
    try {
      const res = await fetch('/api/inventory');
      if (res.ok) {
        const json = await res.json();
        setLocal(STORAGE_KEYS.INVENTORY, json.data);
        return json.data;
      }
    } catch (err) {
      console.warn("Backend unavailable, using local store:", err);
    }
    return getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
  },

  async addInventoryItem(item) {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
        setLocal(STORAGE_KEYS.INVENTORY, [...current, json.data]);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local add:", err);
    }
    const current = getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
    const newItem = {
      id: `inv-${Date.now()}`,
      name: item.name.trim(),
      category: item.category || 'Basic Electronics',
      quantity: Number(item.quantity) || 1,
      condition: item.condition || 'Working',
      description: item.description || '',
      weightPerUnit: COMPONENT_WEIGHTS[item.name.trim()] || 10,
      addedAt: new Date().toISOString()
    };
    const updated = [...current, newItem];
    setLocal(STORAGE_KEYS.INVENTORY, updated);
    return newItem;
  },

  async updateInventoryItem(id, updates) {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Using local update:", err);
    }
    const current = getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
    const updated = current.map(item => item.id === id ? { ...item, ...updates } : item);
    setLocal(STORAGE_KEYS.INVENTORY, updated);
    return updated.find(item => item.id === id);
  },

  async deleteInventoryItem(id) {
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const current = getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
        setLocal(STORAGE_KEYS.INVENTORY, current.filter(i => i.id !== id));
        return true;
      }
    } catch (err) {
      console.warn("Using local delete:", err);
    }
    const current = getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
    const filtered = current.filter(i => i.id !== id);
    setLocal(STORAGE_KEYS.INVENTORY, filtered);
    return true;
  },

  async resetDemoData() {
    try {
      await fetch('/api/inventory/reset', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    setLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY);
    setLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    setLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    return {
      inventory: INITIAL_USER_INVENTORY,
      listings: INITIAL_LISTINGS,
      requests: INITIAL_REQUESTS
    };
  },

  // Projects & Matching
  async getProjects(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/projects?${params}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Using local projects:", err);
    }
    return PREDEFINED_PROJECTS;
  },

  async matchProjects(components = null) {
    try {
      const res = await fetch('/api/projects/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components })
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Backend match endpoint error, using local computation:", err);
    }
    // Client-side fallback matching
    return fallbackMatch(components || getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY));
  },

  async getProjectById(id) {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn("Using local project detail:", e);
    }
    const proj = PREDEFINED_PROJECTS.find(p => p.id === id);
    const matches = fallbackMatch(getLocal(STORAGE_KEYS.INVENTORY, INITIAL_USER_INVENTORY));
    const match = matches.find(m => m.project.id === id) || {
      feasibilityScore: 75,
      matchGrade: "Strong match",
      availableComponents: [],
      missingComponents: [],
      estimatedWasteDivertedGrams: 42
    };
    return {
      ...proj,
      matchEvaluation: match,
      aiExplanation: {
        headline: `💡 Recommendation for ${proj?.name}`,
        explanation: `Matches key components in your inventory. Sourcing missing parts will enable full build completion.`,
        sustainabilityNote: `Estimated waste diverted: ${match.estimatedWasteDivertedGrams || 42}g`
      }
    };
  },

  // Listings
  async getListings(filters = {}) {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/listings?${params}`);
      if (res.ok) {
        const json = await res.json();
        setLocal(STORAGE_KEYS.LISTINGS, json.data);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local listings:", err);
    }
    return getLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  },

  async createListing(listing) {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
        setLocal(STORAGE_KEYS.LISTINGS, [json.data, ...current]);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local create listing:", err);
    }
    const current = getLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const newListing = {
      id: `list-${Date.now()}`,
      componentName: listing.componentName.trim(),
      category: listing.category || 'Basic Electronics',
      quantity: Number(listing.quantity) || 1,
      condition: listing.condition || 'Working',
      description: listing.description || '',
      location: listing.location || 'Chennai',
      reuseMode: listing.reuseMode || 'Free Donation',
      price: listing.reuseMode === 'Low-cost Transfer' ? Number(listing.price || 0) : 0,
      postedBy: 'You (Demo User)',
      postedAt: new Date().toISOString(),
      status: 'Available'
    };
    setLocal(STORAGE_KEYS.LISTINGS, [newListing, ...current]);
    return newListing;
  },

  // Requests
  async getRequests() {
    try {
      const res = await fetch('/api/requests');
      if (res.ok) {
        const json = await res.json();
        setLocal(STORAGE_KEYS.REQUESTS, json.data);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local requests:", err);
    }
    return getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  async createRequest(reqData) {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData)
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
        setLocal(STORAGE_KEYS.REQUESTS, [json.data, ...current]);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local create request:", err);
    }
    const current = getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const newReq = {
      id: `req-${Date.now()}`,
      listingId: reqData.listingId,
      componentName: reqData.componentName,
      requestedQuantity: Number(reqData.requestedQuantity) || 1,
      requesterName: 'You (Demo User)',
      requesterEmail: 'student.maker@college.edu',
      ownerName: reqData.ownerName || 'Component Owner',
      ownerEmail: reqData.ownerEmail || 'owner@college.edu',
      ownerLocation: reqData.ownerLocation || 'Chennai',
      intendedProject: reqData.intendedProject,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
      type: 'outgoing'
    };
    setLocal(STORAGE_KEYS.REQUESTS, [newReq, ...current]);
    return newReq;
  },

  async updateRequestStatus(id, { status, handoverNotes }) {
    try {
      const res = await fetch(`/api/requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, handoverNotes })
      });
      if (res.ok) {
        const json = await res.json();
        const current = getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
        const updated = current.map(r => r.id === id ? { ...r, status, handoverNotes } : r);
        setLocal(STORAGE_KEYS.REQUESTS, updated);
        return json.data;
      }
    } catch (err) {
      console.warn("Using local update request:", err);
    }
    const current = getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const updated = current.map(r => r.id === id ? { ...r, status, handoverNotes } : r);
    setLocal(STORAGE_KEYS.REQUESTS, updated);
    return updated.find(r => r.id === id);
  },

  // Impact
  async getImpact() {
    try {
      const res = await fetch('/api/impact');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn("Using local impact:", err);
    }
    const requests = getLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const listings = getLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const accepted = requests.filter(r => r.status === 'Accepted');
    const extraGrams = accepted.length * 25;
    return {
      componentsListed: 120 + listings.length,
      componentsReused: 42 + accepted.length,
      projectsEnabled: 18 + Math.floor(accepted.length / 2),
      estimatedEwasteDivertedKg: ((1810 + extraGrams) / 1000).toFixed(2),
      estimatedEwasteDivertedGrams: 1810 + extraGrams,
      activeListings: listings.length,
      userContributionCount: 6 + accepted.length,
      history: INITIAL_IMPACT_HISTORY,
      disclaimer: "Estimated approximate electronic waste diverted from municipal e-waste streams."
    };
  }
};

// Fallback matching helper
function fallbackMatch(inventory) {
  const norm = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return PREDEFINED_PROJECTS.map(project => {
    let matched = 0;
    let wasteGrams = 0;
    const available = [];
    const missing = [];

    for (const req of project.requiredComponents) {
      const found = inventory.find(i => norm(i.name).includes(norm(req.name)) || norm(req.name).includes(norm(i.name)));
      const weight = req.weight || COMPONENT_WEIGHTS[req.name] || 10;
      if (found && (found.quantity || 1) > 0) {
        matched++;
        wasteGrams += weight * Math.min(found.quantity, req.quantity);
        available.push({
          name: req.name,
          category: req.category,
          requiredQty: req.quantity,
          availableQty: found.quantity,
          unitWeight: weight,
          condition: found.condition || "Working"
        });
      } else {
        missing.push({
          name: req.name,
          category: req.category,
          requiredQty: req.quantity,
          availableQty: 0,
          missingQty: req.quantity,
          unitWeight: weight
        });
      }
    }

    const feasibilityScore = Math.round((matched / project.requiredComponents.length) * 100);
    let matchGrade = "Low match";
    let gradeColor = "slate";
    if (feasibilityScore >= 90) { matchGrade = "Excellent match"; gradeColor = "emerald"; }
    else if (feasibilityScore >= 75) { matchGrade = "Strong match"; gradeColor = "teal"; }
    else if (feasibilityScore >= 50) { matchGrade = "Partial match"; gradeColor = "amber"; }

    return {
      project,
      feasibilityScore,
      matchGrade,
      gradeColor,
      matchedCount: matched,
      totalRequiredCount: project.requiredComponents.length,
      availableComponents: available,
      missingComponents: missing,
      estimatedWasteDivertedGrams: wasteGrams,
      calculationDetail: `(${matched} available / ${project.requiredComponents.length} required types) × 100 = ${feasibilityScore}%`,
      whyThisProject: matched === project.requiredComponents.length 
        ? "All required components are available in your inventory!" 
        : `${matched} of ${project.requiredComponents.length} required components are available. Missing: ${missing.map(m => m.name).join(', ')}.`
    };
  }).sort((a, b) => b.feasibilityScore - a.feasibilityScore);
}
