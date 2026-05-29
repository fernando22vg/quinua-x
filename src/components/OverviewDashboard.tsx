import React, { useState, useEffect } from "react";
import { 
  Activity, Award, BarChart3, Bell, CheckCircle2, Droplet, 
  Flame, HelpCircle, RefreshCw, ShieldAlert, Smartphone, Waves, Zap, MapPin, Radio
} from "lucide-react";
import { Sector, Isotope } from "../types";
import { ISOTOPES } from "../data";
import { Language, TRANSLATIONS, t } from "../translations";

interface OverviewDashboardProps {
  sectors: Sector[];
  onSelectSector: (sectorId: number) => void;
  selectedSectorId: number;
  onDeployIrrigation: (sectorId: number) => void;
  activeAlerts: string[];
  language: Language;
}

export default function OverviewDashboard({
  sectors,
  onSelectSector,
  selectedSectorId,
  onDeployIrrigation,
  activeAlerts,
  language
}: OverviewDashboardProps) {
  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const tr = (key: string, fallback?: string) => t(language, key, fallback);
  
  // Isotope sensor calibration state
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(100);
  const [calibrationStatus, setCalibrationStatus] = useState("SENSORS READY");
  
  // Real-time ticking global metrics counter (accumulated over time)
  const [waterSaved, setWaterSaved] = useState(452192800);
  const [fertilizerReduced, setFertilizerReduced] = useState(68.4);

  // Time ticker
  const [tickerTime, setTickerTime] = useState("");

  useEffect(() => {
    // Sync time format
    const updateTime = () => {
      const now = new Date();
      setTickerTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 5000);
    return () => clearInterval(interval);
  }, []);

  // Soft ticking up of water savings to emulate real telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      setWaterSaved(prev => prev + Math.floor(Math.random() * 15) + 3);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Trigger calibration animation
  const handleRecalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibrationProgress(0);
    setCalibrationStatus("CLEANING MASS SPECTROMETERS...");
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCalibrationProgress(progress);
      
      if (progress === 30) {
        setCalibrationStatus("FLUSHING DEUTERIUM VACUUM CORE...");
      } else if (progress === 60) {
        setCalibrationStatus("CORRELATING SECTOR TRACE 15N APERTURES...");
      } else if (progress === 85) {
        setCalibrationStatus("STABILIZING LASER SPECTRA BEAMS...");
      } else if (progress >= 100) {
        clearInterval(interval);
        setIsCalibrating(false);
        setCalibrationStatus("SENSORS READY - CALIBRATED IN STEP!");
        setTimeout(() => setCalibrationStatus("SENSORS READY"), 3000);
      }
    }, 150);
  };

  // Mock Trend Chart Coordinates Data based on sector
  const getTrendDataPoints = (sectId: number) => {
    // Sector 4 is dropping, then recovers if moisture > 25% (irrigated)
    const isIrrigated = sectors.find(s => s.id === 4)?.moisture! > 22;
    
    if (sectId === 4) {
      return isIrrigated 
        ? [38, 30, 24, 18, 25, 31, 35] // Recovers
        : [38, 32, 26, 21, 18, 17, 16]; // Falls
    } else if (sectId === 1) {
      return [42, 41, 40, 39, 38, 38, 39];
    } else if (sectId === 2) {
      return [25, 24, 23, 22, 21, 21, 22];
    } else {
      return [35, 34, 33, 31, 32, 32, 33];
    }
  };

  const trendPoints = getTrendDataPoints(selectedSectorId);
  const maxVal = 50;
  
  // Build beautiful SVG path based on selected points
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 20;

  const pointsFormatted = trendPoints.map((point, index) => {
    const x = paddingX + (index * ((chartWidth - paddingX * 2) / (trendPoints.length - 1)));
    const y = chartHeight - paddingY - (point / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, val: point };
  });

  const svgPathD = pointsFormatted.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const svgAreaD = `${svgPathD} L ${pointsFormatted[pointsFormatted.length - 1].x} ${chartHeight - paddingY} L ${pointsFormatted[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 overflow-y-auto min-h-screen">
      {/* Header bar */}
      <div className="p-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md mt-16 md:mt-0 sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>BOLIVIAN NEON SITE COGNITIVE TERMINAL</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mt-1">
            {tr('telemetry', 'Telemetry Overview')}
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 leading-relaxed">
            Real-time isotopic analysis of anomalies and predictive biome model status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-2 cursor-pointer transition-colors shadow shadow-emerald-900/20"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{tr('exportReport', 'EXPORT PDF REPORT')}</span>
          </button>
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{tickerTime || "UTC SERVER TIMER..."}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-zinc-300">SYSTEM NOMINAL</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* LEFT 3 COLS: Dashboard widgets */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Sector Selector Rail */}
          <div className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl">
            <div className="text-[11px] font-mono text-zinc-500 tracking-wider uppercase mb-3 px-1 flex justify-between">
              <span>Select Active Altiplano Field Sector</span>
              <span className="text-zinc-500">{sectors.length} sectors mapped</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sectors.map((s) => {
                const isCurrent = s.id === selectedSectorId;
                const statusColor = s.cropStatus === "CRITICAL" 
                  ? "border-red-900/60 hover:border-red-800/80 bg-red-950/5 text-red-400" 
                  : s.cropStatus === "CAUTION"
                    ? "border-yellow-900/60 hover:border-yellow-800/80 bg-yellow-950/5 text-yellow-300"
                    : "border-zinc-850 hover:border-zinc-800 bg-zinc-900/20 text-zinc-300";
                    
                return (
                  <button
                    key={s.id}
                    onClick={() => onSelectSector(s.id)}
                    className={`p-3 p-y-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${statusColor} 
                      ${isCurrent ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950 border-emerald-500" : ""}
                    `}
                  >
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-between">
                      <span>SECTOR {s.id}</span>
                      {s.cropStatus === "CRITICAL" && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                      )}
                    </div>
                    <div className="font-bold text-xs truncate mt-1 text-zinc-200">{s.name.split(":")[1] || s.name}</div>
                    <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-400">Moisture:</span>
                      <span className="font-bold">{s.moisture}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid for graphs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* WIDGET 1: Soil Moisture Trends (SVG graph) */}
            <div className="bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-emerald-400" />
                      Soil Moisture Trends
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Subsurface volumetric index: {selectedSector.name}
                    </p>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-zinc-850 border border-zinc-800 font-mono text-[10px] text-zinc-400">
                    Target: 35%
                  </div>
                </div>

                <div className="mt-6 relative">
                  {/* Graph plot display */}
                  <div className="h-44 w-full flex items-center justify-center p-1 bg-zinc-950/40 border border-zinc-900/60 rounded-xl relative">
                    <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#374151" strokeWidth="1" />

                      {/* Area Fill */}
                      <path d={svgAreaD} fill="url(#moistureGradient)" />

                      {/* Line Path */}
                      <path d={svgPathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Data dots */}
                      {pointsFormatted.map((pt, i) => (
                        <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
                      ))}

                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Left vertical Y axis tags */}
                    <div className="absolute left-1 top-4 bottom-2 justify-between flex flex-col text-[8.5px] font-mono text-zinc-650 pointer-events-none select-none">
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>

                    {/* High-contrast live value badge on current peak */}
                    <div className="absolute top-2 right-4 bg-zinc-900/90 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 flex items-center gap-1.5 shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>Latest: {selectedSector.moisture}%</span>
                    </div>
                  </div>

                  {/* Horizontal Axis Months */}
                  <div className="mt-2.5 flex justify-between px-10 text-[10px] font-mono text-zinc-500">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul (Live)</span>
                  </div>
                </div>
              </div>

              {/* Action and warning details */}
              <div className="mt-4 pt-4 border-t border-zinc-900/60 flex items-center justify-between text-[11.5px] font-mono text-zinc-400 leading-none">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  Telemetry update: 6m ago
                </span>
                <span className="text-zinc-500">Volumetric Sensor: OK</span>
              </div>
            </div>

            {/* WIDGET 2: Crop Biological Health circular gauge */}
            <div className="bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      Crop Health Bio-Metrics
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      Fluorescence Photosynthetic Efficiency
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold tracking-tight
                    ${selectedSector.cropStatus === "CRITICAL" ? "bg-red-950/60 border border-red-800 text-red-400" :
                      selectedSector.cropStatus === "CAUTION" ? "bg-yellow-950/60 border border-yellow-800 text-yellow-400" :
                      "bg-emerald-950/60 border border-emerald-800 text-emerald-400"
                    }
                  `}>
                    {selectedSector.cropStatus}
                  </span>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
                  {/* Gauge indicator drawn beautifully in SVG */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Track */}
                      <circle cx="72" cy="72" r="54" stroke="#18181b" strokeWidth="11" fill="transparent" />
                      {/* Progress */}
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="54" 
                        stroke={selectedSector.cropStatus === "CRITICAL" ? "#ef4444" : selectedSector.cropStatus === "CAUTION" ? "#f59e0b" : "#10b981"} 
                        strokeWidth="11" 
                        fill="transparent" 
                        strokeDasharray={339.29}
                        strokeDashoffset={339.29 - (339.29 * selectedSector.cropHealth) / 100}
                        strokeLinecap="round" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-extrabold text-white tracking-tighter leading-none">
                        {selectedSector.cropHealth}%
                      </span>
                      <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                        Chlorophyll
                      </span>
                    </div>
                  </div>

                  {/* Biological readouts list */}
                  <div className="flex-1 space-y-2 w-full text-xs font-mono">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">Photosynthetic yield (Fv/Fm):</span>
                      <span className="font-bold text-zinc-300">{(selectedSector.cropHealth * 0.0105).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">Stomatal Opening (Gs):</span>
                      <span className="font-bold text-zinc-300">{(selectedSector.cropHealth * 2.3).toFixed(0)} mmol/m²s</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
                      <span className="text-zinc-500">Nitrogen Index (N-FUE):</span>
                      <span className="font-bold text-zinc-300">{(selectedSector.cropHealth * 0.0095).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-[10.5px]">Carbon Discrimination:</span>
                      <span className="font-bold text-zinc-300">-24.2‰</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-[10px] text-zinc-500 font-mono bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900/60 leading-relaxed">
                {selectedSector.cropStatus === "CRITICAL" 
                  ? "⚠️ Warning: Extreme stomatal closure active under stress conditions. Immediate drip line water drift replenishment highly recommended to protect chlorophyll bounds."
                  : "✓ Stable bio-photosynthesis cycle detected. Chlorophyll bounds indicate strong moisture retention structure."
                }
              </div>
            </div>

          </div>

          {/* LOWER ROWS: Isotope Tracers & Nuclear Agrotechnology widget */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ISOTOPE SPECTROMETRICS */}
            <div className="lg:col-span-2 bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-900">
                <div>
                  <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Nuclear Mass Spectrometry Tracers
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Analyzing active heavy non-radioactive isotope signatures.
                  </p>
                </div>
                
                {/* Custom Calibration Button */}
                <button
                  onClick={handleRecalibrate}
                  disabled={isCalibrating}
                  className={`px-3.5 py-1.5 rounded-xl border font-mono text-[10px] transition-all flex items-center gap-2 cursor-pointer
                    ${isCalibrating 
                      ? "bg-emerald-950/30 border-emerald-800 text-emerald-400" 
                      : "bg-zinc-850 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                    }
                  `}
                >
                  <RefreshCw className={`w-3 h-3 ${isCalibrating ? "animate-spin" : ""}`} />
                  {isCalibrating ? "CALIBRATING..." : "RECALIBRATE SENSORS"}
                </button>
              </div>

              {/* Progress Line for calibration visual feedback */}
              {isCalibrating && (
                <div className="mb-4 bg-zinc-950 p-2 rounded-lg border border-zinc-900 font-mono text-[10px]">
                  <div className="flex justify-between text-zinc-400 mb-1 leading-none text-[9.5px]">
                    <span>STATUS: {calibrationStatus}</span>
                    <span>{calibrationProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-150" style={{ width: `${calibrationProgress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Mass Isotopes Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Nitrogen-15 */}
                <div className="bg-zinc-950/80 border border-zinc-900 p-3.5 rounded-xl relative overflow-hidden">
                  <div className="absolute top-1 right-1 font-mono text-[14px] text-emerald-500/10 font-bold">15N</div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Fertilizer Efficiency</span>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
                    {selectedSector.nitrogen15 >= 0 ? "+" : ""}{selectedSector.nitrogen15.toFixed(1)}‰
                  </div>
                  <p className="text-[10.5px] text-zinc-500 font-mono mt-2 leading-tight">
                    Delta ratio d15N. Monitors Royal Quinoa root capture speed vs waste drift.
                  </p>
                </div>

                {/* Oxygen-18 */}
                <div className="bg-zinc-950/80 border border-zinc-900 p-3.5 rounded-xl relative overflow-hidden">
                  <div className="absolute top-1 right-1 font-mono text-[14px] text-emerald-500/10 font-bold">18O</div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Liquid Evaporation</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    {selectedSector.oxygen18.toFixed(1)}‰
                  </div>
                  <p className="text-[10.5px] text-zinc-500 font-mono mt-2 leading-tight">
                    Delta d18O vapor trace. Highlights surface evaporation leaks on dry soils.
                  </p>
                </div>

                {/* Deuterium */}
                <div className="bg-zinc-950/80 border border-zinc-900 p-3.5 rounded-xl relative overflow-hidden">
                  <div className="absolute top-1 right-1 font-mono text-[14px] text-emerald-500/10 font-bold">2H</div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Aquifer Source</span>
                  <div className="text-xl font-bold font-mono text-purple-400 mt-1">
                    {selectedSector.deuterium.toFixed(1)}‰
                  </div>
                  <p className="text-[10.5px] text-zinc-500 font-mono mt-2 leading-tight">
                    Delta d2H groundwater proxy. Categorizes deep structural aquifer draw.
                  </p>
                </div>

              </div>
            </div>

            {/* AI ALERTS FEED */}
            <div className="bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm text-zinc-300 flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  Live AI Alerts
                </h3>
                
                <div className="space-y-3">
                  {/* Urgent Alert if sector 4 has low moisture */}
                  {sectors.find(s => s.id === 4)?.moisture! <= 22 ? (
                    <div className="p-3 bg-red-950/40 border border-red-900/80 rounded-xl relative group">
                      <div className="flex items-start gap-2.5">
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <span className="block text-[11px] font-mono text-red-400 font-extrabold uppercase leading-none mb-1">
                            CRITICAL DRIFT NOTICE
                          </span>
                          <p className="text-[11.5px] text-zinc-300 leading-tight">
                            IRRIGATION NEEDED IN SECTOR 4
                          </p>
                          <span className="block text-[9.5px] font-mono text-zinc-500 mt-1.5">
                            Reported 18m ago • Hydro-stress index high
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-zinc-950/60 border border-emerald-900/40 rounded-xl">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="block text-[10px] font-mono text-emerald-400 font-bold uppercase leading-none mb-1">
                            SECTOR 4 AMENDED
                          </span>
                          <p className="text-xs text-zinc-400 leading-tight">
                            Drip line irrigation cycle active. Moisture replenishing successfully.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard alert */}
                  <div className="p-3 bg-yellow-950/20 border border-yellow-900/40 rounded-xl">
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-mono text-yellow-500 font-bold uppercase leading-none mb-1">
                          SALINITY ADVISORY
                        </span>
                        <p className="text-xs text-zinc-400 leading-tight">
                          Salt crust expansion in Sector 2. Monitoring Lithium trace values.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 leading-tight bg-zinc-950/40 p-2.5 border border-zinc-900/40 rounded-xl mt-4">
                Total anomaly rate: {sectors.filter(s => s.cropStatus !== "OPTIMAL").length} active warnings. Use the "Satellites & Fields" module to deploy high-frequency irrigator drills of sectors.
              </div>
            </div>

          </div>
        {/* RIGHT COL: Global Impact Metrics & Phone Interface */}
        <div className="space-y-6">
          
          {/* Global Impact Metrics overview */}
          <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-900 p-5 rounded-2xl">
            <h3 className="font-semibold text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span>{language === "es" ? "Sello de Impacto Ecológico" : language === "ay" ? "Suma Pacha Uñjaña" : language === "ru" ? "Влияние на экологию" : "Ecological Impact Matrix"}</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </h3>

            <div className="space-y-5">
              
              {/* Metric 1 */}
              <div>
                <dt className="text-[11px] font-mono text-zinc-500 block">{tr('waterSaved', 'Water Resource Preserved')}</dt>
                <dd className="text-2xl font-black font-mono text-emerald-400 tracking-tight mt-1-">
                  +{waterSaved.toLocaleString()} L
                </dd>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5 leading-none">
                  {language === "es" ? "Algoritmo de goteo de alta frecuencia" : language === "ay" ? "Suma goteo" : language === "ru" ? "Алгоритм оптимизации полива" : "Incremental drip optimization algorithm."}
                </p>
              </div>

              {/* Metric 2 */}
              <div className="pt-4 border-t border-zinc-900">
                <dt className="text-[11px] font-mono text-zinc-500 block">{tr('fertilizerSaved', 'Synthetic N-Fertilizer Reduced')}</dt>
                <dd className="text-2xl font-black font-mono text-cyan-400 tracking-tight mt-1-">
                  {fertilizerReduced.toFixed(1)}%
                </dd>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5 leading-none">
                  {language === "es" ? "Reducción auditada mediante trazadores delta 15N" : language === "ay" ? "Suma abono uñjaña" : language === "ru" ? "Снижение проверено трейсерами 15N" : "Enabled by 15N fertilizer absorption vectors."}
                </p>
              </div>

              {/* Metric 3 */}
              <div className="pt-4 border-t border-zinc-900">
                <dt className="text-[11px] font-mono text-zinc-500 block">{language === "es" ? "Mejora del Rendimiento de Quinua" : language === "ay" ? "Yapu Suma" : language === "ru" ? "Урожай Киноа" : "Royal Quinoa Yield Margin"}</dt>
                <dd className="text-2xl font-black font-mono text-white tracking-tight mt-1-">
                  +38.5%
                </dd>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5 leading-none">
                  {language === "es" ? "Eficiencia transpirativa celular optimizada" : language === "ay" ? "Suma yapu" : language === "ru" ? "Оптимизация клеточной транспирации" : "Agronomical return-on-investment coefficient."}
                </p>
              </div>

            </div>
          </div>
        </div>
          
        {/* SENAMHI Weather Intelligence Widget */}
          <div className="bg-gradient-to-b from-zinc-900/60 to-zinc-950 border border-zinc-900 p-5 rounded-2xl mt-6">
            <h3 className="font-semibold text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4 flex w-full items-center justify-between border-b border-zinc-900 pb-2">
              <span className="flex items-center gap-1.5"><Waves className="w-4 h-4 text-cyan-400" /> SENAMHI Weather</span>
              <span className="text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">DEMO DATA</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-lg text-center">
                  <span className="block text-[9px] font-mono text-zinc-500 mb-1 leading-none uppercase">Temperature</span>
                  <span className="text-xl font-bold font-mono text-amber-500 leading-none">24°C</span>
                  <p className="text-[8px] font-mono text-amber-500/80 mt-1 uppercase">Heat Warning</p>
                </div>
                <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-lg text-center">
                  <span className="block text-[9px] font-mono text-zinc-500 mb-1 leading-none uppercase">Humidity</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 leading-none">18%</span>
                  <p className="text-[8px] font-mono text-cyan-500/80 mt-1 uppercase">Extremely Dry</p>
                </div>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-850 p-2.5 rounded-lg flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase">Wind Velocity</span>
                  <span className="text-sm font-bold font-mono text-zinc-300">42 km/h (NW)</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase">Evaporation Risk</span>
                  <span className="text-sm font-bold text-red-400">HIGH</span>
                </div>
              </div>

              <div className="text-[9.5px] font-mono text-zinc-400 leading-relaxed bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                Source: Servicio Nacional de Meteorología e Hidrología (SENAMHI). Drought-alert active for Altiplano. Delay synthetic nutrient application.
              </div>
            </div>
          </div>

          {/* Smartphone Simulator Mockup */}
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-3xl p-4 overflow-hidden relative">
            <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-zinc-900 font-mono text-xs text-zinc-400">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Mobile Terminal Uplink</span>
            </div>

            {/* Smart chassis structure representing mockup screen 1 */}
            <div className="rounded-2xl border border-zinc-850 bg-[#09090b] p-3 shadow-xl aspect-[9/16] relative flex flex-col justify-between">
              
              {/* Dynamic camera notch details */}
              <div className="absolute top-2 left-1/4 right-1/4 h-4 rounded-full bg-zinc-950/90 border border-zinc-850 flex items-center justify-center pointer-events-none z-30">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              </div>

              <div className="flex-1 flex flex-col justify-between pt-6">
                
                {/* Simulated Notification Area */}
                <div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 mb-4 px-1">
                    <span>AESA MOBILE</span>
                    <span>10:42 AM</span>
                  </div>

                  <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 mb-3 text-[11px]">
                    <span className="font-mono text-[9px] text-emerald-400 block uppercase font-bold">Climate-Tech UI</span>
                    <h5 className="font-bold text-zinc-200 mt-1">QUINOA-X PORTAL</h5>
                    <p className="text-zinc-450 leading-tight mt-1">
                      Connecting isotopic soil trace sensors directly to your pocket.
                    </p>
                  </div>

                  {/* AI ALERT IN THE MOBILE SCREEN */}
                  <div className="space-y-2">
                    <div className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase px-1">AI ALERTS</div>
                    
                    {sectors.find(s => s.id === 4)?.moisture! <= 22 ? (
                      <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-2.5 text-[11px] animate-pulse">
                        <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-[9.5px]">
                          <Flame className="w-3 h-3" />
                          <span>ANOMALY WARNING</span>
                        </div>
                        <p className="text-zinc-200 mt-1 font-bold">
                          IRRIGATION NEEDED IN SECTOR 4
                        </p>
                        
                        {/* Interactive Irrigate button in simulated mobile */}
                        <button
                          onClick={() => {
                            onDeployIrrigation(4);
                            onSelectSector(4);
                          }}
                          className="mt-2.5 w-full py-1.5 rounded bg-red-600 hover:bg-red-500 active:scale-95 transition-all text-zinc-950 font-bold text-[9.5px] font-mono flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Waves className="w-3 h-3" />
                          GENERATE ACTIVE DRIFT
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-2.5 text-[11px] text-center">
                        <span className="text-emerald-400 font-bold font-mono text-[9.5px] block">✓ SECTOR 4 RESTORED</span>
                        <p className="text-zinc-400 text-[10px] mt-1 leading-tight">
                          Moisture is currently {sectors.find(s => s.id === 4)?.moisture}% (Optimal range).
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated visual graph thumbnail of moisture inside smartphone */}
                <div className="bg-zinc-900/60 p-2 rounded-xl border border-zinc-850 mb-3">
                  <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mb-1">
                    <span>LIVE HYDROGRAPH</span>
                    <span className="text-emerald-400">{sectors.find(s => s.id === 4)?.moisture}% moisture</span>
                  </div>
                  <div className="h-10 flex items-end gap-1.5 justify-between px-1">
                    {[22, 28, 32, 24, 18, 16, 25, 34].map((h, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2.5 rounded-t-sm transition-all duration-300
                          ${idx === 5 ? "bg-red-500" : "bg-emerald-500"}
                        `} 
                        style={{ height: `${h * 2}%` }}
                      ></div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom simulated navigation bar */}
              <div className="w-full flex justify-around items-center pt-2.5 border-t border-zinc-900 text-[10px] font-mono text-zinc-500">
                <span className="text-emerald-400">Telemetry</span>
                <span>Map</span>
                <span>AI Terminal</span>
              </div>

            </div>
            
            <p className="text-[11px] font-mono text-zinc-500 text-center leading-relaxed mt-3">
              *Interactive frame. Use the buttons inside the phone module to deploy immediate water cycles.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
