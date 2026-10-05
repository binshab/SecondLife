import { PREDEFINED_PROJECTS } from '../seed/data.js';
import { getComponentWeight } from './wasteService.js';

/**
 * Normalizes component names for deterministic comparison
 */
function normalizeName(name) {
  if (!name) return "";
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Checks if a required component is satisfied by a user component
 */
function isComponentMatch(reqName, userCompName) {
  const normReq = normalizeName(reqName);
  const normUser = normalizeName(userCompName);

  if (normReq === normUser) return true;
  if (normUser.includes(normReq) || normReq.includes(normUser)) return true;

  // Specific common aliases in hardware & IoT
  const aliases = [
    ["esp32", "esp32devkit", "esp32board", "nodemcu32"],
    ["arduinouno", "arduinounor3", "arduino"],
    ["ultrasonicsensor", "hcsr04", "ultrasonic"],
    ["dht11", "dht11sensor", "dht11temperaturehumiditysensor", "dht22"],
    ["soilmoisturesensor", "soilsensor", "soilmoisture"],
    ["oleddisplay", "oled", "ssd1306", "096oled"],
    ["lcd16x2display", "lcd1602", "lcd16x2", "lcdscreen"],
    ["servomotor", "sg90", "servo", "microservo"],
    ["relaymodule", "relay", "5vrelay"],
    ["pirsensor", "pirmotionsensor", "hcsr501", "pir"],
    ["ldrsensor", "ldr", "photoresistor", "lightdetectorsensor"],
    ["mq2gassensor", "mq2", "gassensor", "smokesensor"],
    ["rfidrc522", "rc522", "rfidreader", "rfidmodule"],
    ["led", "leds", "lightemittingdiode"],
    ["buzzer", "piezobuzzer", "activebuzzer", "passivebuzzer"]
  ];

  for (const group of aliases) {
    const hasReq = group.some(alias => normReq.includes(alias) || alias.includes(normReq));
    const hasUser = group.some(alias => normUser.includes(alias) || alias.includes(normUser));
    if (hasReq && hasUser) return true;
  }

  return false;
}

/**
 * Computes feasibility score and match breakdown for a single project
 * given a list of available user components.
 */
export function evaluateProjectMatch(project, userInventory = []) {
  const required = project.requiredComponents || [];
  const totalRequiredTypes = required.length;

  if (totalRequiredTypes === 0) {
    return {
      project,
      feasibilityScore: 100,
      matchGrade: "Excellent match",
      matchedCount: 0,
      totalRequiredCount: 0,
      availableComponents: [],
      missingComponents: [],
      estimatedWasteDivertedGrams: 0,
      whyThisProject: "No specific components required.",
      calculationDetail: "0/0 required components."
    };
  }

  let matchedTypesCount = 0;
  let estimatedWasteGrams = 0;
  const availableComponents = [];
  const missingComponents = [];

  for (const req of required) {
    // Find matching item in user inventory
    const matchedItem = userInventory.find(item => 
      isComponentMatch(req.name, item.name || item.componentName)
    );

    const unitWeight = req.weight || getComponentWeight(req.name);

    if (matchedItem && (matchedItem.quantity || 1) > 0) {
      const userQty = matchedItem.quantity || 1;
      const isFullQuantity = userQty >= req.quantity;

      // Type is available
      matchedTypesCount++;

      // Reusable weight for this component (up to required quantity)
      const usedQty = Math.min(userQty, req.quantity);
      estimatedWasteGrams += unitWeight * usedQty;

      availableComponents.push({
        name: req.name,
        category: req.category,
        requiredQty: req.quantity,
        availableQty: userQty,
        unitWeight,
        totalReusedWeight: unitWeight * usedQty,
        condition: matchedItem.condition || "Working",
        isFullQuantity
      });

      if (!isFullQuantity) {
        // Partial quantity shortfall
        missingComponents.push({
          name: req.name,
          category: req.category,
          requiredQty: req.quantity,
          availableQty: userQty,
          missingQty: req.quantity - userQty,
          unitWeight,
          isPartialShortage: true
        });
      }
    } else {
      // Entirely missing
      missingComponents.push({
        name: req.name,
        category: req.category,
        requiredQty: req.quantity,
        availableQty: 0,
        missingQty: req.quantity,
        unitWeight,
        isPartialShortage: false
      });
    }
  }

  // Exact formula specified in Problem Statement:
  // availability percentage = (number of required component types available / total required component types) * 100
  const rawScore = (matchedTypesCount / totalRequiredTypes) * 100;
  const feasibilityScore = Math.round(rawScore);

  // Match grade classification:
  // 90–100% = Excellent match
  // 75–89% = Strong match
  // 50–74% = Partial match
  // Below 50% = Low match
  let matchGrade = "Low match";
  let gradeColor = "gray";

  if (feasibilityScore >= 90) {
    matchGrade = "Excellent match";
    gradeColor = "emerald";
  } else if (feasibilityScore >= 75) {
    matchGrade = "Strong match";
    gradeColor = "teal";
  } else if (feasibilityScore >= 50) {
    matchGrade = "Partial match";
    gradeColor = "amber";
  } else {
    matchGrade = "Low match";
    gradeColor = "slate";
  }

  // Transparent calculation breakdown string for user visibility
  const calculationDetail = `(${matchedTypesCount} available / ${totalRequiredTypes} required types) × 100 = ${feasibilityScore}%`;

  // Deterministic reason
  let whyThisProject = "";
  if (matchedTypesCount === totalRequiredTypes) {
    whyThisProject = `All ${totalRequiredTypes} required components are available in your inventory. You have everything to build this immediately!`;
  } else if (matchedTypesCount > 0) {
    const missingNames = missingComponents.map(m => m.name).join(", ");
    whyThisProject = `${matchedTypesCount} of ${totalRequiredTypes} required components are available. You only need: ${missingNames}.`;
  } else {
    whyThisProject = `None of the required components are currently in your active inventory. Check Available Components to source them.`;
  }

  return {
    project,
    feasibilityScore,
    matchGrade,
    gradeColor,
    matchedCount: matchedTypesCount,
    totalRequiredCount: totalRequiredTypes,
    availableComponents,
    missingComponents,
    estimatedWasteDivertedGrams: estimatedWasteGrams,
    calculationDetail,
    whyThisProject
  };
}

/**
 * Matches user's inventory against all projects, ranks them by feasibility score
 */
export function matchAllProjects(userInventory = [], customProjects = null) {
  const projects = customProjects || PREDEFINED_PROJECTS;
  
  const results = projects.map(proj => evaluateProjectMatch(proj, userInventory));

  // Rank descending by feasibility score, then by waste diverted
  results.sort((a, b) => {
    if (b.feasibilityScore !== a.feasibilityScore) {
      return b.feasibilityScore - a.feasibilityScore;
    }
    return b.estimatedWasteDivertedGrams - a.estimatedWasteDivertedGrams;
  });

  return results;
}
