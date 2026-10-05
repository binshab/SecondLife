export const COMPONENT_WEIGHTS = {
  "ESP32": 25,
  "Arduino UNO": 25,
  "Arduino Nano": 7,
  "Raspberry Pi Pico": 5,
  "Ultrasonic Sensor": 10,
  "DHT11 Temperature & Humidity Sensor": 3,
  "DHT11": 3,
  "DHT22": 5,
  "Soil Moisture Sensor": 8,
  "PIR Motion Sensor": 12,
  "PIR Sensor": 12,
  "LDR Sensor": 2,
  "LDR Light Sensor": 2,
  "MQ-2 Gas Sensor": 10,
  "RFID RC522": 12,
  "OLED Display": 15,
  "LCD 16x2 Display": 35,
  "Servo Motor": 9,
  "DC Water Pump": 50,
  "Relay Module": 10,
  "LED": 1,
  "Buzzer": 5,
  "Breadboard": 40,
  "Jumper Wires": 15,
  "Potentiometer": 5,
  "Default": 10
};

export const COMPONENT_CATEGORIES = [
  "Microcontroller",
  "Sensor",
  "Display",
  "Motor",
  "Communication",
  "Power",
  "Basic Electronics",
  "Other"
];

export const PREDEFINED_PROJECTS = [
  {
    id: "proj-1",
    name: "Smart Parking Assistant",
    tagline: "Proximity-guided visual and acoustic collision warning aid",
    description: "Detects reversing vehicle proximity using ultrasonic sound waves and triggers escalating visual LED cues and auditory buzzer beeps to prevent bumper collisions during garage or bay parking.",
    category: "IoT & Automation",
    difficulty: "Beginner",
    estimatedTime: "45 mins",
    imageIcon: "Car",
    requiredComponents: [
      { name: "ESP32", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Ultrasonic Sensor", quantity: 1, category: "Sensor", weight: 10 },
      { name: "LED", quantity: 2, category: "Basic Electronics", weight: 2 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "Servo Motor", quantity: 1, category: "Motor", weight: 9 }
    ],
    totalWeight: 51,
    workflow: [
      "Mount the HC-SR04 Ultrasonic sensor facing outward at bumper level.",
      "Wire Trigger and Echo pins to ESP32 GPIOs 5 and 18 with 5V VCC and GND.",
      "Connect Green LED for safe distance (>30cm) and Red LED with Buzzer for danger zone (<10cm).",
      "Attach micro-servo motor to swing a mini parking barrier or warning flag when safe.",
      "Upload ESP32 code to continuously ping distances and pulse buzzer frequencies."
    ]
  },
  {
    id: "proj-2",
    name: "Smart Plant Monitoring System",
    tagline: "Soil hydration sensing with real-time OLED statistics",
    description: "Monitors potting soil dielectric moisture levels and ambient conditions. Alerting botanists and students via OLED and audio beeps before root starvation occurs.",
    category: "Agriculture & Green Tech",
    difficulty: "Intermediate",
    estimatedTime: "1 hour",
    imageIcon: "Sprout",
    requiredComponents: [
      { name: "ESP32", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Soil Moisture Sensor", quantity: 1, category: "Sensor", weight: 8 },
      { name: "OLED Display", quantity: 1, category: "Display", weight: 15 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "Relay Module", quantity: 1, category: "Basic Electronics", weight: 10 }
    ],
    totalWeight: 63,
    workflow: [
      "Calibrate the soil moisture sensor in air (0%) and in a glass of water (100%).",
      "Connect I2C OLED display lines (SDA, SCL) to ESP32 pins 21 and 22.",
      "Hook moisture analog output to ESP32 ADC pin 34.",
      "Wire 5V relay module signal pin to ESP32 GPIO 4 to automate valve control.",
      "Run loop to refresh moisture percentage graphics and trigger alarm if dry."
    ]
  },
  {
    id: "proj-3",
    name: "Weather Monitoring Station",
    tagline: "Microclimate tracking with temperature, humidity and breadboard wiring",
    description: "Captures real-time local temperature and humidity data to forecast indoor air comfort and display microclimate metrics on a crisp I2C display.",
    category: "Environment & Climate",
    difficulty: "Intermediate",
    estimatedTime: "1.5 hours",
    imageIcon: "CloudRain",
    requiredComponents: [
      { name: "ESP32", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "DHT11", quantity: 1, category: "Sensor", weight: 3 },
      { name: "OLED Display", quantity: 1, category: "Display", weight: 15 },
      { name: "LED", quantity: 1, category: "Basic Electronics", weight: 1 },
      { name: "Breadboard", quantity: 1, category: "Basic Electronics", weight: 40 }
    ],
    totalWeight: 84,
    workflow: [
      "Seat the ESP32 across the center divider of the breadboard.",
      "Place DHT11 temperature/humidity sensor and add a 10k pull-up resistor on the data line.",
      "Wire the I2C OLED screen to display live Celsius and relative humidity %.",
      "Flash ESP32 with DHT and Adafruit SSD1306 libraries.",
      "Program heartbeat blinking LED to indicate active wireless telemetry."
    ]
  },
  {
    id: "proj-4",
    name: "Automatic Plant Watering System",
    tagline: "Closed-loop irrigation controller with submersible pump",
    description: "Automates garden watering by sensing dry soil and switching a low-voltage submersible pump via relay module, preserving water while saving plants.",
    category: "Agriculture & Green Tech",
    difficulty: "Intermediate",
    estimatedTime: "1.5 hours",
    imageIcon: "Droplets",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Soil Moisture Sensor", quantity: 1, category: "Sensor", weight: 8 },
      { name: "Relay Module", quantity: 1, category: "Basic Electronics", weight: 10 },
      { name: "DC Water Pump", quantity: 1, category: "Motor", weight: 50 },
      { name: "LED", quantity: 1, category: "Basic Electronics", weight: 1 }
    ],
    totalWeight: 94,
    workflow: [
      "Insert soil probes into potted plant root system.",
      "Connect sensor VCC/GND and connect analog pin to Arduino A0.",
      "Wire 5V optocoupled relay between 12V DC power jack and water pump.",
      "Add indicator LED on Arduino pin 13 to signal pump activation.",
      "Write hysteresis loop: trigger pump when moisture drops below 25%."
    ]
  },
  {
    id: "proj-5",
    name: "Smart Dustbin",
    tagline: "Touchless sanitary lid activator using ultrasonic rangefinding",
    description: "A hygienic touch-free waste bin that automatically flips open its lid upon detecting approaching hands or trash items, preventing pathogen transmission.",
    category: "Smart Campus & Hygiene",
    difficulty: "Beginner",
    estimatedTime: "40 mins",
    imageIcon: "Trash2",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Ultrasonic Sensor", quantity: 1, category: "Sensor", weight: 10 },
      { name: "Servo Motor", quantity: 1, category: "Motor", weight: 9 },
      { name: "LED", quantity: 1, category: "Basic Electronics", weight: 1 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 }
    ],
    totalWeight: 50,
    workflow: [
      "Affix HC-SR04 sensor to the front bin bezel facing upwards/forwards.",
      "Mount SG90 mini servo arm onto the hinged bin lid.",
      "Connect servo signal wire to PWM pin 9 on Arduino UNO.",
      "Program Arduino to rotate servo to 90° whenever hand distance < 20cm.",
      "Keep lid open for 4 seconds then smoothly return servo to 0° with polite beep."
    ]
  },
  {
    id: "proj-6",
    name: "Obstacle Detection System",
    tagline: "Assistive navigation aid for robotics and mobility canes",
    description: "Wearable or rover-mounted collision warning aid providing immediate acoustic and optical alerts as obstacles come within proximity.",
    category: "Robotics & Assistive Tech",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    imageIcon: "Radar",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Ultrasonic Sensor", quantity: 1, category: "Sensor", weight: 10 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "LED", quantity: 2, category: "Basic Electronics", weight: 2 }
    ],
    totalWeight: 42,
    workflow: [
      "Connect Ultrasonic Sensor VCC to 5V, GND to GND, Echo to 12, Trig to 11.",
      "Wire dual warning LEDs and piezo buzzer with current limiting resistors.",
      "Calculate clearance distance in centimeters based on sound wave flight time.",
      "Modulate beep tone rate inversely proportional to obstacle distance."
    ]
  },
  {
    id: "proj-7",
    name: "Home Security Alarm",
    tagline: "Infrared intrusion beacon with loud deterrent siren",
    description: "Motion-activated perimeter security monitor that trips a pulsing alarm buzzer and visual beacon whenever unauthorized presence is detected.",
    category: "Security & Safety",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    imageIcon: "ShieldAlert",
    requiredComponents: [
      { name: "ESP32", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "PIR Sensor", quantity: 1, category: "Sensor", weight: 12 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "LED", quantity: 2, category: "Basic Electronics", weight: 2 }
    ],
    totalWeight: 44,
    workflow: [
      "Adjust PIR motion sensor sensitivity and re-trigger delay potentiometers.",
      "Interface PIR signal output to ESP32 interrupt-capable pin GPIO 13.",
      "Wire high-decibel piezo buzzer and flashing red warning LEDs.",
      "Program alarm latch state with 15-second siren upon motion detection."
    ]
  },
  {
    id: "proj-8",
    name: "Temperature & Humidity Monitor",
    tagline: "Desktop ambient hygrometer with 16x2 alphanumeric display",
    description: "Compact desktop hygrometer station alerting users whenever classroom or dorm room ambient temperature crosses comfortable study thresholds.",
    category: "Health & Environment",
    difficulty: "Beginner",
    estimatedTime: "1 hour",
    imageIcon: "Thermometer",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "DHT11", quantity: 1, category: "Sensor", weight: 3 },
      { name: "LCD 16x2 Display", quantity: 1, category: "Display", weight: 35 },
      { name: "Potentiometer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "Breadboard", quantity: 1, category: "Basic Electronics", weight: 40 }
    ],
    totalWeight: 108,
    workflow: [
      "Wire the 16x2 parallel LCD to Arduino digital pins 2 through 7.",
      "Connect 10k potentiometer to pin Vo to calibrate LCD contrast.",
      "Connect DHT11 sensor data pin to digital pin 8.",
      "Use LiquidCrystal library to print Temp (°C) and Humidity (%) on two lines."
    ]
  },
  {
    id: "proj-9",
    name: "Smart Distance Monitor",
    tagline: "Handheld ultrasound digital measuring tape",
    description: "A compact electronic ruler using ultrasound bounce timing to measure room dimensions and furniture clearances directly on a crisp OLED screen.",
    category: "Education & Tools",
    difficulty: "Beginner",
    estimatedTime: "45 mins",
    imageIcon: "Ruler",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "Ultrasonic Sensor", quantity: 1, category: "Sensor", weight: 10 },
      { name: "OLED Display", quantity: 1, category: "Display", weight: 15 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 }
    ],
    totalWeight: 55,
    workflow: [
      "Hook up ultrasonic sensor to Arduino UNO pins 9 and 10.",
      "Wire I2C OLED display to pins A4 (SDA) and A5 (SCL).",
      "Display real-time distance in both centimeters and inches.",
      "Provide an acoustic feedback click when a steady measurement is locked in."
    ]
  },
  {
    id: "proj-10",
    name: "Automatic Night Light",
    tagline: "Energy-saving dawn-to-dusk photo-sensing lamp switch",
    description: "Sustainable smart lighting module that conserves power by keeping lamps switched off during daylight and automatically energizing LEDs upon dusk.",
    category: "Home & Energy Saving",
    difficulty: "Beginner",
    estimatedTime: "30 mins",
    imageIcon: "Moon",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "LDR Sensor", quantity: 1, category: "Sensor", weight: 2 },
      { name: "LED", quantity: 3, category: "Basic Electronics", weight: 3 },
      { name: "Relay Module", quantity: 1, category: "Basic Electronics", weight: 10 }
    ],
    totalWeight: 40,
    workflow: [
      "Create voltage divider with LDR photoresistor and 10k resistor into analog pin A0.",
      "Hook output LED cluster to digital pin 6 with PWM soft dimming.",
      "Wire relay module to switch high-power 12V night lamps if needed.",
      "Apply hysteresis in code to prevent flickering during twilight transitions."
    ]
  },
  {
    id: "proj-11",
    name: "RFID Smart Attendance & Access Guard",
    tagline: "NFC student card reader with servo-activated latch",
    description: "Contactless access control scanner reading MIFARE 13.56MHz cards, unlocking a servo deadbolt and beeping upon student authorization.",
    category: "Security & Smart Campus",
    difficulty: "Intermediate",
    estimatedTime: "1.5 hours",
    imageIcon: "IdCard",
    requiredComponents: [
      { name: "ESP32", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "RFID RC522", quantity: 1, category: "Communication", weight: 12 },
      { name: "Servo Motor", quantity: 1, category: "Motor", weight: 9 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "LED", quantity: 2, category: "Basic Electronics", weight: 2 }
    ],
    totalWeight: 53,
    workflow: [
      "Wire RC522 SPI interface (MOSI, MISO, SCK, SS) to ESP32 standard SPI pins.",
      "Connect SG90 servo motor to 5V rail and GPIO 14.",
      "Store authorized student UID tags in ESP32 flash memory.",
      "Grant entry by swinging servo 90 degrees with green LED confirmation beep."
    ]
  },
  {
    id: "proj-12",
    name: "LPG Gas Leakage & Fire Alert",
    tagline: "Hazardous methane detection with emergency relay vent switch",
    description: "Detects explosive cooking gas or combustible smoke leaks, triggering an audible siren and tripping an exhaust relay to vent hazardous vapors.",
    category: "Safety & Hazard Prevention",
    difficulty: "Intermediate",
    estimatedTime: "1 hour",
    imageIcon: "Flame",
    requiredComponents: [
      { name: "Arduino UNO", quantity: 1, category: "Microcontroller", weight: 25 },
      { name: "MQ-2 Gas Sensor", quantity: 1, category: "Sensor", weight: 10 },
      { name: "Buzzer", quantity: 1, category: "Basic Electronics", weight: 5 },
      { name: "Relay Module", quantity: 1, category: "Basic Electronics", weight: 10 },
      { name: "LED", quantity: 2, category: "Basic Electronics", weight: 2 }
    ],
    totalWeight: 52,
    workflow: [
      "Warm up MQ-2 sensor heater coil for 2 minutes for baseline calibration.",
      "Connect analog pin to Arduino A1 to monitor gas PPM concentrations.",
      "Trigger continuous alarm tone and red LED strobe when PPM exceeds 400.",
      "Activate relay module to power up an emergency extraction fan."
    ]
  }
];

