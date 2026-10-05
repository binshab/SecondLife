import { COMPONENT_WEIGHTS } from '../seed/data.js';

/**
 * Waste Reduction Service
 * Calculates estimated electronic waste diverted in grams and kilograms
 * based on standard approximate physical weights of components.
 */

export function getComponentWeight(componentName) {
  if (!componentName) return COMPONENT_WEIGHTS["Default"];
  const trimmed = componentName.trim();
  
  // Exact match
  if (COMPONENT_WEIGHTS[trimmed] !== undefined) {
    return COMPONENT_WEIGHTS[trimmed];
  }
  
  // Case-insensitive match or fuzzy prefix
  const lower = trimmed.toLowerCase();
  for (const [key, weight] of Object.entries(COMPONENT_WEIGHTS)) {
    if (lower === key.toLowerCase() || lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return weight;
    }
  }
  
  return COMPONENT_WEIGHTS["Default"];
}

export function calculateDivertedWaste(componentsList) {
  if (!Array.isArray(componentsList) || componentsList.length === 0) {
    return {
      grams: 0,
      formatted: "0 g",
      breakdown: []
    };
  }

  let totalGrams = 0;
  const breakdown = [];

  for (const comp of componentsList) {
    const name = comp.name || comp.componentName || "Component";
    const qty = comp.quantity || 1;
    const unitWeight = comp.weight !== undefined ? comp.weight : getComponentWeight(name);
    const subtotal = unitWeight * qty;
    totalGrams += subtotal;

    breakdown.push({
      name,
      quantity: qty,
      unitWeightGrams: unitWeight,
      totalGrams: subtotal
    });
  }

  const formatted = totalGrams >= 1000 
    ? `${(totalGrams / 1000).toFixed(2)} kg` 
    : `${totalGrams} g`;

  return {
    grams: totalGrams,
    formatted,
    breakdown,
    disclaimer: "Estimated approximate electronic waste diverted from landfill disposal."
  };
}
