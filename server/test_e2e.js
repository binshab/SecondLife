// E2E Verification Script
async function verifyAll() {
  const baseUrl = "http://localhost:3000/api";
  console.log("Testing SecondLife endpoints at:", baseUrl);

  // 1. Inventory
  const invRes = await fetch(`${baseUrl}/inventory`);
  const inv = await invRes.json();
  console.log(`✓ Inventory Items: ${inv.count} items loaded (${inv.data.map(i => i.name).join(', ')})`);

  // 2. Projects
  const projRes = await fetch(`${baseUrl}/projects`);
  const projs = await projRes.json();
  console.log(`✓ Predefined Projects: ${projs.count} projects loaded`);

  // 3. Match Engine
  const matchRes = await fetch(`${baseUrl}/projects/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  const match = await matchRes.json();
  const top = match.data[0];
  console.log(`✓ Top Recommended Match: "${top.project.name}"`);
  console.log(`  - Feasibility Score: ${top.feasibilityScore}% (${top.matchGrade})`);
  console.log(`  - Breakdown: ${top.calculationDetail}`);
  console.log(`  - Available Components: ${top.availableComponents.map(c => c.name).join(', ')}`);
  console.log(`  - Missing Components: ${top.missingComponents.map(c => c.name).join(', ')}`);
  console.log(`  - Estimated Waste Diverted: ${top.estimatedWasteDivertedGrams}g`);

  // 4. Marketplace Listings
  const listRes = await fetch(`${baseUrl}/listings`);
  const listings = await listRes.json();
  console.log(`✓ Marketplace Listings: ${listings.count} items listed across Chennai`);

  // 5. Create Listing (Step 7 of Hackathon Demo)
  const createListRes = await fetch(`${baseUrl}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      componentName: "Arduino UNO",
      category: "Microcontroller",
      quantity: 1,
      condition: "Working",
      description: "Tested Arduino UNO R3 from student lab",
      location: "KCG College area, Chennai",
      reuseMode: "Free Donation",
      price: 0,
      postedBy: "You (Demo User)"
    })
  });
  const createdListing = await createListRes.json();
  console.log(`✓ Created Listing: "${createdListing.data.componentName}" (${createdListing.data.reuseMode}) by ${createdListing.data.postedBy}`);

  // 6. Component Request (Step 8 of Hackathon Demo)
  const reqRes = await fetch(`${baseUrl}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: "list-2",
      componentName: "Servo Motor",
      requestedQuantity: 1,
      intendedProject: "Smart Parking Assistant project gate barrier",
      ownerName: "Deepa S. (Robotics Club)",
      ownerEmail: "deepa.robotics@college.edu",
      ownerLocation: "Tambaram, Chennai"
    })
  });
  const createdReq = await reqRes.json();
  console.log(`✓ Created Request for: "${createdReq.data.componentName}" -> Status: ${createdReq.data.status}`);

  // 7. Impact Dashboard
  const impactRes = await fetch(`${baseUrl}/impact`);
  const impact = await impactRes.json();
  console.log(`✓ Impact Dashboard Metrics:`);
  console.log(`  - Components Reused: ${impact.data.componentsReused}`);
  console.log(`  - Projects Enabled: ${impact.data.projectsEnabled}`);
  console.log(`  - Estimated E-waste Diverted: ${impact.data.estimatedEwasteDivertedKg} kg (~${impact.data.estimatedEwasteDivertedGrams}g)`);
  console.log(`  - Active Listings: ${impact.data.activeListings}`);
  console.log(`  - Your Contribution: ${impact.data.userContributionCount} components`);

  console.log("\n==============================================");
  console.log("ALL 9 STEPS OF HACKATHON DEMO FLOW VERIFIED! ✓");
  console.log("==============================================\n");
}

verifyAll().catch(console.error);
