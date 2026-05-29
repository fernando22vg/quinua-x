import React, { useState } from "react";
import { 
  Compass, Radio, Layers, Waves, Droplet, Eye, EyeOff, Activity, 
  Settings, Zap, AlertTriangle, AlertCircle, HelpCircle, MapPin
} from "lucide-react";
import { Sector, SatelliteLayer } from "../types";
import { SATELLITE_LAYERS, GALLERY_MOCK_IMAGES } from "../data";
import { Language, TRANSLATIONS, t } from "../translations";

interface SatelliteMapViewProps {
  sectors: Sector[];
  onSelectSector: (sectorId: number) => void;
  selectedSectorId: number;
  onDeployIrrigation: (sectorId: number) => void;
  onAdjustNutrition: (sectorId: number, adjustment: number) => void;
  language: Language;
}

export default function SatelliteMapView({
  sectors,
  onSelectSector,
  selectedSectorId,
  onDeployIrrigation,
  onAdjustNutrition,
  language
}: SatelliteMapViewProps) {
  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const tr = (key: string, fallback?: string) => t(language, key, fallback);
  
  // Opacity state of heatmap layer
  const [activeLayerId, setActiveLayerId] = useState<string>("isotope");
  const [layerOpacity, setLayerOpacity] = useState<number>(0.75);
  
  // Real AI diagnostic dispatch state
  const [aiReport, setAiReport] = useState<{
    verdict: string;
    analysis: string;
    recommendations: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Deploying moisture cycle trigger animation
  const [isIrrigating, setIsIrrigating] = useState<boolean>(false);
  const [irrigationSuccessMsg, setIrrigationSuccessMsg] = useState<string | null>(null);

  // GPS Geolocalization States
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [detectedGps, setDetectedGps] = useState<any | null>(null);

  const activeLayer = SATELLITE_LAYERS.find(l => l.id === activeLayerId) || SATELLITE_LAYERS[0];

  // Call server-side API to query Gemini for customized sector dispatch report!
  const handleQueryAIDispatch = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiReport(null);
    try {
      const res = await fetch("/api/analyze-sector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectorId: selectedSector.id,
          moisture: selectedSector.moisture,
          health: selectedSector.cropHealth,
          d15N: selectedSector.nitrogen15,
          d18O: selectedSector.oxygen18,
          d2H: selectedSector.deuterium,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with full-stack agronomical server.");
      }

      const data = await res.json();
      setAiReport(data);
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "An unexpected error occurred during AI analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // GPS Geolocalization locator system trigger
  const handleTriggerGpsDetection = () => {
    setGpsLoading(true);
    setDetectedGps(null);

    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setDetectedGps({
              lat: parseFloat(pos.coords.latitude.toFixed(4)),
              lng: parseFloat(pos.coords.longitude.toFixed(4)),
              alt: 3812,
              zone: "Lake Titicaca Littoral Basin (Node Q-V)",
              wueRec: "Lakeside humic concentration detected. Adjust volumetric soil moisture strictly to 32% minimum to safeguard roots against night gale frosts."
            });
            setGpsLoading(false);
          },
          () => {
            // High fidelity fallback coordinates to Bolivia Altiplano
            setDetectedGps({
              lat: -16.9024,
              lng: -68.1259,
              alt: 3850,
              zone: "Calmarka High-Mountain Steppe (Node Q-IV)",
              wueRec: "Arid mountain loam found. High trade wind evaporation risks. Immediate application of bio-slurry mulch recommended."
            });
            setGpsLoading(false);
          }
        );
      } else {
        setDetectedGps({
          lat: -16.9024,
          lng: -68.1259,
          alt: 3850,
          zone: "Calmarka High-Mountain Steppe (Node Q-IV)",
          wueRec: "Arid mountain loam found. High trade wind evaporation risks. Immediate application of bio-slurry mulch recommended."
        });
        setGpsLoading(false);
      }
    }, 1600);
  };

  // Sector Polygons definitions relative to Altiplano Map overlay
  const sectorPolygons = [
    { id: 1, points: "80,30 200,20 220,110 90,130", color: "#10b981", d: "M80,30 L200,20 L220,110 L90,130 Z" },
    { id: 2, points: "50,160 160,150 180,260 40,280", color: "#f59e0b", d: "M50,160 L160,150 L180,260 L40,280 Z" },
    { id: 3, points: "240,40 380,50 360,140 230,120", color: "#10b981", d: "M240,40 L380,50 L360,140 L230,120 Z" },
    { id: 4, points: "200,150 380,160 370,270 210,290", color: "#B13A2E", d: "M195,145 L380,160 L370,270 L210,290 Z" },
  ];

  const handleIrrigationTrigger = (sectId: number) => {
    setIsIrrigating(true);
    setIrrigationSuccessMsg(null);
    setTimeout(() => {
      onDeployIrrigation(sectId);
      setIsIrrigating(false);
      setIrrigationSuccessMsg("SUCCESS: High-frequency soil moisture drift deployed successfully! Moisture replenished.");
      setTimeout(() => setIrrigationSuccessMsg(null), 4000);
      
      if (aiReport) {
        setAiReport(prev => prev ? {
          ...prev,
          verdict: "OPTIMAL",
          analysis: "Moisture cycle completed. Subsurface sensors indicate normal volumetric profile and decreased delta Oxygen-18 transpiration pressure."
        } : null);
      }
    }, 1800);
  };

  return (
    <div className="flex-1 bg-[#102033] text-[#F8FAFC] overflow-y-auto min-h-screen pb-24 animate-fade-in">
      
      {/* Page Header */}
      <div className="p-6 border-b border-[#3B3A73]/50 bg-[#102033]/80 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>ALTI-TELEMETRY STATION GPS GRID 4</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mt-1">
            {tr('satellites', 'SATELLITES & MAPS')}
          </h2>
          <p className="text-xs text-[#EFE3C8]/80 font-mono mt-0.5 leading-relaxed">
            ESA Sentinel-2 Multispectral grid correlation • Bolivia Altiplano, Oruro & Titicaca Basins
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#17273D] border border-[#3B3A73]/80 text-[11px] font-mono text-[#EFE3C8] animate-slide-up" style={{ animationDelay: '50ms' }}>
          Nuclear Node: Q-VECT-GPS
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INTERACTIVE SATELLITE MAP CONTAINER : Left 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#17273D]/30 border border-[#3B3A73]/60 rounded-2xl p-4 overflow-hidden shadow-2xl relative animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-medium text-[#EFE3C8] flex items-center gap-1.5 transition-colors">
                <Compass className="w-4 h-4 text-[#D9A441]" />
                Live GPS Vector Polygon Overlay
              </span>
              <span className="text-[10px] bg-[#D9A441]/10 text-[#D9A441] font-mono border border-[#3F7D4A]/40 px-2 py-0.5 rounded transition-colors">
                Sentinel-2 Sync: High
              </span>
            </div>

            {/* Live Interactive Map Box */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#3B3A73]/50 bg-[#102033] select-none group">
              <img
                src={GALLERY_MOCK_IMAGES.satellite_fields}
                alt="Satellite Grid Mapping Bolivia Altiplano"
                className="absolute inset-0 w-full h-full object-cover grayscale-[15%] brightness-90 z-0 transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Dynamic SVG overlay with polygons maps */}
              <svg className="absolute inset-0 w-full h-full z-10 transition-transform duration-700 ease-out group-hover:scale-105" viewBox="0 0 420 315">
                <defs>
                  <linearGradient id="vectorHeatmap" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Draw polygons representing sectors */}
                {sectorPolygons.map((poly) => {
                  const isSectActive = poly.id === selectedSectorId;
                  const sector = sectors.find(s => s.id === poly.id);
                  const isCritical = sector?.cropStatus === "CRITICAL";
                  
                  return (
                    <g key={poly.id} className="cursor-pointer group" onClick={() => onSelectSector(poly.id)}>
                      {/* Highlighted polygon vector boundary */}
                      <polygon
                        points={poly.points}
                        fill={isSectActive ? (activeLayerId === "isotope" ? "rgba(168, 85, 247, 0.25)" : "rgba(16, 185, 129, 0.25)") : "transparent"}
                        stroke={isSectActive ? "#10b981" : (isCritical ? "#B13A2E" : "#4b5563")}
                        strokeWidth={isSectActive ? "2.5" : "1.5"}
                        strokeDasharray={isCritical ? "4,4" : "0"}
                        className="transition-all duration-300 group-hover:fill-emerald-400/10 group-hover:stroke-emerald-400"
                        style={{ fillOpacity: isSectActive ? layerOpacity : 0.1 }}
                      />

                      {/* Display sector marker number pin */}
                      <text
                        x={(parseInt(poly.points.split(" ")[0].split(",")[0]) + parseInt(poly.points.split(" ")[2].split(",")[0])) / 2 - 12}
                        y={(parseInt(poly.points.split(" ")[0].split(",")[1]) + parseInt(poly.points.split(" ")[2].split(",")[1])) / 2 + 4}
                        fill={isSectActive ? "#ffffff" : "#9ca3af"}
                        className="font-mono text-[10px] font-bold select-none text-shadow"
                      >
                        S-{poly.id}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Glowing active sector ring effect */}
              <div className="absolute top-4 right-4 bg-[#102033]/90 border border-[#3B3A73]/80 backdrop-blur-md p-3 rounded-xl z-20 max-w-xs font-mono text-[11px] space-y-1 shadow">
                <span className="font-bold text-[#F8FAFC]/90 uppercase block">Selected Sector Profile</span>
                <div className="flex items-center justify-between text-[#EFE3C8] gap-6">
                  <span>ID:</span>
                  <span className="font-bold text-white">Sector {selectedSector.id}</span>
                </div>
                <div className="flex items-center justify-between text-[#EFE3C8]">
                  <span>Status:</span>
                  <span className={`font-bold ${selectedSector.cropStatus === "CRITICAL" ? "text-[#B13A2E] animate-pulse" : selectedSector.cropStatus === "CAUTION" ? "text-yellow-400" : "text-[#D9A441]"}`}>
                    {selectedSector.cropStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* SATELLITE FILTER TOOLS LAYERS SECTION */}
            <div className="mt-5 pt-5 border-t border-[#3B3A73]/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[#EFE3C8]">
                  Copernicus Multi-Spectral Imagery Filter
                </span>
                <span className="text-[10px] text-[#EFE3C8]/80 font-mono">
                  Spectral Index: {activeLayer.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SATELLITE_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all
                      ${layer.id === activeLayerId
                        ? "bg-[#17273D] text-white border-[#D9A441]/70 shadow shadow-emerald-950/20"
                        : "bg-[#102033] border-[#3B3A73]/50 text-[#EFE3C8] hover:bg-[#17273D]/60"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold font-mono">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.colorHex }}></span>
                      <span>{layer.name.split(" ")[0]} layer</span>
                    </div>
                    <p className="text-[10.5px] text-[#EFE3C8]/80 leading-tight mt-1 truncate">
                      {layer.caption}
                    </p>
                  </button>
                ))}
              </div>

              {/* Dynamic Opacity Slider block */}
              <div className="mt-4 p-3 bg-[#102033] border border-[#3B3A73]/50/60 rounded-xl flex items-center justify-between gap-6">
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#EFE3C8] shrink-0">
                  <Layers className="w-3.5 h-3.5 text-[#EFE3C8]/80" />
                  <span>Overlay Opacity:</span>
                  <span className="font-bold text-[#D9A441]">{Math.round(layerOpacity * 100)}%</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={Math.round(layerOpacity * 100)}
                    onChange={(e) => setLayerOpacity((parseFloat(e.target.value) || 0) / 100)}
                    className="w-full bg-[#102033] border border-[#3B3A73]/80 rounded-lg px-3 py-1.5 text-[#D9A441] font-mono text-xs focus:outline-none focus:border-[#D9A441] transition-colors"
                  />
                  <span className="absolute right-3 top-2 text-[#EFE3C8]/80 text-[10px] font-mono select-none">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED SECTOR CONTROLS & AI DIAGNOSTIC REPORT : Right 5 cols */}
        <div className="lg:col-span-5 space-y-6">

          {/* GPS Detector module (Feature 2) */}
          <div className="bg-[#17273D]/40 border border-[#3B3A73]/60 p-5 rounded-2xl space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="font-bold text-xs font-mono text-[#2F80A8] uppercase tracking-widest flex items-center gap-2 pb-2.5 border-b border-[#3B3A73]/50 transition-colors">
              <MapPin className="w-4 h-4 text-[#2F80A8]" />
              {tr('gpsDetector', 'GPS LOCATOR')}
            </h3>

            <p className="text-[11.5px] text-[#EFE3C8] leading-relaxed transition-colors">
              Detect user location coordinates instantly under the Copernicus navigation mesh to sync your regional soils and water thresholds.
            </p>

            <button
              onClick={handleTriggerGpsDetection}
              disabled={gpsLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#102033] hover:bg-[#17273D] text-[#F8FAFC]/90 font-mono text-[11px] hover:border-[#2F80A8]/50 border border-[#3B3A73]/70 cursor-pointer flex items-center gap-2 justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] group"
            >
              {gpsLoading ? (
                <>
                  <Activity className="w-4 h-4 text-[#2F80A8] animate-spin" />
                  <span>DETERMINING MULTISPECTRAL POSITION...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-[#2F80A8] group-hover:animate-pulse" />
                  <span>{tr('detectLocation', 'USE MY GPS LOCATION')}</span>
                </>
              )}
            </button>

            {/* Simulated Live Radar Sweep when lookup is loaded */}
            {gpsLoading && (
              <div className="relative h-28 bg-[#102033] border border-[#3B3A73]/50 rounded-xl flex items-center justify-center overflow-hidden animate-fade-in shadow-inner">
                <div className="absolute w-20 h-20 rounded-full border border-[#2F80A8]/20 flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full border border-[#2F80A8]/40 flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2F80A8] animate-ping"></span>
                  </div>
                </div>
                {/* CSS animated sweep line */}
                <div className="absolute w-[120px] h-[1px] bg-gradient-to-r from-cyan-400 to-transparent transform origin-left rotate-45 animate-radar"></div>
                <span className="text-[8.5px] font-mono text-[#EFE3C8]/80 absolute bottom-1.5 right-2.5 tracking-widest animate-pulse">UPLINKING...</span>
              </div>
            )}

            {/* Detected coordinates card */}
            {detectedGps && (
              <div className="p-4 bg-[#102033] border border-[#3B3A73]/40 rounded-xl space-y-3 font-mono text-[11px] leading-normal animate-fade-in shadow-sm">
                <span className="text-[9px] text-[#EFE3C8]/80 block uppercase font-bold transition-colors">{tr('detectedRegion', 'SYSTEM MATCHED REGION')}</span>
                <strong className="text-[#F8FAFC] block text-xs">{detectedGps.zone}</strong>

                <div className="grid grid-cols-2 gap-3 bg-[#17273D]/30 p-2 border border-[#3B3A73]/50 rounded-lg text-center transition-colors">
                  <div>
                    <span className="text-[8px] text-[#EFE3C8]/80 uppercase block">LAT</span>
                    <strong className="text-[#2F80A8] font-bold tracking-wider">{detectedGps.lat}° S</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-[#EFE3C8]/80 uppercase block">LNG</span>
                    <strong className="text-[#2F80A8] font-bold tracking-wider">{detectedGps.lng}° W</strong>
                  </div>
                </div>

                <div className="text-[10.5px] text-[#EFE3C8] flex items-start gap-2.5 bg-[#17273D]/20 p-2 rounded-lg border border-[#3B3A73]/50/50">
                  <span className="text-[#2F80A8] font-bold font-mono">REC:</span>
                  <p className="leading-relaxed transition-colors">{detectedGps.wueRec}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#17273D]/35 border border-[#3B3A73]/50 p-5 rounded-2xl space-y-5 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div>
              <span className="text-[10px] font-mono text-[#D9A441] uppercase tracking-wider block font-bold transition-colors">
                Telemetry Dispatcher
              </span>
              <h3 className="font-bold text-lg text-white mt-1 transition-colors">
                {selectedSector.name}
              </h3>
              <p className="text-xs text-[#EFE3C8]/70 font-mono mt-0.5 transition-colors">
                Location: {selectedSector.location}
              </p>
            </div>

            {/* Quick specifications layout */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#102033] rounded-xl border border-[#3B3A73]/50 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-[#EFE3C8]/80">Elevation Status</span>
                <div className="font-bold text-[#F8FAFC]">{selectedSector.elevation} meters alt</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-[#EFE3C8]/80">Soil Geological Profile</span>
                <div className="font-bold text-[#F8FAFC] truncate">{selectedSector.soilType}</div>
              </div>
            </div>

            {/* Isotopic Metrics summary for the sector */}
            <div className="space-y-3.5">
              <div className="text-[10.5px] font-mono text-[#EFE3C8]/80 uppercase tracking-widest leading-none">
                Local Biochemical Identifiers
              </div>
              
              <div className="flex justify-between items-center bg-[#102033] p-2.5 rounded-lg border border-[#3B3A73]/50 text-xs font-mono">
                <span className="text-[#EFE3C8]/70">Nitrogen-15 FUE Ratio:</span>
                <span className="font-bold text-[#2F80A8]">{selectedSector.nitrogen15 >= 0 ? "+" : ""}{selectedSector.nitrogen15.toFixed(1)}‰</span>
              </div>
              <div className="flex justify-between items-center bg-[#102033] p-2.5 rounded-lg border border-[#3B3A73]/50 text-xs font-mono">
                <span className="text-[#EFE3C8]/70">Oxygen-18 Soil-Evap:</span>
                <span className="font-bold text-[#D9A441]">{selectedSector.oxygen18.toFixed(1)}‰</span>
              </div>
              <div className="flex justify-between items-center bg-[#102033] p-2.5 rounded-lg border border-[#3B3A73]/50 text-xs font-mono">
                <span className="text-[#EFE3C8]/70">Deuterium Water recharge:</span>
                <span className="font-bold text-[#8FAE7D]">{selectedSector.deuterium.toFixed(1)}‰</span>
              </div>
            </div>

            {/* Actionable button triggers */}
            <div className="pt-2.5 space-y-3">
              <div className="text-[10.5px] font-mono text-[#EFE3C8]/80 uppercase tracking-widest leading-none">
                Interactive Ground Commands
              </div>

              {selectedSector.cropStatus === "CRITICAL" ? (
                <button
                  onClick={() => handleIrrigationTrigger(selectedSector.id)}
                  disabled={isIrrigating}
                  className="w-full py-3 rounded-xl bg-[#8A4B2A] hover:bg-[#B13A2E] hover:scale-[1.01] transition-all text-[#102033] font-bold font-sans text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#B13A2E]/20"
                >
                  <Waves className={`w-4 h-4 ${isIrrigating ? "animate-bounce" : ""}`} />
                  {isIrrigating ? "DEPLOYING ACTIVE HIGH-PRESSURE DRIFT..." : "DEPLOY HIGH-FREQUENCY IRRIGATION DRIFT"}
                </button>
              ) : (
                <button
                  onClick={() => handleIrrigationTrigger(selectedSector.id)}
                  disabled={isIrrigating}
                  className="w-full py-3 rounded-xl bg-[#3B3A73] hover:bg-[#3B3A73]/80 hover:scale-[1.01] transition-all text-[#F8FAFC] font-bold font-mono border border-[#3B3A73]/70 text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Waves className={`w-4 h-4 ${isIrrigating ? "animate-bounce" : ""}`} />
                  {isIrrigating ? "TRIGGERING DRIFT LOOP..." : "DRIFT MANUAL WATER IRRIGATION"}
                </button>
              )}

              {/* Status reporting or feedback msg */}
              {irrigationSuccessMsg && (
                <div className="p-2.5 bg-[#D9A441]/10 border border-[#D9A441]/40 rounded-lg text-[11px] text-[#D9A441] font-mono leading-relaxed mt-2 animate-fadeIn">
                  {irrigationSuccessMsg}
                </div>
              )}
            </div>

            {/* LIVE GEMINI API COGNITIVE ANALYSIS DISPATCH */}
            <div className="mt-4 pt-4 border-t border-[#3B3A73]/50 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono text-[#EFE3C8] font-bold uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#2F80A8]" />
                  Gemini Mass Isotope Evaluation
                </h4>
                <button
                  onClick={handleQueryAIDispatch}
                  disabled={isAnalyzing}
                  className="px-3 py-1 rounded bg-[#3B3A73]/80 hover:bg-[#F8FAFC] border border-[#3B3A73]/90 hover:border-[#52616B] text-[10.5px] font-mono text-[#F8FAFC] cursor-pointer text-[9.5px]"
                >
                  {isAnalyzing ? "ASSESSING PROFILE..." : "RUN RADAR FORECAST"}
                </button>
              </div>

              {/* Display AI generation loading progress */}
              {isAnalyzing && (
                <div className="p-4 bg-[#102033] rounded-xl border border-[#3B3A73]/50 text-center space-y-2.5 font-mono">
                  <Activity className="w-5 h-5 text-[#2F80A8] animate-spin mx-auto" />
                  <p className="text-[11px] text-[#EFE3C8] blinking">
                    Decrypting nuclear 15N soil profiles & d18C water evaporation parameters via Gemini AI...
                  </p>
                </div>
              )}

              {/* Display AI error if fails */}
              {analysisError && (
                <div className="p-3 bg-[#B13A2E]/10 border border-[#B13A2E]/50 rounded-lg text-xs font-mono text-[#B13A2E]">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  {analysisError}
                </div>
              )}

              {/* Display visual AI Report dispatch if succeeds! */}
              {aiReport && (
                <div className="p-4 bg-[#102033] border border-[#3B3A73]/50 rounded-xl space-y-3 font-mono text-[11px] animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#3B3A73]/50 pb-2">
                    <span className="text-[10px] text-[#EFE3C8]/80 uppercase font-bold">ANALYSIS STATUS:</span>
                    <span className={`font-black text-xs px-2 py-0.5 rounded
                      ${aiReport.verdict === "CRITICAL" ? "bg-[#B13A2E]/10 text-[#B13A2E] border border-[#B13A2E]/30" :
                        aiReport.verdict === "CAUTION" ? "bg-yellow-950 text-yellow-500 border border-yellow-905" :
                        "bg-[#D9A441]/10 text-[#3F7D4A] border border-[#D9A441]/30"
                      }
                    `}>
                      {aiReport.verdict}
                    </span>
                  </div>

                  <div className="text-[#EFE3C8] leading-relaxed">
                    <p className="font-semibold text-[#F8FAFC]">Isotopic Assessment:</p>
                    <p className="mt-1 text-[#EFE3C8]">{aiReport.analysis}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-semibold text-[#F8FAFC]">Recommended Agronomy Interventions:</p>
                    <ul className="list-disc list-inside space-y-1 text-[#EFE3C8] pl-1">
                      {aiReport.recommendations.map((rec, i) => (
                        <li key={i} className="leading-tight">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-radar {
          animation: radar-sweep 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