export const INITIAL_USER_INVENTORY = [
  {
    id: "inv-1",
    name: "ESP32",
    category: "Microcontroller",
    quantity: 1,
    condition: "Working",
    description: "Dual-core ESP32 DevKit V1 with built-in Wi-Fi & Bluetooth, 30 pins.",
    weightPerUnit: 25,
    addedAt: "2026-09-28T10:00:00.000Z"
  },
  {
    id: "inv-2",
    name: "Ultrasonic Sensor",
    category: "Sensor",
    quantity: 1,
    condition: "Working",
    description: "HC-SR04 ultrasonic distance sensor with 4 pins (VCC, Trig, Echo, GND).",
    weightPerUnit: 10,
    addedAt: "2026-09-28T10:05:00.000Z"
  },
  {
    id: "inv-3",
    name: "LED",
    category: "Basic Electronics",
    quantity: 3,
    condition: "Working",
    description: "5mm bright LEDs (2 red, 1 green) with 220-ohm resistors.",
    weightPerUnit: 1,
    addedAt: "2026-09-28T10:10:00.000Z"
  },
  {
    id: "inv-4",
    name: "Buzzer",
    category: "Basic Electronics",
    quantity: 1,
    condition: "Working",
    description: "5V active piezo buzzer module.",
    weightPerUnit: 5,
    addedAt: "2026-09-28T10:15:00.000Z"
  }
];

