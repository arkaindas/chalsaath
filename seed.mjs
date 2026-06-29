/**
 * ChalSaath — Firebase Seed Script
 * Clears old data then seeds cities, routes and rides.
 *
 * Usage:
 *   node seed.mjs
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// ─── FIREBASE CONFIG ─────────────────────────────────────────────────────────
// Replace with your chalsaath Firebase project credentials
const FIREBASE_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: "chalsaath.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "chalsaath",
  storageBucket: "chalsaath.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.FIREBASE_APP_ID || "YOUR_APP_ID",
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// ─── CITIES ───────────────────────────────────────────────────────────────────
const CITIES = [
  { id: "bankura",  name: "Bankura",  nameHi: "बाँकुड़ा",   state: "West Bengal",    isActive: true, adminUids: [], totalRides: 0 },
  { id: "kolkata",  name: "Kolkata",  nameHi: "कोलकाता",    state: "West Bengal",    isActive: true, adminUids: [], totalRides: 0 },
  { id: "raipur",   name: "Raipur",   nameHi: "रायपुर",     state: "Chhattisgarh",   isActive: true, adminUids: [], totalRides: 0 },
];

// ─── ROUTES ──────────────────────────────────────────────────────────────────
const ROUTES = [
  // ── Bankura city routes ──
  { cityId: "bankura", from: "Indas",      to: "Kolkata",      fromHi: "इंदास",       toHi: "कोलकाता",     distance: "120 km",  estimatedTime: "3 hours",    suggestedFareMin: 250, suggestedFareMax: 400 },
  { cityId: "bankura", from: "Bankura",    to: "Kolkata",      fromHi: "बाँकुड़ा",    toHi: "कोलकाता",     distance: "230 km",  estimatedTime: "5 hours",    suggestedFareMin: 400, suggestedFareMax: 600 },
  { cityId: "bankura", from: "Bishnupur",  to: "Kolkata",      fromHi: "बिष्णुपुर",   toHi: "कोलकाता",     distance: "200 km",  estimatedTime: "4.5 hours",  suggestedFareMin: 350, suggestedFareMax: 550 },
  { cityId: "bankura", from: "Durgapur",   to: "Kolkata",      fromHi: "दुर्गापुर",   toHi: "कोलकाता",     distance: "180 km",  estimatedTime: "3.5 hours",  suggestedFareMin: 300, suggestedFareMax: 500 },
  { cityId: "bankura", from: "Indas",      to: "Bankura",      fromHi: "इंदास",       toHi: "बाँकुड़ा",    distance: "45 km",   estimatedTime: "1.5 hours",  suggestedFareMin: 100, suggestedFareMax: 200 },
  { cityId: "bankura", from: "Bankura",    to: "Durgapur",     fromHi: "बाँकुड़ा",    toHi: "दुर्गापुर",   distance: "80 km",   estimatedTime: "2 hours",    suggestedFareMin: 150, suggestedFareMax: 250 },
  { cityId: "bankura", from: "Indas",      to: "Bishnupur",    fromHi: "इंदास",       toHi: "बिष्णुपुर",   distance: "35 km",   estimatedTime: "1 hour",     suggestedFareMin: 80,  suggestedFareMax: 150 },
  { cityId: "bankura", from: "Bishnupur",  to: "Durgapur",     fromHi: "बिष्णुपुर",   toHi: "दुर्गापुर",   distance: "90 km",   estimatedTime: "2.5 hours",  suggestedFareMin: 150, suggestedFareMax: 280 },
  { cityId: "bankura", from: "Burdwan",    to: "Kolkata",      fromHi: "बर्दवान",      toHi: "कोलकाता",     distance: "100 km",  estimatedTime: "2.5 hours",  suggestedFareMin: 200, suggestedFareMax: 350 },
  { cityId: "bankura", from: "Asansol",    to: "Durgapur",     fromHi: "आसनसोल",      toHi: "दुर्गापुर",   distance: "40 km",   estimatedTime: "1 hour",     suggestedFareMin: 80,  suggestedFareMax: 150 },
  { cityId: "bankura", from: "Kotulpur",   to: "Bankura",      fromHi: "कोतुलपुर",    toHi: "बाँकुड़ा",    distance: "35 km",   estimatedTime: "1 hour",     suggestedFareMin: 80,  suggestedFareMax: 150 },
  // ── Kolkata city routes ──
  { cityId: "kolkata", from: "Kolkata",    to: "Asansol",      fromHi: "कोलकाता",     toHi: "आसनसोल",     distance: "200 km",  estimatedTime: "4 hours",    suggestedFareMin: 350, suggestedFareMax: 550 },
  { cityId: "kolkata", from: "Kolkata",    to: "Durgapur",     fromHi: "कोलकाता",     toHi: "दुर्गापुर",   distance: "180 km",  estimatedTime: "3.5 hours",  suggestedFareMin: 300, suggestedFareMax: 500 },
  { cityId: "kolkata", from: "Kolkata",    to: "Bankura",      fromHi: "कोलकाता",     toHi: "बाँकुड़ा",    distance: "230 km",  estimatedTime: "5 hours",    suggestedFareMin: 400, suggestedFareMax: 600 },
  { cityId: "kolkata", from: "Kolkata",    to: "Arambagh",     fromHi: "कोलकाता",     toHi: "आरामबाग",    distance: "100 km",  estimatedTime: "2.5 hours",  suggestedFareMin: 200, suggestedFareMax: 350 },
  // ── Raipur city routes ──
  { cityId: "raipur",  from: "Raipur",     to: "Bilaspur",     fromHi: "रायपुर",      toHi: "बिलासपुर",   distance: "130 km",  estimatedTime: "2.5 hours",  suggestedFareMin: 200, suggestedFareMax: 350 },
  { cityId: "raipur",  from: "Raipur",     to: "Durg",         fromHi: "रायपुर",      toHi: "दुर्ग",       distance: "30 km",   estimatedTime: "45 mins",    suggestedFareMin: 80,  suggestedFareMax: 150 },
  { cityId: "raipur",  from: "Raipur",     to: "Rajnandgaon",  fromHi: "रायपुर",      toHi: "राजनांदगाँव", distance: "70 km",   estimatedTime: "1.5 hours",  suggestedFareMin: 120, suggestedFareMax: 200 },
  { cityId: "raipur",  from: "Raipur",     to: "Jagdalpur",    fromHi: "रायपुर",      toHi: "जगदलपुर",    distance: "300 km",  estimatedTime: "6 hours",    suggestedFareMin: 500, suggestedFareMax: 800 },
];

// ─── SAMPLE DRIVERS ──────────────────────────────────────────────────────────
const DRIVERS = [
  { uid: "seed_driver_001", name: "Raju Mondal",   phone: "9832100001", whatsapp: "9832100001", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=raju" },
  { uid: "seed_driver_002", name: "Suresh Das",    phone: "9832100002", whatsapp: "9832100002", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=suresh" },
  { uid: "seed_driver_003", name: "Amit Ghosh",    phone: "9832100003", whatsapp: "9832100003", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=amit" },
  { uid: "seed_driver_004", name: "Vikram Singh",  phone: "9832100004", whatsapp: "9832100004", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=vikram" },
  { uid: "seed_driver_005", name: "Prasanta Roy",  phone: "9832100005", whatsapp: "9832100005", photoURL: "https://api.dicebear.com/7.x/thumbs/svg?seed=prasanta" },
];

// ─── VEHICLES ────────────────────────────────────────────────────────────────
const VEHICLES = [
  { type: "SUV",      model: "Mahindra Bolero",     number: "WB 26 X 1234" },
  { type: "Sedan",    model: "Maruti Swift Dzire",  number: "WB 28 Y 5678" },
  { type: "SUV",      model: "Mahindra Scorpio",    number: "WB 26 Z 9012" },
  { type: "MUV/MPV", model: "Maruti Ertiga",        number: "WB 27 A 3456" },
  { type: "Hatchback", model: "Maruti WagonR",      number: "WB 29 B 7890" },
  { type: "SUV",      model: "Hyundai Creta",       number: "CG 04 C 2345" },
  { type: "MUV/MPV", model: "Toyota Innova",        number: "CG 04 D 6789" },
  { type: "Sedan",    model: "Hyundai Aura",        number: "WB 27 E 0123" },
];

// ─── DEPARTURE TIMES ─────────────────────────────────────────────────────────
const TIMES = ["06:00", "07:30", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

// ─── NOTES POOL ──────────────────────────────────────────────────────────────
const NOTES_POOL = [
  "AC available",
  "Pickup from bus stand",
  "Music allowed",
  "No smoking",
  "Pickup from main road only",
  "Ladies friendly",
  "Luggage space available",
  "AC available, comfortable ride",
  "",
  "",
  "",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getDateString(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function slugId(str) {
  return str.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// ─── CLEAR OLD DATA ───────────────────────────────────────────────────────────
async function clearOldData() {
  console.log("\n🗑️  Clearing old data...");

  const routeSnap = await getDocs(collection(db, "routes"));
  for (const d of routeSnap.docs) await deleteDoc(d.ref);
  console.log(`  Deleted ${routeSnap.size} old routes`);

  const rideSnap = await getDocs(collection(db, "rides"));
  for (const d of rideSnap.docs) await deleteDoc(d.ref);
  console.log(`  Deleted ${rideSnap.size} old rides`);
}

// ─── SEED CITIES ─────────────────────────────────────────────────────────────
async function seedCities() {
  console.log("\n🏙️  Seeding cities...");
  for (const city of CITIES) {
    await setDoc(doc(db, "cities", city.id), {
      ...city,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ ${city.name} (${city.nameHi})`);
  }
}

// ─── SEED ROUTES ─────────────────────────────────────────────────────────────
async function seedRoutes() {
  console.log("\n📍 Seeding routes...");
  const createdRouteIds = {};

  for (const route of ROUTES) {
    const fwdId = `route_${route.cityId}_${slugId(route.from)}_${slugId(route.to)}`;
    const pairId = `pair_${route.cityId}_${slugId(route.from)}_${slugId(route.to)}`;

    await setDoc(doc(db, "routes", fwdId), {
      id: fwdId,
      cityId: route.cityId,
      from: route.from,
      to: route.to,
      fromHi: route.fromHi,
      toHi: route.toHi,
      status: "approved",
      submittedBy: null,
      submittedByName: null,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      suggestedFareMin: route.suggestedFareMin,
      suggestedFareMax: route.suggestedFareMax,
      isActive: true,
      rideCount: 0,
      pairId,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ [${route.cityId}] ${route.from} → ${route.to}`);
    createdRouteIds[`${route.cityId}_${route.from}_${route.to}`] = fwdId;

    const revId = `route_${route.cityId}_${slugId(route.to)}_${slugId(route.from)}`;
    await setDoc(doc(db, "routes", revId), {
      id: revId,
      cityId: route.cityId,
      from: route.to,
      to: route.from,
      fromHi: route.toHi,
      toHi: route.fromHi,
      status: "approved",
      submittedBy: null,
      submittedByName: null,
      distance: route.distance,
      estimatedTime: route.estimatedTime,
      suggestedFareMin: route.suggestedFareMin,
      suggestedFareMax: route.suggestedFareMax,
      isActive: true,
      rideCount: 0,
      pairId,
      createdAt: Timestamp.now(),
    });
    console.log(`  ✅ [${route.cityId}] ${route.to} → ${route.from}`);
    createdRouteIds[`${route.cityId}_${route.to}_${route.from}`] = revId;
  }

  return createdRouteIds;
}

// ─── SEED DRIVERS ─────────────────────────────────────────────────────────────
async function seedDrivers() {
  console.log("\n👤 Seeding sample drivers...");
  for (const driver of DRIVERS) {
    await setDoc(doc(db, "users", driver.uid), {
      uid: driver.uid,
      name: driver.name,
      email: `${slugId(driver.name)}@seed.chalsaath.app`,
      photoURL: driver.photoURL,
      phone: driver.phone,
      whatsapp: driver.whatsapp,
      role: "user",
      adminCities: [],
      selectedCity: "bankura",
      homeCities: ["bankura"],
      tripsPosted: 0,
      tripsCompleted: 0,
      isBanned: false,
      preferredLang: "en",
      preferredTheme: "light",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log(`  ✅ Driver: ${driver.name}`);
  }
}

// ─── SEED RIDES ──────────────────────────────────────────────────────────────
async function seedRides(routeIds) {
  console.log("\n🚗 Seeding rides for next 7 days...");
  let totalRides = 0;

  const allRoutes = [
    ...ROUTES.map(r => ({ cityId: r.cityId, from: r.from, to: r.to, fareMin: r.suggestedFareMin, fareMax: r.suggestedFareMax })),
    ...ROUTES.map(r => ({ cityId: r.cityId, from: r.to, to: r.from, fareMin: r.suggestedFareMin, fareMax: r.suggestedFareMax })),
  ];

  for (const route of allRoutes) {
    const routeId = routeIds[`${route.cityId}_${route.from}_${route.to}`];
    if (!routeId) continue;

    const ridesPerRoute = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const usedDays = new Set();

    for (let r = 0; r < ridesPerRoute; r++) {
      let day;
      do { day = Math.floor(Math.random() * 7) + 1; } while (usedDays.has(day));
      usedDays.add(day);

      const driver = randomFrom(DRIVERS);
      const vehicle = randomFrom(VEHICLES);
      const time = randomFrom(TIMES);
      const totalSeats = Math.floor(Math.random() * 3) + 2;
      const bookedSeats = Math.floor(Math.random() * (totalSeats - 1));
      const availableSeats = totalSeats - bookedSeats;
      const fare = route.fareMin + Math.floor(Math.random() * (route.fareMax - route.fareMin));
      const roundedFare = Math.round(fare / 10) * 10;
      const dateStr = getDateString(day);
      const note = randomFrom(NOTES_POOL);

      const rideId = `ride_${route.cityId}_${slugId(route.from)}_${slugId(route.to)}_${dateStr}_${time.replace(":", "")}_${driver.uid.slice(-3)}`;

      await setDoc(doc(db, "rides", rideId), {
        id: rideId,
        cityId: route.cityId,
        routeId,
        routeFrom: route.from,
        routeTo: route.to,
        driverUid: driver.uid,
        driverName: driver.name,
        driverPhoto: driver.photoURL,
        driverPhone: driver.phone,
        driverWhatsapp: driver.whatsapp,
        date: dateStr,
        departureTime: time,
        totalSeats,
        availableSeats,
        pricePerSeat: roundedFare,
        vehicleType: vehicle.type,
        vehicleModel: vehicle.model,
        vehicleNumber: vehicle.number,
        notes: note,
        status: availableSeats === 0 ? "full" : "active",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log(`  ✅ [${route.cityId}] ${route.from} → ${route.to} | ${dateStr} ${time} | ${driver.name} | ₹${roundedFare}`);
      totalRides++;
    }
  }

  return totalRides;
}

// ─── SEED SETTINGS ───────────────────────────────────────────────────────────
async function seedSettings() {
  console.log("\n⚙️  Seeding app settings...");
  await setDoc(doc(db, "settings", "general"), {
    upcomingRideDays: 7,
    maxSeatsPerRide: 7,
    appName: "ChalSaath",
    maintenanceMode: false,
  });
  console.log("  ✅ Settings saved");
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 ChalSaath Seed Script Starting...");
  console.log("📡 Connecting to Firebase...");

  try {
    await clearOldData();
    await seedCities();
    const routeIds = await seedRoutes();
    await seedDrivers();
    const totalRides = await seedRides(routeIds);
    await seedSettings();

    console.log("\n✨ Seed complete!");
    console.log(`   Cities created : ${CITIES.length}`);
    console.log(`   Routes created : ${ROUTES.length * 2} (${ROUTES.length} forward + ${ROUTES.length} reverse)`);
    console.log(`   Drivers created: ${DRIVERS.length}`);
    console.log(`   Rides created  : ${totalRides}`);
    console.log("\n🌐 Visit your app and check the homepage — rides should appear!");
    console.log("👉 Next: Go to Firestore → users → find YOUR document → set role to 'admin' or 'superadmin'");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seed failed:", err.message);
    console.error(err);
    process.exit(1);
  }
}

main();
