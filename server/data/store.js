import {
  INITIAL_USER_INVENTORY,
  INITIAL_LISTINGS,
  INITIAL_REQUESTS,
  PREDEFINED_PROJECTS,
  INITIAL_IMPACT_HISTORY,
  COMPONENT_CATEGORIES
} from '../seed/data.js';
import { getComponentWeight } from '../services/wasteService.js';

class DataStore {
  constructor() {
    this.resetToDefaults();
  }

  resetToDefaults() {
    this.userInventory = JSON.parse(JSON.stringify(INITIAL_USER_INVENTORY));
    this.listings = JSON.parse(JSON.stringify(INITIAL_LISTINGS));
    this.requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
    this.projects = JSON.parse(JSON.stringify(PREDEFINED_PROJECTS));
    this.impactHistory = JSON.parse(JSON.stringify(INITIAL_IMPACT_HISTORY));
  }

  // --- INVENTORY METHODS ---
  getInventory() {
    return this.userInventory;
  }

  addInventoryItem(item) {
    const weight = item.weight || getComponentWeight(item.name);
    const newItem = {
      id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: item.name.trim(),
      category: item.category || "Basic Electronics",
      quantity: Number(item.quantity) || 1,
      condition: item.condition || "Working",
      description: item.description || "",
      weightPerUnit: weight,
      addedAt: new Date().toISOString()
    };
    this.userInventory.push(newItem);
    return newItem;
  }

  updateInventoryItem(id, updates) {
    const index = this.userInventory.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    if (updates.name) {
      updates.weightPerUnit = getComponentWeight(updates.name);
    }
    if (updates.quantity) {
      updates.quantity = Number(updates.quantity);
    }
    this.userInventory[index] = { ...this.userInventory[index], ...updates };
    return this.userInventory[index];
  }

  deleteInventoryItem(id) {
    const index = this.userInventory.findIndex(i => i.id === id);
    if (index === -1) return false;
    this.userInventory.splice(index, 1);
    return true;
  }

  // --- LISTINGS METHODS ---
  getListings(filters = {}) {
    let result = [...this.listings];
    if (filters.category && filters.category !== "All") {
      result = result.filter(l => l.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.reuseMode && filters.reuseMode !== "All") {
      result = result.filter(l => l.reuseMode === filters.reuseMode);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(l => 
        l.componentName.toLowerCase().includes(q) || 
        l.location.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q))
      );
    }
    return result;
  }

  addListing(listing) {
    const newListing = {
      id: `list-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      componentName: listing.componentName.trim(),
      category: listing.category || "Basic Electronics",
      quantity: Number(listing.quantity) || 1,
      condition: listing.condition || "Working",
      description: listing.description || "",
      location: listing.location || "Chennai",
      reuseMode: listing.reuseMode || "Free Donation",
      price: listing.reuseMode === "Low-cost Transfer" ? Number(listing.price || 0) : 0,
      postedBy: listing.postedBy || "You (Demo User)",
      postedAt: new Date().toISOString(),
      status: "Available"
    };
    this.listings.unshift(newListing);
    return newListing;
  }

  // --- REQUESTS METHODS ---
  getRequests(userId = "You (Demo User)") {
    return this.requests;
  }

  addRequest(requestData) {
    const newReq = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      listingId: requestData.listingId,
      componentName: requestData.componentName,
      requestedQuantity: Number(requestData.requestedQuantity) || 1,
      requesterName: requestData.requesterName || "You (Demo User)",
      requesterEmail: requestData.requesterEmail || "student.maker@college.edu",
      ownerName: requestData.ownerName || "Component Owner",
      ownerEmail: requestData.ownerEmail || "owner@college.edu",
      ownerLocation: requestData.ownerLocation || "Chennai",
      intendedProject: requestData.intendedProject || "Academic project reuse",
      status: "Pending",
      requestedAt: new Date().toISOString(),
      type: requestData.ownerName === "You (Demo User)" ? "incoming" : "outgoing"
    };
    this.requests.unshift(newReq);
    return newReq;
  }

  updateRequestStatus(id, { status, handoverNotes }) {
    const req = this.requests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;
    if (handoverNotes !== undefined) {
      req.handoverNotes = handoverNotes;
    }
    return req;
  }

  // --- PROJECTS ---
  getProjects() {
    return this.projects;
  }

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  // --- IMPACT CALCULATION ---
  getImpactMetrics() {
    const componentsListed = this.listings.reduce((sum, l) => sum + (l.quantity || 1), 0) + 120;
    
    // Accepted requests = reused components
    const acceptedRequests = this.requests.filter(r => r.status === "Accepted");
    const componentsReusedFromRequests = acceptedRequests.reduce((sum, r) => sum + (r.requestedQuantity || 1), 0);
    const componentsReused = 42 + componentsReusedFromRequests;
    
    const projectsEnabled = 18 + Math.floor(componentsReusedFromRequests / 2);

    // Calculate approximate weight diverted in kg
    const baseGrams = 1810;
    const additionalGrams = acceptedRequests.reduce((sum, r) => {
      return sum + (getComponentWeight(r.componentName) * (r.requestedQuantity || 1));
    }, 0);
    const totalGramsDiverted = baseGrams + additionalGrams;
    const kgDiverted = (totalGramsDiverted / 1000).toFixed(2);

    // User's contribution
    const userContributedItems = this.userInventory.length + 
      this.listings.filter(l => l.postedBy.includes("You")).length +
      acceptedRequests.filter(r => r.ownerName.includes("You") || r.requesterName.includes("You")).length;

    return {
      componentsListed,
      componentsReused,
      projectsEnabled,
      estimatedEwasteDivertedKg: kgDiverted,
      estimatedEwasteDivertedGrams: totalGramsDiverted,
      activeListings: this.listings.filter(l => l.status === "Available").length,
      userContributionCount: Math.max(6, userContributedItems),
      history: this.impactHistory,
      disclaimer: "Estimated approximate electronic waste diverted from municipal e-waste streams."
    };
  }
}

export const store = new DataStore();
