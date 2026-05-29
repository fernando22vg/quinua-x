import React, { useState } from "react";
import { 
  Compass, Lightbulb, Radio, Cpu, ArrowRight, ShieldCheck, MapPin, 
  Layers, Waves, AlertTriangle, Calculator, FileText, CheckCircle2, 
  User, Mail, Sparkles, Building, Phone, ArrowDown, ChevronDown, 
  HelpCircle, ClipboardCheck, Info, DollarSign, Award, Bot, Heart, RefreshCw, Globe, Activity
} from "lucide-react";
import { GALLERY_MOCK_IMAGES } from "../data";
import { Language, TRANSLATIONS, t } from "../translations";

interface LandingViewProps {
  onNavigate: (page: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  userMode: "basic" | "expert" | null;
  setMode: (mode: "basic" | "expert") => void;
}

// Basin / Regional baseline constants for Altiplano Map Explorer
interface Basin {
  id: string;
  name: string;
  department: string;
  elevation: string;
  avgMoisture: string;
  n15Baseline: string;
  o18Baseline: string;
  soilCondition: string;
  cropsCovered: string;
  coordinates: string;
}

const ALTIPLANO_BASINS: Basin[] = [
  {
    id: "titicaca",
    name: "Lake Titicaca Littoral",
    department: "La Paz",
    elevation: "3,812 m",
    avgMoisture: "38%",
    n15Baseline: "+1.2‰ to +3.5‰",
    o18Baseline: "-5.8‰ to -4.2‰",
    soilCondition: "Rich lacustrine silt alluvial blend",
    cropsCovered: "Royal Quinoa, Tarwi, Native Gold Potato",
    coordinates: "16.16° S, 69.02° W"
  },
  {
    id: "uyuni",
    name: "Uyuni Salar Periphery Zone",
    department: "Potosí",
    elevation: "3,660 m",
    avgMoisture: "16%",
    n15Baseline: "+11.0‰ to +15.5‰",
    o18Baseline: "-1.8‰ to -0.5‰",
    soilCondition: "Highly saline-sodic volcanic clay mix",
    cropsCovered: "Drought-hardy Royal Quinoa, K'añiwa",
    coordinates: "19.84° S, 67.57° W"
  },
  {
    id: "oruro",
    name: "Challapata Meadowlands",
    department: "Oruro",
    elevation: "3,730 m",
    avgMoisture: "32%",
    n15Baseline: "+5.5‰ to +8.2‰",
    o18Baseline: "-4.5‰ to -3.2‰",
    soilCondition: "Volcanic ash sandy loam with rich humus",
    cropsCovered: "Royal Quinoa, Alfalfa, Faba Beans",
    coordinates: "18.90° S, 66.77° W"
  },
  {
    id: "calmarka",
    name: "Calmarka High Steppe",
    department: "La Paz Mountains",
    elevation: "3,950 m",
    avgMoisture: "19%",
    n15Baseline: "+9.8‰ to +13.1‰",
    o18Baseline: "-4.8‰ to -2.9‰",
    soilCondition: "Rocky calcic frigid mountain andosol",
    cropsCovered: "Frost-adapted Quinoa, Bitter Potato",
    coordinates: "16.90° S, 68.12° W"
  }
];

// Interactive Testimonial List
const TESTIMONIALS = [
  {
    quote: "Quinoa-X's Nitrogen-15 tracing saved our entire seasonal harvest. We discovered our organic bio-compost was volatilizing too quickly due to high Andean wind shear. Correcting the application depth doubled our Royal Quinoa yields.",
    author: "Don Humberto Mamani",
    role: "President, Salinas de Garci Mendoza Quinoa Cooperative",
    location: "Oruro, Bolivia",
    stat: "+42% Yield Increase",
    tag: "Quinua Real"
  },
  {
    quote: "By assessing Oxygen-18 depletion ratios across various sub-plots, we identified exactly which sandy terraces were wasting precious Titicaca basin water through evaporation. The smart recommendations solved our moisture deficits in weeks.",
    author: "Doña Elena Quispe",
    role: "Director of Agroscience, Sica Sica Sustainable Farming Union",
    location: "La Paz, Bolivia",
    stat: "-35% Water Saved",
    tag: "Precision Water"
  },
  {
    quote: "Establishing our baseline with absolute isotope precision has opened doors to certified organic markets in Western Europe. Buyers demand concrete metabolic proof of soil-health standards; Quinoa-X delivers it effortlessly.",
    author: "Ing. Marcelo Villca",
    role: "Quality Export Manager, Andes-Bio Exporters",
    location: "Salar de Uyuni Zone, Bolivia",
    stat: "N-15 Bio-Certified",
    tag: "Soil Integrity"
  }
];

// Frequently Asked Questions
const FAQ_ITEMS = [
  {
    question: "What makes stable isotopes different from radioactive ones?",
    answer: "Stable isotopes (like Nitrogen-15, Oxygen-18, and Carbon-13) are naturally occurring, non-decaying, and completely safe. They do not emit ionizing radiation. Unlike radioactive elements, they remain indefinitely stable in nature. We measure their physical mass difference on a molecular level using state-of-the-art Mass Spectrometers to trace natural pathways."
  },
  {
    question: "How does Oxygen-18 map evaporation versus transpiration?",
    answer: "During warm winds, water molecules with the lighter Oxygen-16 isotope evaporate faster from the soil into the atmosphere than heavy Oxygen-18. However, plants pumping water through transpiration absorb both in specific fractions. By comparing isotopic ratios in sap water (δ¹⁸O) directly to soil moisture profiles, we discover exactly how much water of irrigation actually benefits crop cells vs. vaporizes into thin air."
  },
  {
    question: "Do farmers need specialized heavy machinery to use this platform?",
    answer: "Absolutely not. Farmers simply gather baggies of leaf samples or soil cores (which can be dropped off or mailed to our nearest cooperative hub in Challapata or La Paz), or utilize our connected UAV sentinel scanning service. The digital Quinoa-X portal processes remote Copernicus satellite imagery and compiles simple, easy-to-read instructions instantly translated to your mobile web app."
  },
  {
    question: "Can these metrics prove that an organic crop is truly organic?",
    answer: "Yes, this is one of our primary export-enablement capabilities! Synthetic chemical nitrogen fertilizers have a very narrow δ¹⁵N signature around -2‰ to +2‰. In contrast, animal manure, leguminous green composts, and biological nitrogen fixation have highly enriched signatures ranging from +8‰ up to +18‰. Our mass-spectrometry database provides export buyers with absolute, unforgeable biochemical proof that no synthetic nitrogen was fed to the plants."
  }
];

export default function LandingView({ onNavigate, language, setLanguage, userMode, setMode }: LandingViewProps) {
  const tr = (key: string, fallback?: string) => t(language, key, fallback);

  // Sandbox Simulator State (Expert)
  const [selectedCrop, setSelectedCrop] = useState<string>("quinoa");
  const [soilMoisture, setSoilMoisture] = useState<number>(35);
  const [fertilizerType, setFertilizerType] = useState<string>("organic");
  const [simAltitude, setSimAltitude] = useState<number>(3850);

  // Sandbox Simulator State (Basic)
  const isExpertMode = userMode === "expert";
  const [basicLocation, setBasicLocation] = useState<string>("La Paz");
  const [basicArea, setBasicArea] = useState<number>(1);
  const [basicAreaType, setBasicAreaType] = useState<string>("hectares");
  const [basicSoilCond, setBasicSoilCond] = useState<string>("normal");
  const [basicIrrigation, setBasicIrrigation] = useState<string>("more than 1 week ago");
  const [basicIrrigationMethod, setBasicIrrigationMethod] = useState<string>("rainfed only");
  const [basicFertAmount, setBasicFertAmount] = useState<string>("normal");
  const [basicCropCond, setBasicCropCond] = useState<string>("healthy green");
  const [basicProblem, setBasicProblem] = useState<string>("lack of water");
  const [basicWeather, setBasicWeather] = useState<string>("very hot");

  // Explanation state for Basic Mode
  const [showExplanationId, setShowExplanationId] = useState<string | null>(null);

  // Regional Map Atlas State
  const [activeBasinId, setActiveBasinId] = useState<string>("uyuni");

  // Estimator State
  const [inputArea, setInputArea] = useState<number>(25);
  const [areaUnit, setAreaUnit] = useState<string>("hectares");
  const [trialFrequency, setTrialFrequency] = useState<string>("seasonal");
  const [coopDept, setCoopDept] = useState<string>("Oruro");

  // Booking Form State
  const [fullName, setFullName] = useState<string>("");
  const [coopName, setCoopName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [priorityChallenge, setPriorityChallenge] = useState<string>("moisture");
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [bookingSummary, setBookingSummary] = useState<any>(null);

  // FAQ open/close index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Helper calculation for simulated stable isotope metrics
  // Simulated Nitrogen-15 Calculation
  const calculateSimulatedN15 = () => {
    let base = 0;
    if (fertilizerType === "organic") base = 12.8;
    else if (fertilizerType === "bio-slurry") base = 6.4;
    else base = 1.1; // Synthetic
    
    // Altitude slightly limits local biological decomposition, shifting ratios
    const altitudeFactor = (simAltitude - 3600) * 0.0012;
    // Dry soils enrich the residual biological pool due to ammonia volatilization
    const moistureFactor = (100 - soilMoisture) * 0.04;
    
    return parseFloat((base + altitudeFactor + moistureFactor).toFixed(2));
  };

  // Simulated Oxygen-18 Evaporation Calculation
  const calculateSimulatedO18 = () => {
    // Normal deep Andean water has depleted baseline around -13.0
    const deepBaseline = -13.2;
    // Evaporation heavily enriches Oxygen-18 as lighter H2O-16 vaporizes
    const evaporationEnrichment = ((100 - soilMoisture) / 100) * 11.5;
    // Solar intensity and thinner air at higher altitude increases transpirational drive
    const altitudeEnrichment = ((simAltitude - 3600) / 700) * 2.8;

    return parseFloat((deepBaseline + evaporationEnrichment + altitudeEnrichment).toFixed(2));
  };

  // Calculate simulated Photosynthetic-Resilience Index (Carbon-13 equivalent)
  const calculatePhotosyntheticWUE = () => {
    // Standard scale: 0 to 100
    // Higher is better water usage. Heavy dry winds + appropriate soil moisture leads to moderate-high efficiency
    const stressRatio = soilMoisture < 25 ? 0.4 : soilMoisture > 75 ? 0.6 : 0.95; // peak at ~45-55% moisture
    const cropBonus = selectedCrop === "quinoa" ? 15 : selectedCrop === "tarwi" ? 8 : -3;
    const compostBonus = fertilizerType === "organic" ? 12 : 5;
    
    const calculated = Math.min(100, Math.max(10, Math.round(stressRatio * 75 + cropBonus + compostBonus)));
    return calculated;
  };

  // Live dynamic trial pricing quote
  const getHectaresValue = () => {
    switch (areaUnit) {
      case "hectares": return inputArea;
      case "sqmeters": return inputArea / 10000;
      case "acres": return inputArea * 0.404686;
      case "sqkm": return inputArea * 100;
      case "sqfeet": return inputArea * 0.0000092903;
      case "fanegadas": return inputArea * 0.64; // approx 6400 m2
      case "tareas": return inputArea * 0.0628; // approx 628 m2
      default: return inputArea;
    }
  };

  const calculateTrialQuote = () => {
    const currentHectares = getHectaresValue();
    // Base spectrometer laboratory analysis is $12 per hectare baseline
    const testCostPerHectare = trialFrequency === "continuous" ? 28 : trialFrequency === "seasonal" ? 16 : 9;
    const satelliteGridFee = 120; // flat Copernicus Sentinel data pipeline integration
    const subtotalUSD = (testCostPerHectare * currentHectares) + satelliteGridFee;
    
    // Exchange rate approx 1 USD = 6.90 BOB (Bolivian Boliviano)
    const subtotalBOB = Math.round(subtotalUSD * 6.90);
    return {
      usd: subtotalUSD,
      bob: subtotalBOB,
      labRuns: trialFrequency === "continuous" ? 6 : trialFrequency === "seasonal" ? 3 : 1
    };
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !coopName || !emailAddress) {
      alert("Por favor completa los campos principales (Nombre, Cooperativa e Email).");
      return;
    }
    
    const quote = calculateTrialQuote();
    const mockRefID = `Q-X-BOL-${Math.floor(100000 + Math.random() * 900000)}`;
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 14); // 2 weeks out

    const summary = {
      refId: mockRefID,
      clientName: fullName,
      coop: coopName,
      dept: coopDept,
      hectaresField: getHectaresValue(),
      freq: trialFrequency,
      priority: priorityChallenge,
      dateString: scheduledDate.toLocaleDateString("es-BO", { year: 'numeric', month: 'long', day: 'numeric' }),
      usdPrice: quote.usd,
      bobPrice: quote.bob,
      specSamples: quote.labRuns * 4
    };

    setBookingSummary(summary);
    setIsBooked(true);
  };

