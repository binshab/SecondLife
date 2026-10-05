import { Router } from 'express';
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  resetInventory,
  getProjects,
  getProjectById,
  matchUserComponents,
  getListings,
  createListing,
  getRequests,
  createRequest,
  updateRequestStatus,
  getImpact,
  getAIExplanation,
  getMetadata
} from '../controllers/apiControllers.js';

const router = Router();

// Metadata
router.get('/metadata', getMetadata);

// Inventory
router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);
router.delete('/inventory/:id', deleteInventoryItem);
router.post('/inventory/reset', resetInventory);

// Projects & Matching
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects/match', matchUserComponents);

// Marketplace Listings (Share Components)
router.get('/listings', getListings);
router.post('/listings', createListing);

// Requests
router.get('/requests', getRequests);
router.post('/requests', createRequest);
router.put('/requests/:id/status', updateRequestStatus);

// Impact Dashboard
router.get('/impact', getImpact);

// AI Recommendation
router.post('/ai-explain', getAIExplanation);

export default router;
