import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ideavault";
const client = new MongoClient(uri);

const initialIdeas = [
  {
    title: "EcoSense: IoT Smart AgriTech Systems",
    shortDescription: "Revolutionizing crop yields and water conservation through real-time autonomous IoT sensors and deep neural networking forecasts.",
    detailedDescription: "EcoSense leverages custom soil-probe sensors transmitting nitrogen, phosphorus, potassium, and moisture parameters to an edge-computing gateway. Our neural algorithms compute custom irrigation metrics, lowering water usage by 40% while raising crop output by 25%. Perfect for mid-scale organic orchards and sustainable global co-ops.",
    category: "AI",
    tags: ["agritech", "sustain", "iot", "ai"],
    imageUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 85000,
    targetAudience: "Mid-scale organic farmers and smart farming co-operatives",
    problemStatement: "Traditional farms lose up to 50% of water inputs due to static timer schedules and suffer severe crop damage from delayed soil micro-nutrient detection.",
    proposedSolution: "Introduce autonomous cellular probe networks coupled with dynamic HSL-tinted analytics dashboards providing precise nutrient guidance.",
    userEmail: "demo@ideavault.com",
    userName: "Demo Innovator",
    userPhoto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    likes: ["tester@ideavault.com", "user@ideavault.com"]
  },
  {
    title: "DeFi Co-op Micro-Bonds Platform",
    shortDescription: "Empowering rural communities and local merchants to issue secure, collateral-backed micro-bonds with zero intermediary fees.",
    detailedDescription: "This Web3 platform facilitates the fractionalized tokenization of debt micro-bonds for localized merchants. Instead of facing 18%+ bank interest, businesses issue collateralized high-yield micro-bonds to neighborhood retail buyers. Backed by solid proof-of-reserves, driving credit accessibility forward.",
    category: "Fintech",
    tags: ["fintech", "web3", "defi", "coop"],
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 120000,
    targetAudience: "Small town cooperative merchants and neighborhood micro-lenders",
    problemStatement: "Traditional banking networks charge small-town co-ops high interest rates for simple working capital expansions, freezing regional growth.",
    proposedSolution: "Allow communities to pool collateral directly inside smart contract vaults, bypassing expensive brokers entirely.",
    userEmail: "finance@ideavault.com",
    userName: "Satoshi Builder",
    userPhoto: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    likes: ["demo@ideavault.com", "user@ideavault.com", "builder@ideavault.com"]
  },
  {
    title: "XR Virtual Lab Classrooms",
    shortDescription: "Breaking spatial educational barriers by putting photorealistic virtual reality science laboratories in the hands of global students.",
    detailedDescription: "EcoVR is an immersive spatial curriculum providing high school physics, biology, and chemistry lab simulators in lightweight WebXR. Students perform molecular compound mixes, high-voltage physics experiments, and dissection simulations without physical supplies or hazardous setups.",
    category: "Education",
    tags: ["edtech", "vr", "xr", "science"],
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 45000,
    targetAudience: "Underfunded high schools and global remote learning systems",
    problemStatement: "High-quality laboratory apparatus is incredibly expensive, excluding millions of rural and underfunded students from crucial STEM validation work.",
    proposedSolution: "Design cross-platform lightweight WebXR lab simulations accessible via standard browsers or standalone headsets.",
    userEmail: "edu@ideavault.com",
    userName: "Prof. Einstein",
    userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    likes: ["demo@ideavault.com", "tester@ideavault.com"]
  },
  {
    title: "MedTrack: Personalized Health Assistant",
    shortDescription: "Simplifying clinical care coordination with secure HIPAA-compliant real-time vital integrations and automatic dosage tracking.",
    detailedDescription: "MedTrack bridges the gap between chronic health sufferers and remote clinical physicians. It aggregates heart-rate telemetry, glucose indexes, and blood pressure indicators in real-time, matching medical guidelines with AI dosage models and warning practitioners of critical thresholds.",
    category: "Health",
    tags: ["health", "medical", "telehealth", "ai"],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 95000,
    targetAudience: "Elderly patients with chronic conditions and remote care teams",
    problemStatement: "Patients struggle to maintain high adherence to complex prescription routines while clinical teams operate blind on telemetry between checkups.",
    proposedSolution: "A secure patient-facing app integrating Apple HealthKit/Fitbit directly with a centralized clinic dashboard.",
    userEmail: "doc@ideavault.com",
    userName: "Dr. Florence",
    userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    likes: ["builder@ideavault.com"]
  },
  {
    title: "RetailPulse: AR Storefront Analytics",
    shortDescription: "Empowering physical store owners to capture dynamic shopper attention heatmap analytics using smart lightweight computer vision.",
    detailedDescription: "RetailPulse provides independent store owners with the analytic sophistication of e-commerce platforms. Using low-cost security camera streams, our vision models analyze product engagement times, dwell periods, and product shelf heatmaps, fully respecting shopper privacy.",
    category: "Retail",
    tags: ["retail", "analytics", "ar", "cv"],
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 30000,
    targetAudience: "Boutique retailers and local grocery store merchants",
    problemStatement: "Physical retailers fly completely blind regarding shelf engagement, resulting in highly inefficient store layouts and massive losses.",
    proposedSolution: "Implement localized privacy-first computer vision algorithms translating CCTV feeds into actionable storefront optimization recommendations.",
    userEmail: "retail@ideavault.com",
    userName: "Ada Merchandiser",
    userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    likes: ["user@ideavault.com", "tester@ideavault.com"]
  },
  {
    title: "EduByte: Micro-Credential Academy",
    shortDescription: "Up-skilling technical professionals through ultra-focused micro-modules directly integrated with corporate hire workflows.",
    detailedDescription: "EduByte redefines engineering training. Instead of broad 4-year programs, technical professionals acquire micro-credentials in specialized sectors like system scalability or Kubernetes architectures. All modules include sandboxed coding validators directly linked with recruiter screens.",
    category: "Education",
    tags: ["edtech", "career", "developer"],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 25000,
    targetAudience: "Junior developers and enterprise tech recruitment firms",
    problemStatement: "University curricula fail to keep pace with engineering requirements, leaving graduates with massive skills deficits and recruiters with heavy screening backlogs.",
    proposedSolution: "Modular code challenge pathways that verify competence programmatically and instantly display verifiable developer badges.",
    userEmail: "academy@ideavault.com",
    userName: "Grace Hopper",
    userPhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: []
  },
  {
    title: "CareLink: Decentralized Eldercare Network",
    shortDescription: "Connecting remote families with certified, verified local eldercare professionals through an on-demand, transparent scheduling platform.",
    detailedDescription: "CareLink offers an on-demand care-matching system for senior citizens. Families can schedule nurse visits, physical therapy, and daily companion services. Uses secure multi-signature verification and background-check database integration to guarantee safety and compliance.",
    category: "Health",
    tags: ["health", "eldercare", "care", "on-demand"],
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 55000,
    targetAudience: "Seniors requiring assisted care and their family decision-makers",
    problemStatement: "Finding trustworthy, certified, and instantly available eldercare providers is challenging, opaque, and highly fragmented.",
    proposedSolution: "A verified eldercare network that tracks check-ins, provides real-time updates to families, and manages payments securely.",
    userEmail: "care@ideavault.com",
    userName: "Sarah Jenkins",
    userPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    likes: ["tester@ideavault.com"]
  },
  {
    title: "GreenRoute: Carbon-Neutral Supply Chain AI",
    shortDescription: "Optimizing logistics routes for commercial fleets to minimize fuel consumption, maximize payloads, and automate carbon offset tracking.",
    detailedDescription: "GreenRoute is an API-first routing optimization engine for delivery fleets. Integrating real-time traffic, elevation profiles, weather, and payload weights, our AI determines the lowest carbon route. Automatically compiles verified ESG audit reports for corporate compliance.",
    category: "AI",
    tags: ["ai", "logistics", "esg", "sustainability"],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 140000,
    targetAudience: "Enterprise shipping companies and third-party logistics (3PL) providers",
    problemStatement: "Freight transport accounts for 8% of global greenhouse gas emissions due to suboptimal routing, empty backhauls, and legacy dispatching.",
    proposedSolution: "Implement real-time machine learning route updates paired with automated carbon tracking and localized carbon-offset purchasing.",
    userEmail: "logistics@ideavault.com",
    userName: "Marcus Vance",
    userPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    likes: ["builder@ideavault.com", "user@ideavault.com"]
  },
  {
    title: "OmniSearch: Private Federated Search Engine",
    shortDescription: "A private, zero-tracking federated search solution aggregating developer endpoints and documentation without selling user search patterns.",
    detailedDescription: "OmniSearch indexes public developer APIs, forums, and package registries. Using local client-side search indexing and zero cookie tracking, it delivers lightning-fast documentation lookup. Users control their telemetry data with full opt-in privacy standards.",
    category: "Tech",
    tags: ["tech", "privacy", "search", "developer"],
    imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 75000,
    targetAudience: "Privacy-conscious software developers and enterprise engineering teams",
    problemStatement: "Current search engines sell user search queries and developer history to advertisers, compromising corporate IP and data privacy.",
    proposedSolution: "Build a zero-tracking federated index that returns developer answers directly with cryptographic client-side telemetry protection.",
    userEmail: "privacy@ideavault.com",
    userName: "Linus Torvalds",
    userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: ["demo@ideavault.com"]
  },
  {
    title: "AeroForge: Autonomous Drone Delivery Logistics",
    shortDescription: "Building the decentralized highway control system for autonomous commercial drone fleets navigating low-altitude urban airspace.",
    detailedDescription: "AeroForge creates software infrastructure for drone flight routing, battery swap logistics, and package loading. It serves as an air traffic controller for autonomous delivery craft, avoiding buildings, powerlines, and other drones dynamically via peer-to-peer telemetry.",
    category: "Tech",
    tags: ["tech", "drone", "logistics", "aviation"],
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 185000,
    targetAudience: "E-commerce retailers, healthcare networks, and cargo operators",
    problemStatement: "Last-mile shipping in metropolitan centers is slow, expensive, and congested. Urban drone delivery is restricted by unsafe airspace routing.",
    proposedSolution: "An automated low-altitude air navigation software platform matching drone sensors with dynamic zoning regulations.",
    userEmail: "aero@ideavault.com",
    userName: "Elon Flight",
    userPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: ["builder@ideavault.com", "user@ideavault.com"]
  },
  {
    title: "CivicVibe: Community-driven Urban Planning",
    shortDescription: "A public discussion and consensus-building platform for city residents to vote on municipal developments and local budget allocation.",
    detailedDescription: "CivicVibe enables citizens to propose and rate neighborhood improvements like parks, bike lanes, or community centers. Integrating GIS mapping, it lets users tag specific coordinates and directly interact with city council committees.",
    category: "Other",
    tags: ["community", "govtech", "civic", "gis"],
    imageUrl: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 20000,
    targetAudience: "Municipal governments and local community organizers",
    problemStatement: "Traditional town halls have extremely low attendance, shutting out younger, working-class voices from local budgeting and design decisions.",
    proposedSolution: "A gamified geographic feedback application enabling digital community votes on capital improvements.",
    userEmail: "civic@ideavault.com",
    userName: "Jane Jacobs",
    userPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: ["tester@ideavault.com"]
  },
  {
    title: "BakeFlow: Smart Bakery Operations ERP",
    shortDescription: "Streamlining inventory, flour hydration calculators, dynamic oven schedules, and retail orders for independent artisan bakery shops.",
    detailedDescription: "BakeFlow is a tailored ERP software specifically optimized for bakeries. It calculates exact flour, water, and yeast ratios dynamically based on ambient temperature and relative humidity. Automatically calculates baking schedules to match high retail demand hours, reducing flour waste.",
    category: "Retail",
    tags: ["retail", "erp", "bakery", "iot"],
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80",
    estimatedBudget: 15000,
    targetAudience: "Independent artisan bakers and patisserie shop owners",
    problemStatement: "Baking is highly sensitive to ambient humidity and temperature, leading to inconsistent bread batches and wasted dough under standard recipes.",
    proposedSolution: "A humidity-responsive dough formulation calculator integrated with store inventory and oven schedules.",
    userEmail: "bakery@ideavault.com",
    userName: "Paul Hollywood",
    userPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    createdAt: new Date(),
    likes: ["demo@ideavault.com"]
  }
];

