# SECOND LIFE ♻️
> *"Give unused electronics a second life."*

A sustainable hardware reuse web application connecting available electronic components with suitable reuse projects and encouraging circular resource utilization. Built for hackathon presentations, academic project teams, college labs, and makers.

---

## 🌟 Core Problem Solved
Discarded electronic components and unused devices are often treated as e-waste despite their high reuse potential in educational and IoT builds. **SecondLife** addresses two core user questions:
1. **"What can I build with what I already have?"** — Compares the user's physical components against predefined projects, calculates a deterministic feasibility score, shows available vs. missing parts, and estimates e-waste diverted.
2. **"Share my unused components"** — Allows students and labs to list idle modules for Free Donation or Low-Cost Transfer with a clean request/handover flow.

---

## 🚀 Live Demo Quickstart

The application is already running locally:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

To start manually at any time:
```powershell
# 1. Start Backend Server (Port 5000)
cd server
node server.js

# 2. In another terminal, start Frontend (Port 3000)
cd client
npm run dev
```

---

## 🧭 Step-by-Step Hackathon Demo Flow (for Judges)

| Step | Action | What Judges See |
|:---:|:---|:---|
| **1** | Open [http://localhost:3000](http://localhost:3000) | Clean, modern landing dashboard with tagline *"Give unused electronics a second life"*, two primary action cards, and real-time sustainability stats. |
| **2** | Check User Inventory | Default inventory pre-loaded with **ESP32, Ultrasonic Sensor, LED, Buzzer**. *(Can also click "Demo Reset" in the top bar anytime to reload this exact preset)*. |
| **3** | Click **"What Can I Build?"** | Interactive component sandbox showing selected components. Click **"Find What I Can Build"**. |
| **4** | Deterministic Match Result | **Smart Parking Assistant** ranks #1 with **80% Compatibility** (4 of 5 components available: ESP32, Ultrasonic Sensor, LED, Buzzer; 1 Missing: Servo Motor). |
| **5** | Open **"View Details"** | Transparent formula breakdown `(4/5) * 100 = 80%`, **~42g Estimated E-waste Diverted**, AI engineering insight, and step-by-step wiring instructions. |
| **6** | Click **"Find Missing in Marketplace"** | Seamlessly navigates to the marketplace pre-filtered for Servo Motor. |
| **7** | Go to **"Share Components"** | Click the **"Quick-Fill Demo"** button to auto-populate an **Arduino UNO** (Condition: Working, Mode: Free Donation, Location: KCG College area, Chennai). Click **"List Component for Reuse"**. |
| **8** | Open **"Available Components"** | See the new listing in the community feed. Click **"Request Component"** on an item, enter reason *"Reusing for college IoT mini-project"*, and submit request. |
| **9** | Open **"Requests"** & **"Impact"** | View outgoing request status. Toggle to incoming requests. Open Impact Dashboard to see **Components Reused, Projects Enabled, 1.8+ kg E-waste Diverted**, visual monthly timeline chart, and personal contribution card. |

---

## 📐 Architecture & Key Features

### 1. Deterministic Matching Engine (`server/services/matchingService.js`)
- Does **not** rely on brittle external APIs for basic matching.
- Evaluates:
  $$\text{Feasibility Score} = \left(\frac{\text{Required Component Types Available}}{\text{Total Required Component Types}}\right) \times 100$$
- Rank classifications:
  - **90–100%**: Excellent match
  - **75–89%**: Strong match
  - **50–74%**: Partial match
  - **Below 50%**: Low match

### 2. Waste Reduction Calculator (`server/services/wasteService.js`)
- Predefined approximate laboratory weights:
  - ESP32 / Arduino UNO: **~25g**
  - Ultrasonic / Gas Sensors: **~10g**
  - OLED Display: **~15g**
  - Servo Motor: **~9g**
  - Buzzer: **~5g**
  - LED: **~1g**
- Calculates estimated total weight diverted from landfill disposal and clearly marks it as an **ESTIMATE**.

### 3. AI Recommendation & Engineering Insight (`server/services/aiExplanationService.js`)
- Synthesizes hardware architecture rationale (how the microcontroller, sensors, and actuators interface).
- Provides actionable substitution advice and peer-sourcing tips.

### 4. Community Marketplace & Request Coordination
- Supports **Free Donation** and **Low-Cost Transfer** (with fair price).
- Peer request flow: `List` → `Discover` → `Request` → `Accept` → `Connect / Handover`.
- Includes realistic Chennai college locations (*KCG College area, Tambaram, Avadi, Ambattur, Guindy, Velachery*).

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, Vanilla CSS Design System, Lucide React Icons, Canvas Confetti.
- **Backend:** Node.js, Express, REST APIs, JSON/In-Memory Seed Store with full CRUD persistence.
- **Zero-Failure Fallback:** Resilient client-side offline storage sync ensures the demo will never fail even if network connectivity drops.
