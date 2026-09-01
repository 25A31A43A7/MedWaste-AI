// Comprehensive Mock Data for MedWaste AI (SIH26115)

export const SUMMARY_STATS = {
  totalWasteKg: 4850,
  collectedWasteKg: 4120,
  pendingCollectionKg: 730,
  segregationAccuracy: "98.4%",
  criticalAlertsCount: 3,
};

export const WASTE_CATEGORIES_DATA = [
  { name: "Yellow (Infectious)", value: 2150, color: "#eab308", code: "CAT-Y" },
  { name: "Red (Contaminated Plastics)", value: 1420, color: "#ef4444", code: "CAT-R" },
  { name: "Blue (Glassware & Metal)", value: 780, color: "#3b82f6", code: "CAT-B" },
  { name: "White (Sharps & Blades)", value: 500, color: "#64748b", code: "CAT-W" },
];

export const MONTHLY_TREND_DATA = [
  { month: "Jan", yellow: 1800, red: 1200, blue: 600, white: 400 },
  { month: "Feb", yellow: 1950, red: 1300, blue: 650, white: 450 },
  { month: "Mar", yellow: 2100, red: 1400, blue: 720, white: 480 },
  { month: "Apr", yellow: 2050, red: 1380, blue: 700, white: 460 },
  { month: "May", yellow: 2200, red: 1450, blue: 800, white: 510 },
  { month: "Jun", yellow: 2150, red: 1420, blue: 780, white: 500 },
];

export const RECENT_COLLECTIONS = [
  { id: "COL-9081", ward: "ICU - Ward 4A", category: "Yellow (Infectious)", weightKg: 45.2, time: "10 mins ago", status: "Collected", unit: "Mobile Unit 1 (EV)" },
  { id: "COL-9082", ward: "Surgical OT 2", category: "White (Sharps)", weightKg: 12.8, time: "25 mins ago", status: "Collected", unit: "Mobile Unit 3" },
  { id: "COL-9083", ward: "Emergency ER", category: "Red (Plastics)", weightKg: 88.0, time: "40 mins ago", status: "In Transit", unit: "Mobile Unit 2 (EV)" },
  { id: "COL-9084", ward: "Radiology Lab", category: "Blue (Glassware)", weightKg: 24.5, time: "1 hour ago", status: "Pending", unit: "Unassigned" },
  { id: "COL-9085", ward: "Pediatrics Ward B", category: "Yellow (Infectious)", weightKg: 31.0, time: "2 hours ago", status: "Collected", unit: "Mobile Unit 1 (EV)" },
];

export const RECENT_ACTIVITIES = [
  { id: 1, text: "AI Scanner detected high infectious waste ratio in Ward 4A", time: "12:45 PM", type: "warning" },
  { id: 2, text: "Mobile EV Unit 01 completed route 'North Block Loop'", time: "12:30 PM", type: "success" },
  { id: 3, text: "New collection dispatch generated for Emergency ER", time: "12:15 PM", type: "info" },
  { id: 4, text: "Biohazard container overflow warning triggered at OT 3", time: "11:50 AM", type: "danger" },
];

export const MOBILE_UNITS = [
  { id: "EV-UNIT-01", driver: "Rajesh Kumar", status: "On Route", battery: 88, capacityPercent: 65, activeRoute: "Main Hospital North Wing", totalBinsPicked: 14 },
  { id: "EV-UNIT-02", driver: "Sunil Verma", status: "Collecting", battery: 72, capacityPercent: 82, activeRoute: "Emergency & OT Block", totalBinsPicked: 19 },
  { id: "EV-UNIT-03", driver: "Amit Singh", status: "Standby", battery: 100, capacityPercent: 0, activeRoute: "Charging Dock A", totalBinsPicked: 0 },
  { id: "EV-UNIT-04", driver: "Priya Sharma", status: "On Route", battery: 45, capacityPercent: 90, activeRoute: "Outpatient Clinic Circuit", totalBinsPicked: 22 },
];

export const CRITICAL_ALERTS = [
  { id: "ALT-101", title: "Mis-segregation Detected", location: "Surgical OT - Bin 03", severity: "High", desc: "Non-biodegradable plastic item detected in Yellow Infectious bin via AI Vision.", time: "15 mins ago" },
  { id: "ALT-102", title: "Bin Overflow Warning", location: "Emergency Ward B", severity: "Critical", desc: "Ultrasonic sensor reading 94% bin capacity. Immediate pickup required.", time: "30 mins ago" },
  { id: "ALT-103", title: "Pickup Delay Alert", location: "Diagnostic Radiology", severity: "Medium", desc: "Collection delayed past 48 hour maximum statutory requirement window.", time: "1 hour ago" },
];

export const WASTE_TRACKING_LOGS = [
  { batchId: "MW-2026-8801", category: "Yellow (Infectious)", weight: "45.2 kg", hospital: "AIIMS New Delhi", timestamp: "01 Sep 2026 11:30 AM", status: "In Treatment Facility", qrCode: "QR-8801-Y" },
  { batchId: "MW-2026-8802", category: "Red (Plastics)", weight: "88.0 kg", hospital: "AIIMS New Delhi", timestamp: "01 Sep 2026 12:00 PM", status: "In Transit (EV Van 2)", qrCode: "QR-8802-R" },
  { batchId: "MW-2026-8803", category: "White (Sharps)", weight: "12.8 kg", hospital: "Max Healthcare", timestamp: "01 Sep 2026 10:15 AM", status: "Autoclaved & Shredded", qrCode: "QR-8803-W" },
  { batchId: "MW-2026-8804", category: "Blue (Glass)", weight: "24.5 kg", hospital: "Apollo Hospital", timestamp: "01 Sep 2026 09:40 AM", status: "Disinfected & Recycled", qrCode: "QR-8804-B" },
];