async function run() {
  try {
    await client.connect();
    const db = client.db("ideavault");
    
    // Clear existing
    await db.collection("ideas").deleteMany({});
    await db.collection("comments").deleteMany({});
    
    // Insert
    const result = await db.collection("ideas").insertMany(initialIdeas);
    console.log(`Successfully seeded ${result.insertedCount} high-quality startup ideas!`);
    
    // Insert a few comments for demo purposes
    const ideas = await db.collection("ideas").find({}).toArray();
    const ecoSenseId = ideas.find(i => i.title.includes("EcoSense"))._id.toString();
    const defiId = ideas.find(i => i.title.includes("DeFi"))._id.toString();

    const initialComments = [
      {
        ideaId: ecoSenseId,
        text: "This is brilliant! The 40% water reduction metric completely validates the capital cost. I recommend checking out regional grants for AgriTech validation.",
        userEmail: "tester@ideavault.com",
        userName: "Auditor Tester",
        userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date()
      },
      {
        ideaId: ecoSenseId,
        text: "Are the probe sensors solar-powered, or will they need active battery maintenance cycles? Out in orchards, battery swap-outs become extremely expensive operations.",
        userEmail: "builder@ideavault.com",
        userName: "Hardware Architect",
        userPhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date()
      },
      {
        ideaId: defiId,
        text: "Legal compliance will be your biggest challenge here. Security regulations for localized debt fractionalization are highly complex in the EU and US. Keep it strictly focused on co-op microloans.",
        userEmail: "legal@ideavault.com",
        userName: "Compliance Officer",
        userPhoto: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80",
        createdAt: new Date()
      }
    ];

    await db.collection("comments").insertMany(initialComments);
    console.log("Successfully seeded demo feedback comments!");

  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await client.close();
  }
}

run();
