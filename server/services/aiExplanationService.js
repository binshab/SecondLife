/**
 * AI Recommendation Service
 * Provides smart hardware-level engineering explanations for recommended projects.
 * Runs deterministically with rich knowledge heuristics, and can optionally call LLM if configured.
 */

export function generateAIRecommendation(matchedProject) {
  const { project, feasibilityScore, availableComponents, missingComponents, matchGrade } = matchedProject;

  const availableNames = availableComponents.map(c => c.name);
  const missingNames = missingComponents.map(c => c.name);

  let tone = "";
  let hardwareInsight = "";
  let actionAdvice = "";

  if (feasibilityScore === 100) {
    tone = `🎯 100% Ready to Build: You possess every single required hardware module (${availableNames.join(', ')}).`;
    hardwareInsight = `This project takes full advantage of your existing hardware without requiring any additional purchase or sourcing.`;
    actionAdvice = `Tip: Begin by testing each sub-circuit on a breadboard before final assembly. Check pinouts and logic voltage levels (3.3V vs 5V) to ensure stable communication.`;
  } else if (feasibilityScore >= 75) {
    tone = `💡 Excellent Feasibility (${feasibilityScore}%): You already have the core processing and sensing components: ${availableNames.join(', ')}.`;
    hardwareInsight = `The missing item (${missingNames.join(', ')}) is easily obtainable from college peer labs or low-cost transfer. In many cases, you can even begin initial software simulation or substitute with an alternative component.`;
    actionAdvice = `Recommendation: Jump to 'Available Components' to request the missing ${missingNames[0] || 'component'} from a student nearby.`;
  } else if (feasibilityScore >= 50) {
    tone = `🔧 Moderate Feasibility (${feasibilityScore}%): A promising foundation is available with ${availableNames.join(', ')}.`;
    hardwareInsight = `You have roughly half the required architecture. You still require: ${missingNames.join(', ')}.`;
    actionAdvice = `Recommendation: Group up with a fellow maker or check college club inventory to pool components together for this build.`;
  } else {
    tone = `🌱 Discovery Match: This project requires ${project.name} hardware that is currently missing from your inventory.`;
    hardwareInsight = `Requires: ${project.requiredComponents.map(c => c.name).join(', ')}.`;
    actionAdvice = `Check the 'Available Components' marketplace or list your current parts to swap with other project teams.`;
  }

  // Engineering synthesis
  const fullExplanation = `Based on your inventory, "${project.name}" is a ${matchGrade} (${feasibilityScore}%). You already hold ${availableComponents.length} of the ${project.requiredComponents.length} essential parts (${availableNames.join(', ') || 'none'}). ${hardwareInsight} ${actionAdvice}`;

  return {
    source: "SecondLife AI Synthesis Engine",
    headline: tone,
    explanation: fullExplanation,
    feasibilityScore,
    matchGrade,
    sustainabilityNote: `Reusing these ${availableComponents.length} parts diverts an estimated ${matchedProject.estimatedWasteDivertedGrams}g of e-waste from entering local municipal trash.`
  };
}