export const INITIAL_LISTINGS = [
  {
    id: "list-1",
    componentName: "Arduino UNO",
    category: "Microcontroller",
    quantity: 2,
    condition: "Working",
    description: "Original Arduino UNO R3 boards from college robotics workshop. Fully tested.",
    location: "KCG College area, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Karthik R. (3rd Yr ECE)",
    postedAt: "2026-10-01T09:30:00.000Z",
    status: "Available"
  },
  {
    id: "list-2",
    componentName: "Servo Motor",
    category: "Motor",
    quantity: 2,
    condition: "Working",
    description: "SG90 Micro Servo 9g with servo horns and mounting screws.",
    location: "Tambaram, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Deepa S. (Robotics Club)",
    postedAt: "2026-10-02T14:15:00.000Z",
    status: "Available"
  },
  {
    id: "list-3",
    componentName: "OLED Display",
    category: "Display",
    quantity: 1,
    condition: "Working",
    description: "0.96 inch I2C OLED 128x64 display (White/Blue). Working perfectly.",
    location: "Avadi, Chennai",
    reuseMode: "Low-cost Transfer",
    price: 120,
    postedBy: "Praveen Kumar (Makers Lab)",
    postedAt: "2026-10-02T16:00:00.000Z",
    status: "Available"
  },
  {
    id: "list-4",
    componentName: "Soil Moisture Sensor",
    category: "Sensor",
    quantity: 3,
    condition: "Working",
    description: "Capacitive corrosion-resistant soil moisture probes from IoT smart farm project.",
    location: "Ambattur, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Vigneshwaran M.",
    postedAt: "2026-10-03T11:20:00.000Z",
    status: "Available"
  },
  {
    id: "list-5",
    componentName: "Relay Module",
    category: "Basic Electronics",
    quantity: 2,
    condition: "Working",
    description: "5V 1-channel relay module with optocoupler isolation.",
    location: "KCG College area, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Ananya Iyer (Final Yr IoT)",
    postedAt: "2026-10-03T15:45:00.000Z",
    status: "Available"
  },
  {
    id: "list-6",
    componentName: "DHT11",
    category: "Sensor",
    quantity: 2,
    condition: "Working",
    description: "DHT11 temperature & humidity sensors, used once for lab practicals.",
    location: "Guindy, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Sanjay N. (IoT Club)",
    postedAt: "2026-10-04T08:10:00.000Z",
    status: "Available"
  },
  {
    id: "list-7",
    componentName: "Breadboard & Jumper Wires",
    category: "Basic Electronics",
    quantity: 1,
    condition: "Working",
    description: "830-point solderless breadboard + bundle of 40 male-to-male jumper wires.",
    location: "Velachery, Chennai",
    reuseMode: "Low-cost Transfer",
    price: 80,
    postedBy: "Meera Krishnan",
    postedAt: "2026-10-04T11:00:00.000Z",
    status: "Available"
  },
  {
    id: "list-8",
    componentName: "PIR Sensor",
    category: "Sensor",
    quantity: 2,
    condition: "Working",
    description: "HC-SR501 PIR passive motion detector modules with adjustable range.",
    location: "Anna Nagar, Chennai",
    reuseMode: "Free Donation",
    price: 0,
    postedBy: "Harish Balaji",
    postedAt: "2026-10-04T12:30:00.000Z",
    status: "Available"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req-1",
    listingId: "list-2",
    componentName: "Servo Motor",
    requestedQuantity: 1,
    requesterName: "You (Demo User)",
    requesterEmail: "student.maker@college.edu",
    ownerName: "Deepa S. (Robotics Club)",
    ownerEmail: "deepa.robotics@college.edu",
    ownerLocation: "Tambaram, Chennai",
    intendedProject: "Smart Parking Assistant project gate barrier",
    status: "Pending",
    requestedAt: "2026-10-04T14:00:00.000Z",
    type: "outgoing"
  },
  {
    id: "req-2",
    listingId: "list-3",
    componentName: "OLED Display",
    requestedQuantity: 1,
    requesterName: "You (Demo User)",
    requesterEmail: "student.maker@college.edu",
    ownerName: "Praveen Kumar (Makers Lab)",
    ownerEmail: "praveen.makers@college.edu",
    ownerLocation: "Avadi, Chennai",
    intendedProject: "Smart Distance Monitor tool",
    status: "Accepted",
    handoverNotes: "Accepted! Meet me at College Makers Lab Room 204 between 3:00 - 5:00 PM.",
    requestedAt: "2026-10-03T16:20:00.000Z",
    type: "outgoing"
  },
  {
    id: "req-3",
    listingId: "user-list-demo",
    componentName: "ESP32",
    requestedQuantity: 1,
    requesterName: "Rahul Sharma (2nd Yr CSE)",
    requesterEmail: "rahul.sharma@college.edu",
    ownerName: "You (Demo User)",
    ownerEmail: "student.maker@college.edu",
    ownerLocation: "Chennai",
    intendedProject: "Smart Irrigation hackathon prototype",
    status: "Pending",
    requestedAt: "2026-10-04T15:30:00.000Z",
    type: "incoming"
  },
  {
    id: "req-4",
    listingId: "user-list-demo-2",
    componentName: "Ultrasonic Sensor",
    requestedQuantity: 1,
    requesterName: "Swathi P. (Academic Team)",
    requesterEmail: "swathi.team@college.edu",
    ownerName: "You (Demo User)",
    ownerEmail: "student.maker@college.edu",
    ownerLocation: "Chennai",
    intendedProject: "Obstacle Detection Walking Stick for visually challenged",
    status: "Accepted",
    handoverNotes: "Handover arranged at Campus Canteen lounge.",
    requestedAt: "2026-10-02T11:00:00.000Z",
    type: "incoming"
  },
  {
    id: "req-5",
    listingId: "list-6",
    componentName: "DHT11",
    requestedQuantity: 1,
    requesterName: "You (Demo User)",
    requesterEmail: "student.maker@college.edu",
    ownerName: "Sanjay N. (IoT Club)",
    ownerEmail: "sanjay.iot@college.edu",
    ownerLocation: "Guindy, Chennai",
    intendedProject: "Weather Monitoring Station",
    status: "Rejected",
    handoverNotes: "Sorry, already handed over to another team member.",
    requestedAt: "2026-10-01T10:15:00.000Z",
    type: "outgoing"
  }
];

export const INITIAL_IMPACT_HISTORY = [
  { month: "May", componentsReused: 8, wasteDivertedGrams: 320 },
  { month: "Jun", componentsReused: 14, wasteDivertedGrams: 580 },
  { month: "Jul", componentsReused: 22, wasteDivertedGrams: 910 },
  { month: "Aug", componentsReused: 31, wasteDivertedGrams: 1240 },
  { month: "Sep", componentsReused: 38, wasteDivertedGrams: 1590 },
  { month: "Oct (Current)", componentsReused: 42, wasteDivertedGrams: 1810 }
];
