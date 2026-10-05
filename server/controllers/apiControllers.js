import { store } from '../data/store.js';
import { matchAllProjects, evaluateProjectMatch } from '../services/matchingService.js';
import { generateAIRecommendation } from '../services/aiExplanationService.js';
import { COMPONENT_CATEGORIES, COMPONENT_WEIGHTS } from '../seed/data.js';

// --- INVENTORY CONTROLLER ---
export const getInventory = (req, res) => {
  try {
    const items = store.getInventory();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addInventoryItem = (req, res) => {
  try {
    const { name, category, quantity, condition, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: "Component name is required" });
    }
    const item = store.addInventoryItem({ name, category, quantity, condition, description });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateInventoryItem = (req, res) => {
  try {
    const { id } = req.params;
    const updated = store.updateInventoryItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteInventoryItem = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = store.deleteInventoryItem(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const resetInventory = (req, res) => {
  try {
    store.resetToDefaults();
    res.json({ 
      success: true, 
      message: "Data reset to default hackathon demo state",
      inventory: store.getInventory() 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- PROJECTS & MATCHING CONTROLLER ---
export const getProjects = (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let list = store.getProjects();

    if (category && category !== "All") {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (difficulty && difficulty !== "All") {
      list = list.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.requiredComponents.some(c => c.name.toLowerCase().includes(q))
      );
    }

    // Also attach feasibility score against current inventory for convenience
    const currentInventory = store.getInventory();
    const evaluatedList = list.map(proj => {
      const match = evaluateProjectMatch(proj, currentInventory);
      return {
        ...proj,
        feasibilityScore: match.feasibilityScore,
        matchGrade: match.matchGrade,
        gradeColor: match.gradeColor,
        matchedCount: match.matchedCount,
        totalRequiredCount: match.totalRequiredCount,
        availableComponents: match.availableComponents,
        missingComponents: match.missingComponents,
        estimatedWasteDivertedGrams: match.estimatedWasteDivertedGrams,
        whyThisProject: match.whyThisProject
      };
    });

    res.json({ success: true, count: evaluatedList.length, data: evaluatedList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const project = store.getProjectById(id);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    const currentInventory = store.getInventory();
    const match = evaluateProjectMatch(project, currentInventory);
    const aiExplanation = generateAIRecommendation(match);

    res.json({
      success: true,
      data: {
        ...project,
        matchEvaluation: match,
        aiExplanation
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const matchUserComponents = (req, res) => {
  try {
    // If components array is supplied in body, use it; otherwise use stored inventory
    const components = req.body.components && Array.isArray(req.body.components) 
      ? req.body.components 
      : store.getInventory();

    const rankedMatches = matchAllProjects(components);

    // Add AI explanation for the top matched project
    const enrichedResults = rankedMatches.map((matchItem, index) => {
      if (index === 0 || matchItem.feasibilityScore >= 75) {
        return {
          ...matchItem,
          aiRecommendation: generateAIRecommendation(matchItem)
        };
      }
      return matchItem;
    });

    res.json({
      success: true,
      count: enrichedResults.length,
      evaluatedInventoryCount: components.length,
      data: enrichedResults
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- LISTINGS CONTROLLER ---
export const getListings = (req, res) => {
  try {
    const { category, reuseMode, search } = req.query;
    const listings = store.getListings({ category, reuseMode, search });
    res.json({ success: true, count: listings.length, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createListing = (req, res) => {
  try {
    const { componentName, category, quantity, condition, description, location, reuseMode, price } = req.body;
    if (!componentName || !componentName.trim()) {
      return res.status(400).json({ success: false, error: "Component name is required" });
    }
    const newListing = store.addListing({
      componentName,
      category,
      quantity,
      condition,
      description,
      location,
      reuseMode,
      price
    });
    res.status(201).json({ success: true, data: newListing });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- REQUESTS CONTROLLER ---
export const getRequests = (req, res) => {
  try {
    const requests = store.getRequests();
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createRequest = (req, res) => {
  try {
    const { listingId, componentName, requestedQuantity, intendedProject, ownerName, ownerEmail, ownerLocation } = req.body;
    if (!componentName || !intendedProject) {
      return res.status(400).json({ success: false, error: "Component name and intended project reason are required" });
    }
    const newReq = store.addRequest({
      listingId,
      componentName,
      requestedQuantity,
      intendedProject,
      ownerName,
      ownerEmail,
      ownerLocation
    });
    res.status(201).json({ 
      success: true, 
      message: "Request sent successfully to the component owner!", 
      data: newReq 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateRequestStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, handoverNotes } = req.body;
    if (!status || !["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, error: "Valid status (Pending, Accepted, Rejected) is required" });
    }
    const updated = store.updateRequestStatus(id, { status, handoverNotes });
    if (!updated) {
      return res.status(404).json({ success: false, error: "Request not found" });
    }
    res.json({ 
      success: true, 
      message: status === "Accepted" 
        ? "Request accepted. Contact the component owner to arrange the handover." 
        : `Request marked as ${status}`, 
      data: updated 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- IMPACT CONTROLLER ---
export const getImpact = (req, res) => {
  try {
    const impact = store.getImpactMetrics();
    res.json({ success: true, data: impact });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- AI EXPLANATION CONTROLLER ---
export const getAIExplanation = (req, res) => {
  try {
    const { projectId } = req.body;
    const project = store.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    const userInventory = store.getInventory();
    const match = evaluateProjectMatch(project, userInventory);
    const explanation = generateAIRecommendation(match);
    res.json({ success: true, data: explanation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- METADATA ---
export const getMetadata = (req, res) => {
  res.json({
    success: true,
    categories: COMPONENT_CATEGORIES,
    standardWeights: COMPONENT_WEIGHTS
  });
};