  const resetBooking = () => {
    setIsBooked(false);
    setBookingSummary(null);
    setFullName("");
    setCoopName("");
    setEmailAddress("");
    setPhoneNumber("");
  };

  const selectedBasin = ALTIPLANO_BASINS.find(b => b.id === activeBasinId) || ALTIPLANO_BASINS[0];
  const activeQuote = calculateTrialQuote();

  return (
    <div id="landing-root" className="flex-1 bg-[#F8F4EA] text-[#102033] overflow-y-auto pt-20 pb-24 relative select-none">
      {/* Andean Geometric Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0zMCAwaDMwdjEwSDMwek0wIDIwaDMwdjEwaC0zMHpNMzAgNDBoMzB2MTBIMzB6TTAgNjBoMzB2MTBoLTMwek0zMCA4MGgzMHYxMEgzMHpNMCAxMDBoMzB2MTBoLTMweiIgZmlsbD0iI0I4NUMzOCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]"></div>

      {/* Decorative ambient warm glows in background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B85C38]/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#D9A441]/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-10 w-[600px] h-[600px] bg-[#3F7D4A]/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section id="hero-landing" className="max-w-6xl mx-auto px-6 pt-8 md:pt-16 pb-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3F7D4A]/10 border border-[#3F7D4A]/30 text-[#3F7D4A] font-mono text-[12px] uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#3F7D4A] animate-pulse"></span>
            {tr('portalTag', 'Bolivian Altiplano Isotopic Research Portal')}
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-[#102033] tracking-tight max-w-4xl font-sans leading-tight">
            {tr('heroSlogan').split(" Sustainable ")[0]} <br />
            <span className="bg-gradient-to-r from-[#3F7D4A] to-[#D9A441] bg-clip-text text-transparent">
              {tr('heroSlogan').split("Sustainable ")[1] || "Sustainable Agriculture"}
            </span>
          </h2>

          <p className="mt-6 text-[#52616B] text-lg md:text-xl max-w-2xl font-normal leading-relaxed">
            {tr('heroDesc')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
            <button
              onClick={() => onNavigate("satellite")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#3F7D4A] to-[#8FAE7D] hover:from-[#3F7D4A] hover:to-[#3F7D4A] text-[#102033] hover:scale-[1.02] active:scale-[0.98] font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#3F7D4A]/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              {tr('ctaAnalyze')}
            </button>
            <button
              onClick={() => onNavigate("overview")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#EFE3C8] hover:bg-[#3B3A73] border border-[#B85C38]/10 hover:border-[#B85C38]/40 hover:scale-[1.02] active:scale-[0.98] text-[#102033] transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{tr('ctaEnter')}</span>
              <ArrowRight className="w-4 h-4 text-[#3F7D4A]" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured visual: Altiplano Satellite Grid Imagery */}
      <section id="featured-atlas" className="max-w-6xl mx-auto px-6 mb-16 relative z-10">
        <div className="group relative rounded-2xl overflow-hidden border border-[#B85C38]/10/80 bg-[#EFE3C8]/40 p-1.5 shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
          
          <div className="relative rounded-xl overflow-hidden aspect-[21/9]">
            <img
              src={GALLERY_MOCK_IMAGES.landscape}
              alt="Bolivian Altiplano Landscape and Crops"
              className="w-full h-full object-cover grayscale-25 brightness-90 group-hover:scale-[1.005] transition-transform duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            {/* Visual overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/20 to-transparent"></div>
            
            {/* Field markers styled neatly */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="bg-[#F8F4EA]/90 backdrop-blur-md p-4 rounded-xl border border-[#B85C38]/10 max-w-sm">
                <div className="flex items-center gap-2 text-[#3F7D4A] text-xs font-mono font-semibold uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Altiplano Field Station QX-4
                </div>
                <p className="text-[11px] text-[#52616B] leading-normal">
                  Real-time δ15N and δ18O biological tracking arrays monitoring Royal Quinoa crops at an altitude of 3,850 meters near Salinas.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2.5 bg-[#F8F4EA]/90 backdrop-blur-md border border-[#B85C38]/10 rounded-lg text-center min-w-[100px]">
                  <div className="text-[9px] font-mono text-[#52616B] uppercase">T-EVAP EXERTION</div>
                  <div className="text-xs font-mono font-bold text-[#3F7D4A]">-4.2‰</div>
                </div>
                <div className="px-4 py-2.5 bg-[#F8F4EA]/90 backdrop-blur-md border border-[#B85C38]/10 rounded-lg text-center min-w-[100px]">
                  <div className="text-[9px] font-mono text-[#52616B] uppercase">δ15N ABSORPTION</div>
                  <div className="text-xs font-mono font-bold text-[#2F80A8]">+12.4‰</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INTERACTIVE ALTIPLANO ATOMIC atlas (Geographic hot-spots explorer) */}
      <section id="geographic-atlas" className="max-w-6xl mx-auto px-6 mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-[#3F7D4A] uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Compass className="w-4 h-4" />
              Regional Baselines
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#102033]">
              Altiplano Isotopic Soil Atlas
            </h3>
            <p className="text-sm text-[#52616B] max-w-xl mt-1.5 leading-normal">
              Click on the historical monitoring basins below to analyze real baseline indicators verified by chemical mass-spectrometers across the Andes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALTIPLANO_BASINS.map((basin) => (
              <button
                key={basin.id}
                onClick={() => setActiveBasinId(basin.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                  activeBasinId === basin.id
                    ? "bg-[#3F7D4A]/10 border-[#3F7D4A] text-[#3F7D4A] font-semibold"
                    : "bg-[#EFE3C8]/50 border-[#B85C38]/10 text-[#52616B] hover:border-[#B85C38]/40 hover:text-[#1F2933]"
                }`}
              >
                {basin.name}
              </button>
            ))}
          </div>
        </div>

        {/* Basin Information display card */}
        <div className="bg-[#FFFFFF] shadow-sm border border-[#B85C38]/20 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#F8F4EA] border border-[#B85C38]/10 text-[11px] font-mono text-[#52616B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F80A8] animate-pulse"></span>
                Latitude / Longitude: {selectedBasin.coordinates}
              </div>
              
              <h4 className="text-xl font-bold text-[#102033] mt-4 flex items-center gap-2">
                <span>{selectedBasin.name}</span>
                <span className="text-xs font-mono bg-[#3F7D4A]/10 text-[#3F7D4A] border border-[#3F7D4A]/20 px-2 py-0.5 rounded">
                  {selectedBasin.department} Department
                </span>
              </h4>

              <p className="text-sm text-[#52616B] mt-3 leading-relaxed">
                This agricultural basin represents critical altitude challenges. Its specialized soil profiles are mapped below detailing stable isotopic fractions calculated as historical regional averages.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#F8F4EA]/40 border border-[#B85C38]/10 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-[#52616B]">TYPICAL ELEVATION</div>
                  <div className="text-sm font-semibold text-[#1F2933] mt-0.5">{selectedBasin.elevation}</div>
                </div>
                <div className="bg-[#F8F4EA]/40 border border-[#B85C38]/10 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-[#52616B]">AVERAGE SOIL MOISTURE</div>
                  <div className="text-sm font-semibold text-[#1F2933] mt-0.5">{selectedBasin.avgMoisture}</div>
                </div>
                <div className="bg-[#F8F4EA]/40 border border-[#B85C38]/10 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-[#52616B]">δ15N (ORGANIC VS SYNTHETIC)</div>
                  <div className="text-sm font-mono font-bold text-[#3F7D4A] mt-0.5">{selectedBasin.n15Baseline}</div>
                </div>
                <div className="bg-[#F8F4EA]/40 border border-[#B85C38]/10 p-3 rounded-xl">
                  <div className="text-[10px] font-mono text-[#52616B]">δ18O (EVAP SYNC)</div>
                  <div className="text-sm font-mono font-bold text-[#2F80A8] mt-0.5">{selectedBasin.o18Baseline}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#B85C38]/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs text-[#52616B]">
              <div>
                <strong className="text-[#52616B] block">Common Crops:</strong>
                <span>{selectedBasin.cropsCovered}</span>
              </div>
              <div className="bg-[#F8F4EA]/80 px-3 py-1.5 rounded-lg border border-[#B85C38]/20/60 text-[10.5px] font-mono italic text-[#52616B]">
                Soil Profile: {selectedBasin.soilCondition}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#F8F4EA]/70 rounded-xl border border-[#B85C38]/20/50 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3F7D4A]/5 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div>
              <div className="text-[11px] font-mono text-[#3F7D4A] uppercase tracking-widest flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                COPERNICUS HUD MATCH
              </div>
              <h5 className="text-sm font-semibold text-[#1F2933] mt-2">Active Soil Chemical Drift</h5>
              <p className="text-xs text-[#52616B] mt-1.5 leading-normal">
                Correlations denote high transpirational evaporation losses. Stable oxygen analysis reveals heavy isotopic fractions left on high-gradient slope topographies.
              </p>

              <div className="space-y-3.5 mt-5">
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#52616B] mb-1">
                    <span>15N BIOSIGNATURE FIDELITY</span>
                    <span className="text-[#3F7D4A]">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EFE3C8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#3F7D4A] rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#52616B] mb-1">
                    <span>AQUIFER SOURCE RECHARGE COEF</span>
                    <span className="text-[#2F80A8]">68%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EFE3C8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2F80A8] rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#52616B] mb-1">
                    <span>STOMATAL RESILIENCY RATIO</span>
                    <span className="text-[#8FAE7D]">81%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#EFE3C8] rounded-full overflow-hidden">
                    <div className="h-full bg-[#D9A441]/100 rounded-full" style={{ width: "81%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => onNavigate("isotope")}
                className="w-full py-2.5 rounded-lg bg-[#EFE3C8] hover:bg-[#3B3A73] text-xs font-mono font-bold text-[#1F2933] border border-[#B85C38]/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>COMPARE ALL ISOTOPES</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#3F7D4A]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE ISOTOPIC MICRO-ATMOSPHERE SIMULATOR (Fully Interactive Sandbox) */}
      <section id="laboratory-sandbox" className="max-w-6xl mx-auto px-6 mb-20 relative z-10">
        <div className="bg-gradient-to-br from-[#EFE3C8]/60 to-[#102033]/40 border border-[#B85C38]/20 rounded-2xl p-6 md:p-10">
          
          <div className="flex justify-between items-center mb-8 border-b border-[#B85C38]/10 pb-4">
            <div>
              <div className="text-xs font-mono text-[#3F7D4A] uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-[#3F7D4A]" />
                {tr('sandboxTag', 'Agronomist Sandbox')}
              </div>
              <h3 className="text-2xl font-extrabold text-[#102033] flex items-center gap-3">
                {tr('sandboxTitle', 'Soil Isotope Simulator')}
              </h3>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex bg-[#F8F4EA] rounded-lg p-1 border border-[#B85C38]/10">
              <button 
                onClick={() => setMode("basic")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold font-mono transition-colors ${!isExpertMode ? 'bg-[#3F7D4A]/10 text-[#3F7D4A] border border-[#D9A441]/40/50' : 'text-[#52616B] hover:text-[#52616B]'}`}
              >
                BASIC MODE
              </button>
              <button 
                onClick={() => setMode("expert")}
                className={`px-4 py-1.5 rounded-md text-xs font-bold font-mono transition-colors ${isExpertMode ? 'bg-[#3B3A73]/50 text-[#8FAE7D] border border-[#3B3A73]/50' : 'text-[#52616B] hover:text-[#52616B]'}`}
              >
                EXPERT MODE
              </button>
            </div>
          </div>

          {!isExpertMode ? (
            /* ================= BASIC MODE UI ================= */
            <div className="flex flex-col items-center justify-center p-12 bg-[#EFE3C8] border border-[#B85C38]/10 rounded-2xl text-center">
              <h3 className="text-xl text-[#3F7D4A] font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                {tr('basicModeWelcome', 'Welcome to Farmer Basic Mode')}
              </h3>
              <p className="text-[#52616B] mb-8 max-w-md">
                {tr('basicModeDesc', 'You have selected Basic Mode. The platform will handle all the complex nuclear calculations behind the scenes. Enter your field details and get simple, actionable recommendations.')}
              </p>
              <button 
                onClick={() => onNavigate('basic-dashboard')} 
                className="bg-[#3F7D4A] hover:bg-[#3F7D4A] text-[#102033] px-8 py-3 rounded-xl font-bold font-mono tracking-wide transition-colors"
                title="Go to Basic Field Dashboard"
              >
                OPEN MY FIELD DASHBOARD
              </button>
            </div>
          ) : (
            /* ================= EXPERT MODE UI ================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Simulator Controls */}
              <div className="lg:col-span-5">
                <p className="text-xs text-[#52616B] mt-2 mb-6 leading-relaxed">
                  {tr('sandboxDesc', 'Tweak simulated local parameters to watch how crops fractionate Deuterium, Nitrogen-15, and Oxygen-18. This mimics real-world dry Altiplano farming conditions.')}
                </p>

                {/* Crop Select */}
                <div className="mt-6">
                  <label className="text-[10px] font-mono text-[#52616B] block uppercase mb-1.5">{tr('cropLabel', '1. Target Native Crop')}</label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 hover:border-[#B85C38]/40 rounded-lg px-3 py-2 text-[#52616B] font-semibold text-sm focus:outline-none focus:border-[#3F7D4A] transition-colors cursor-pointer"
                  >
                    <option value="quinoa">Royal Quinoa (Quinua Real)</option>
                    <option value="tarwi">Tarwi Lupin (Chocho)</option>
                    <option value="potato">Imilla Potato (Papa Nativa)</option>
                    <option value="coffee">Yungas Premium Coffee</option>
                    <option value="cacao">Amazonian Cacao</option>
                    <option value="corn">Andean Maize (Choclo)</option>
                    <option value="barley">High-Altitude Barley</option>
                    <option value="wheat">Hard Red Wheat</option>
                    <option value="faba">Broad Faba Beans</option>
                    <option value="canahua">Cañahua (Kañiwa)</option>
                    <option value="amaranth">Kiwicha (Amaranth)</option>
                    <option value="rice">Lowland Rice</option>
                    <option value="tomato">Heirloom Tomato</option>
                    <option value="onion">Tarija Onion</option>
                    <option value="garlic">Purple Garlic</option>
                    <option value="peach">Cochabamba Peach</option>
                    <option value="grape">Tarija Wine Grape</option>
                    <option value="chili">Locoto (Chili Pepper)</option>
                    <option value="coca">Legal Coca Leaf</option>
                  </select>
                </div>

                {/* Slider: Soil Moisture */}
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-[#52616B]">{tr('moistureLabel', '2. SOIL MOISTURE LEVEL')}</span>
                    <span className="text-[#2F80A8] font-bold">{soilMoisture}% {soilMoisture < 25 ? tr('droughtPeak', '(Drought Peak)') : tr('optimalLabel', 'Optimal')}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={soilMoisture}
                      onChange={(e) => setSoilMoisture(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 hover:border-[#B85C38]/40 rounded px-3 py-2 text-[#2F80A8] font-mono text-sm focus:outline-none focus:border-[#2F80A8] transition-colors"
                    />
                    <span className="absolute right-3 top-2 text-[#52616B] text-xs font-mono select-none">%</span>
                  </div>
                </div>

                {/* Slider: Sim Altitude */}
                <div className="mt-5">
                  <div className="flex justify-between text-[10px] font-mono mb-1.5">
                    <span className="text-[#52616B]">{tr('altitudeLabel', '3. ELEVATION THRESHOLD')}</span>
                    <span className="text-[#8FAE7D] font-bold">{simAltitude} {tr('meters', 'meters')}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={simAltitude}
                      onChange={(e) => setSimAltitude(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 hover:border-[#B85C38]/40 rounded px-3 py-2 text-[#8FAE7D] font-mono text-sm focus:outline-none focus:border-[#3B3A73] transition-colors"
                    />
                    <span className="absolute right-3 top-2 text-[#52616B] text-xs font-mono select-none">m.a.s.l.</span>
                  </div>
                </div>

                {/* Fertilizer Source Selection */}
                <div className="mt-5">
                  <label className="text-[10px] font-mono text-[#52616B] block uppercase mb-1.5">{tr('nitrogenLabel', '4. Nitrogen Treatment Applied')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setFertilizerType("organic")}
                      className={`py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        fertilizerType === "organic"
                          ? "bg-[#D9A441]/10/45 border-[#3F7D4A] text-[#3F7D4A]"
                          : "bg-[#EFE3C8] border-[#B85C38]/10 text-[#52616B]"
                      }`}
                    >
                      {tr('organic', 'Sheep Compost')}
                    </button>
                    <button
                      onClick={() => setFertilizerType("bio-slurry")}
                      className={`py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        fertilizerType === "bio-slurry"
                          ? "bg-[#D9A441]/10/45 border-[#3F7D4A] text-[#3F7D4A]"
                          : "bg-[#EFE3C8] border-[#B85C38]/10 text-[#52616B]"
                      }`}
                    >
                      {tr('bioSlurry', 'Alpaca Bio-Slurry')}
                    </button>
                    <button
                      onClick={() => setFertilizerType("synthetic")}
                      className={`py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                        fertilizerType === "synthetic"
                          ? "bg-[#D9A441]/10/45 border-[#3F7D4A] text-[#3F7D4A]"
                          : "bg-[#EFE3C8] border-[#B85C38]/10 text-[#52616B]"
                      }`}
                    >
                      {tr('synthetic', 'Synthetic Urea')}
                    </button>
                  </div>
                </div>

                <div className="bg-[#F8F4EA]/60 border border-[#B85C38]/20 p-3.5 rounded-xl mt-6 flex gap-3 items-start">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#D99A2B] mt-0.5 shrink-0" />
                  <p className="text-[11px] text-[#52616B] leading-normal">
                    {fertilizerType === "synthetic" 
                      ? tr('syntheticWarning', 'Warning: Chemical synthetics compress δ15N toward 0‰. Standard bio-certified European exporters automatically reject quotas showing these synthetic baselines.')
                      : tr('organicExcellent', 'Excellent: Organic bio-slurry creates a significant isotope tracer trail (+6‰ to +15‰ δ15N), perfect for exported carbon and organic tracking.')}
                  </p>
                </div>

              </div>

              {/* Simulated Live Spectrometer Displays */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full bg-[#F8F4EA] border border-[#B85C38]/20/80 rounded-2xl p-6 relative">
                <div className="absolute top-2 right-4 text-[9px] font-mono text-[#EFE3C8]/50 tracking-widest">
                  PREDICTIVE ANALYTICS ENGINE L-13
                </div>

                <div>
                  <h4 className="text-sm font-mono font-bold text-[#52616B] uppercase flex items-center gap-1.5 border-b border-[#B85C38]/20 pb-2.5">
                    <Calculator className="w-4 h-4 text-[#3F7D4A]" />
                    {tr('liveSpectrogram', 'Live Predictive Spectrogram Output')}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                    {/* Metric Card 1 */}
                    <div className="bg-[#EFE3C8]/40 p-4 rounded-xl border border-[#B85C38]/20 relative">
                      <div className="absolute -top-2.5 right-3 bg-[#3F7D4A]/10 text-[#3F7D4A] text-[8px] font-mono px-2 py-0.5 rounded border border-[#3F7D4A]/20">
                        tracer {selectedCrop}
                      </div>
                      <div className="text-[10px] font-mono text-[#52616B]">{tr('predN15', 'PREDICTED δ15N RATIO (NITROGEN)')}</div>
                      <p className="text-2xl font-mono font-bold text-[#3F7D4A] mt-2 flex items-baseline gap-1">
                        {calculateSimulatedN15() < 0 ? "" : "+"}
                        {calculateSimulatedN15()}‰
                      </p>
                      <p className="text-[10px] text-[#52616B] mt-1.5 leading-relaxed">
                        {tr('n15Desc', 'High positive percentages denote pure organic absorption and high nutrient utilization efficiency.')}
                      </p>
                    </div>

                    {/* Metric Card 2 */}
                    <div className="bg-[#EFE3C8]/40 p-4 rounded-xl border border-[#B85C38]/20 relative">
                      <div className="absolute -top-2.5 right-3 bg-[#2F80A8]/20 text-[#2F80A8] text-[8px] font-mono px-2 py-0.5 rounded border border-[#2F80A8]/30">
                        sap-moisture
                      </div>
                      <div className="text-[10px] font-mono text-[#52616B]">{tr('predO18', 'PREDICTED δ18O DEPLETION')}</div>
                      <p className="text-2xl font-mono font-bold text-[#2F80A8] mt-2">
                        {calculateSimulatedO18()}‰
                      </p>
                      <p className="text-[10px] text-[#52616B] mt-1.5 leading-relaxed">
                        {tr('o18Desc', 'Depleted values mirror deep groundwater draw. Enriched values reveal extreme evaporative stress on sub-stomata.')}
                      </p>
                    </div>
                  </div>

                  {/* Simulated Water-Use Efficiency Rating scale */}
                  <div className="bg-[#FFFFFF] shadow-sm p-4 rounded-xl border border-[#B85C38]/20 mt-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-mono text-[#52616B]">{tr('wueIndex', 'Photosynthetic Water-Use Resiliency Index (WUE)')}</div>
                        <h5 className="text-xs font-bold text-[#1F2933] mt-1">
                          {tr('computedEff', 'Computed efficiency')} 
                        </h5>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-mono text-[#52616B]">{tr('estimatedYield', 'ESTIMATED YIELD')}</div>
                        <span className="text-lg font-bold text-[#3F7D4A]">{calculatePhotosyntheticWUE()}%</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#EFE3C8] rounded-full mt-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#3F7D4A] via-emerald-400 to-cyan-400 rounded-full transition-all duration-500" 
                        style={{ width: `${calculatePhotosyntheticWUE()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-[#EFE3C8]/50 mt-1.5">
                      <span>{tr('critRisk', 'CRITICAL RISK')}</span>
                      <span>{tr('optBiomass', 'OPTIMAL CARBON BIOMASS INTAKE')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#B85C38]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-[#52616B] leading-tight">
                    <span className="text-[#52616B]">{tr('simVars', 'Simulation Variables:')}</span> {soilMoisture}% {tr('moistureKey', 'moisture')} • {simAltitude}m {tr('elevKey', 'elevation')}
                  </div>
                  <button
                    onClick={() => onNavigate("isotope")}
                    className="px-4 py-2 rounded bg-gradient-to-r from-[#3F7D4A] to-[#8FAE7D] hover:from-[#3F7D4A] hover:to-[#3F7D4A] text-[#102033] font-mono font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    {tr('runMetrics', 'RUN FULL SPECTRUM METRICS')}
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: THE EXPERIMENTAL COOP TRIAL COST ESTIMATOR & TRIAL BOOKING ENGINE (Fully usable feature) */}
      <section id="coop-trial-booking" className="max-w-6xl mx-auto px-6 mb-20 relative z-10">
        <div className="text-center mb-10">
          <div className="text-sm font-mono text-[#3F7D4A] uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
            <ClipboardCheck className="w-4 h-4 text-[#3F7D4A]" />
            COMMUNITY COOPERATIVE SERVICES
          </div>
          <h3 className="text-3xl font-extrabold text-[#102033]">
            Secure an Isotropic Soil Baseline Trial
          </h3>
          <p className="text-sm text-[#52616B] max-w-2xl mx-auto mt-2.5">
            Determine spectrometer costs for your agricultural cooperative. Configure your field trial size below and directly book an evaluation consult in local Bolivian currency.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Slider and live Calculator */}
          <div className="lg:col-span-4 bg-[#EFE3C8]/30 border border-[#B85C38]/20 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-md font-bold text-[#1F2933] uppercase tracking-wide border-b border-[#B85C38]/20 pb-3 flex items-center gap-1.5">
                <Calculator className="w-4.5 h-4.5 text-[#3F7D4A]" />
                Live Quote Estimator
              </h4>

              {/* Department Selection */}
              <div className="mt-5">
                <label className="text-[10px] font-mono text-[#52616B] block uppercase mb-1">Cooperative Site Department</label>
                <select
                  value={coopDept}
                  onChange={(e) => setCoopDept(e.target.value)}
                  className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg p-2.5 text-xs text-[#EFE3C8] focus:border-[#3F7D4A] focus:outline-none"
                >
                  <option value="Oruro">Oruro (Salinas, Challapata)</option>
                  <option value="La Paz">La Paz (Altiplano Steppe)</option>
                  <option value="Potosí">Potosí (Uyuni Regional coops)</option>
                </select>
              </div>

              {/* Acreage Range */}
              <div className="mt-5">
                <div className="flex justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-[#52616B] uppercase">ESTIMATED FARM SIZE ({areaUnit === 'sqmeters' ? 'sq meters' : areaUnit === 'sqkm' ? 'sq km' : areaUnit})</span>
                  <span className="text-[#3F7D4A] font-bold">{getHectaresValue().toFixed(2)} Equivalent Hectares</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    value={inputArea}
                    onChange={(e) => setInputArea(parseFloat(e.target.value) || 1)}
                    className="flex-1 bg-[#F8F4EA] border border-[#B85C38]/10 hover:border-[#B85C38]/40 rounded px-3 py-2 text-[#3F7D4A] font-mono text-sm focus:outline-none focus:border-[#3F7D4A] transition-colors"
                  />
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value)}
                    className="bg-[#F8F4EA] border border-[#B85C38]/10 hover:border-[#B85C38]/40 rounded px-3 py-2 text-[#52616B] font-mono text-sm focus:outline-none focus:border-[#3F7D4A] transition-colors cursor-pointer"
                  >
                    <option value="hectares">Hectares</option>
                    <option value="sqmeters">Sq Meters</option>
                    <option value="acres">Acres</option>
                    <option value="sqkm">Sq Kilometers</option>
                    <option value="sqfeet">Sq Feet</option>
                    <option value="fanegadas">Fanegadas</option>
                    <option value="tareas">Tareas</option>
                  </select>
                </div>
                <div className="text-[9px] font-mono text-[#EFE3C8]/50 mt-1.5">
                  Prices are calculated using hectares as the internal standard.
                </div>
              </div>

              {/* Testing Frequency */}
              <div className="mt-5">
                <label className="text-[10px] font-mono text-[#52616B] block uppercase mb-1">Evaluation Interval</label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F4EA] border border-[#B85C38]/10 cursor-pointer hover:border-[#B85C38]/40">
                    <input
                      type="radio"
                      name="frequency"
                      checked={trialFrequency === "oneoff"}
                      onChange={() => setTrialFrequency("oneoff")}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#52616B] block">Baseline Assessment</span>
                      <span className="text-[9.5px] text-[#52616B] font-mono">Single Mass Spectrometer Soil Audit</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F4EA] border border-[#B85C38]/10 cursor-pointer hover:border-[#B85C38]/40">
                    <input
                      type="radio"
                      name="frequency"
                      checked={trialFrequency === "seasonal"}
                      onChange={() => setTrialFrequency("seasonal")}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#3F7D4A] block">Seasonal (Recomendado)</span>
                      <span className="text-[9.5px] text-[#52616B] font-mono">Three sequential crop scans across planting, frost & harvest</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-[#F8F4EA] border border-[#B85C38]/10 cursor-pointer hover:border-[#B85C38]/40">
                    <input
                      type="radio"
                      name="frequency"
                      checked={trialFrequency === "continuous"}
                      onChange={() => setTrialFrequency("continuous")}
                      className="accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#2F80A8] block">Continuous Academic Sync</span>
                      <span className="text-[9.5px] text-[#52616B] font-mono">Bi-monthly UAV sweeps & Sentinel telemetry pipelines</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Simulated Live Cost Display */}
            <div className="mt-6 pt-5 border-t border-[#B85C38]/20 grid grid-cols-2 gap-3">
              <div className="bg-[#F8F4EA] p-3 rounded-lg border border-[#B85C38]/20">
                <div className="text-[8.5px] font-mono text-[#52616B] uppercase">SATELLITE & GPS FEE</div>
                <div className="text-[#1F2933] text-xs font-mono font-bold mt-1">$120 USD</div>
                <div className="text-[8px] text-[#52616B] font-mono">Copernicus Grid Sync</div>
              </div>
              <div className="bg-[#F8F4EA] p-3 rounded-lg border border-[#B85C38]/20">
                <div className="text-[8.5px] font-mono text-[#52616B] uppercase">LABORATORY COST</div>
                <div className="text-[#1F2933] text-xs font-mono font-bold mt-1">${Math.round(activeQuote.usd - 120)} USD</div>
                <div className="text-[8px] text-[#3F7D4A]/80 font-mono">{activeQuote.labRuns * 4} Soil Samples</div>
              </div>
              <div className="col-span-2 bg-gradient-to-br from-emerald-950/30 to-[#102033] p-4 rounded-xl border border-[#D9A441]/20 text-center relative overflow-hidden mt-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3F7D4A]/5 blur-[40px] pointer-events-none"></div>
                <div className="text-[10px] font-mono text-[#3F7D4A]">TOTAL ESTIMATE BUDGET</div>
                <p className="text-3xl font-extrabold text-white mt-1.5 flex items-baseline justify-center gap-2">
                  <span className="text-base text-[#EFE3C8] font-normal">Bs.</span>
                  {activeQuote.bob.toLocaleString()}
                </p>
                <div className="text-xs text-[#EFE3C8] font-mono mt-1 pt-2 border-t border-[#EFE3C8]/20 inline-block">
                  <span className="font-bold text-[#EFE3C8]">Total:</span> ${activeQuote.usd.toLocaleString()} USD
                </div>
              </div>
            </div>
          </div>

          {/* Consultation Booking Form (Transforms into beautiful simulated official receipt upon submission!) */}
          <div className="lg:col-span-8 bg-[#EFE3C8]/30 border border-[#B85C38]/20 rounded-2xl p-6 md:p-8 relative">
            {!isBooked ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h4 className="text-lg font-bold text-[#102033] uppercase tracking-wide border-b border-[#B85C38]/20 pb-3 flex items-center justify-between">
                  <span>Cooperative Trial Intake Registration</span>
                  <span className="text-xs font-mono text-[#52616B] lowercase">no payment required</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-[#52616B] block mb-1">CULTIVATOR FULL NAME *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-[#52616B]" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Humberto Mamani Huanca"
                        className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg py-2 pl-9 pr-4 text-sm text-[#1F2933] placeholder-zinc-750 focus:border-[#3F7D4A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#52616B] block mb-1">COOPERATIVE / UNION NAME *</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-[#52616B]" />
                      <input
                        type="text"
                        required
                        value={coopName}
                        onChange={(e) => setCoopName(e.target.value)}
                        placeholder="e.g. Salinas Royal Quinoa Growers Coop"
                        className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg py-2 pl-9 pr-4 text-sm text-[#1F2933] placeholder-zinc-750 focus:border-[#3F7D4A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-[#52616B] block mb-1">SECURE EMAIL ADDRESS *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-[#52616B]" />
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="e.g. humberto@salinas-coop.org"
                        className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg py-2 pl-9 pr-4 text-sm text-[#1F2933] placeholder-zinc-750 focus:border-[#3F7D4A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-[#52616B] block mb-1">WHATSAPP / PHONE NUMBER (Optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-[#52616B]" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. +591 71234567"
                        className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg py-2 pl-9 pr-4 text-sm text-[#1F2933] placeholder-zinc-750 focus:border-[#3F7D4A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#52616B] block mb-1">PRIMARY ECOLOGICAL PROBLEM INSIDE THE FIELD</label>
                  <select
                    value={priorityChallenge}
                    onChange={(e) => setPriorityChallenge(e.target.value)}
                    className="w-full bg-[#F8F4EA] border border-[#B85C38]/10 rounded-lg p-2.5 text-xs text-[#52616B] focus:border-[#3F7D4A] focus:outline-none"
                  >
                    <option value="moisture">Evaporative water loss (Frequent drought, dry mountain winds)</option>
                    <option value="nitrogen">Nitrogen depletion / Bio-fertilizer uptake efficiency uncertainty</option>
                    <option value="frost">Extreme high-altitude frost resilience tracking</option>
                    <option value="organic-audit">Organic export certification metadata audits (EU and US standards)</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#3F7D4A] to-[#8FAE7D] hover:from-[#3F7D4A] hover:to-[#3F7D4A] text-[#102033] font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ClipboardCheck className="w-4.5 h-4.5" />
                    REGISTER FREE FIELD EVALUATION TRIAL
                  </button>
                </div>
              </form>
            ) : (
              /* Simulated Official Registration Receipt - High Fidelity Design */
              <div className="space-y-6 animate-fade-in">
                <div className="bg-[#D9A441]/10/20 border border-[#3F7D4A]/30 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3F7D4A]/20 flex items-center justify-center text-[#3F7D4A] shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#102033]">Hiring Consult Request Confirmed Successfully!</h5>
                    <p className="text-xs text-[#52616B]">Our regional agronomist from Copacabana or Challapata Hub will contact your cooperative shortly.</p>
                  </div>
                </div>

                <div className="bg-[#F8F4EA] border border-[#B85C38]/20 rounded-xl p-6 font-mono text-xs text-[#52616B] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-[#3F7D4A]/10 text-[#3F7D4A] border-l border-b border-[#B85C38]/20 font-bold uppercase tracking-widest text-[9px] rounded-bl-lg">
                    {bookingSummary.refId}
                  </div>
                  
                  <div className="border-b border-[#B85C38]/20 pb-4 mb-4">
                    <h6 className="text-[13px] font-bold text-[#1F2933]">QUINOA-X ALTI_SECURE BASELINE ESTIMATE</h6>
                    <p className="text-[10px] text-[#52616B] uppercase mt-0.5">Bolivian Ministry Compliance Framework</p>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-[#52616B]">CLIENT / COOP:</span>
                      <span className="text-[#1F2933]">{bookingSummary.clientName} / {bookingSummary.coop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52616B]">DEPARTMENT:</span>
                      <span className="text-[#1F2933]">{bookingSummary.dept} Department</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52616B]">SURVEY SCOPE:</span>
                      <span className="text-[#1F2933]">{bookingSummary.hectaresField} Hectáres ({bookingSummary.freq} sync)</span>
                    </div>
                    <div className="flex justify-between border-t border-[#B85C38]/20/65 pt-2 mt-2">
                      <span className="text-[#52616B]">ESTIMATED LAUNCH:</span>
                      <span className="text-[#1F2933] font-semibold">{bookingSummary.dateString}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52616B]">SPECTROMETER AUDITS:</span>
                      <span className="text-[#3F7D4A]">{bookingSummary.specSamples} independent leaf/soil samples</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#52616B]">ECOLOGICAL PRIORITY:</span>
                      <span className="text-[#EFE3C8]">{bookingSummary.priority === 'moisture' ? 'Moisture Loss' : bookingSummary.priority === 'nitrogen' ? 'Nitrogen Ingestion' : 'Organic Certification Audit'}</span>
                    </div>
                  </div>

                  <div className="bg-[#EFE3C8]/50 p-3 rounded-lg border border-[#B85C38]/20 mt-5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-[#52616B] uppercase">Est. Coop Budget Total:</span>
                      <p className="text-lg font-bold text-[#3F7D4A]">Bs. {bookingSummary.bobPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#52616B] uppercase">Validez Internacional:</span>
                      <p className="text-xs text-[#52616B] font-semibold">${bookingSummary.usdPrice} USD</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={resetBooking}
                    className="px-5 py-2.5 rounded-lg bg-[#EFE3C8] hover:bg-[#3B3A73] text-xs font-semibold text-[#52616B] border border-[#B85C38]/10 transition-all cursor-pointer"
                  >
                    Calculate New cooperative Size
                  </button>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Comenzando la descarga simulada del PDF de Protocolo de Isótopos Quinoa-X v1.4");
                    }}
                    className="px-5 py-2.5 rounded-lg bg-[#3F7D4A] hover:bg-[#3F7D4A] text-[#102033] font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    DOWNLOAD SCOPING PAPER (PDF)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section id="cooperative-testimonials" className="max-w-6xl mx-auto px-6 mb-20 relative z-10">
        <h4 className="text-xs font-mono text-[#3F7D4A] uppercase tracking-widest text-center mb-1">Voices from Oruro & Potosí</h4>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#102033] text-center mb-10">
          Trusted by Altiplano Farming Unions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-[#EFE3C8]/30 border border-[#B85C38]/20 p-6 rounded-2xl flex flex-col justify-between hover:border-[#B85C38]/10 transition-all relative">
              <span className="absolute top-4 right-4 bg-[#F8F4EA] border border-[#B85C38]/10 px-2 py-0.5 rounded text-[9px] font-mono text-[#3F7D4A]">
                {t.tag}
              </span>
              <div>
                <p className="text-sm text-[#52616B] italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#B85C38]/20 flex justify-between items-end">
                <div>
                  <strong className="text-[#1F2933] block text-xs">{t.author}</strong>
                  <span className="text-[10px] text-[#52616B] block leading-tight mt-0.5">{t.role}</span>
                  <span className="text-[10px] text-[#3F7D4A] block leading-none font-mono mt-1">{t.location}</span>
                </div>
                <div className="text-right bg-[#F8F4EA] p-2 rounded-lg border border-[#B85C38]/20">
                  <div className="text-[8px] font-mono text-[#52616B] uppercase leading-none">VERIFIED RESULT</div>
                  <div className="text-xs font-bold text-[#1F2933] mt-1">{t.stat}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ collapsibles */}
      <section id="faqs-accordion" className="max-w-4xl mx-auto px-6 mb-12 relative z-10">
        <div className="text-center mb-8">
          <h4 className="text-xs font-mono text-[#3F7D4A] uppercase tracking-widest">Educational Resource Drawer</h4>
          <h3 className="text-2xl font-bold text-[#102033] mt-1">Understanding Soil Nuclear Agronomy</h3>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <div key={idx} className="border border-[#B85C38]/20 rounded-xl overflow-hidden bg-[#FFFFFF] shadow-sm">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-sm text-[#102033] hover:bg-[#EFE3C8]/50 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#3F7D4A] mr-1" />
                  {faq.question}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#52616B] transition-transform ${openFaqIndex === idx ? "rotate-180" : ""}`} />
              </button>
              
              {openFaqIndex === idx && (
                <div className="p-4 pt-1 bg-[#F8F4EA]/30 text-xs text-[#52616B] border-t border-[#B85C38]/20/50 leading-relaxed font-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Decorative Science Callout Bottom Banner */}
      <section id="footer-science" className="max-w-6xl mx-auto px-6 mt-16 bg-[#FFFFFF] shadow-sm border border-[#B85C38]/20 rounded-2xl p-8 md:p-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#102033]">
              Sustaining Indigenous Andean Soils
            </h2>
            <p className="mt-4 text-[#52616B] leading-relaxed text-sm">
              In high Andes terraces situated above 3,800 meters, thin soil and freezing winds demand extreme biological adaptations. Our custom models identify exact nitrogen trace absorption and stomatal stress periods. Perfect for securing stable food networks for deep Altiplano communities.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#3F7D4A]/10 flex items-center justify-center text-[#3F7D4A] mt-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2933]">100% Biologically Safe Tracing</h4>
                  <p className="text-xs text-[#52616B]">Naturally occurring atmospheric elements. Zero radioactivity, zero synthetic pollutants.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#3F7D4A]/10 flex items-center justify-center text-[#3F7D4A] mt-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2933]">Unforgeable Export Baselines</h4>
                  <p className="text-xs text-[#52616B]">Provides physical isotopic records of organic compliance, simplifying crop clearance into elite export markets.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate("isotope")}
              className="mt-8 px-6 py-3 rounded-lg bg-[#3B3A73] hover:bg-[#3B3A73]/80 border border-[#B85C38]/10 text-xs font-mono font-bold text-[#1F2933] transition-all flex items-center gap-2 cursor-pointer"
            >
              LEARN ATOM SCIENCE BASICS
              <ArrowRight className="w-4 h-4 text-[#3F7D4A]" />
            </button>
          </div>

          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#F8F4EA] border border-[#B85C38]/10 p-2 flex items-center justify-center">
            <img
              src={GALLERY_MOCK_IMAGES.neon_atom}
              alt="Neon atom stable isotope diagram of Nitrogen-15"
              className="w-full h-full object-cover rounded-lg filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 right-4 bg-[#EFE3C8]/90 border border-[#B85C38]/10 px-3 py-1 rounded text-[10px] font-mono text-[#52616B]">
              Isotope Model Diagram 15N
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
