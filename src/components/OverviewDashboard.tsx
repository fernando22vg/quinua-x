import React, { useState, useEffect } from "react";
import { 
  Activity, Award, BarChart3, Bell, CheckCircle2, Droplet, 
  Flame, HelpCircle, RefreshCw, ShieldAlert, Waves, Zap, MapPin, Radio,
  FlaskConical, Sprout, CloudRain
} from "lucide-react";
import { Sector } from "../types";
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
  
  const handleRecalibrate = () => {
    if (isCalibrating) return;
    setIsCalibrating(true);
    setCalibrationProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setCalibrationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsCalibrating(false);
      }
    }, 100);
  };

  return (
    <div className="flex-1 bg-[#102033] text-[#F8FAFC] overflow-y-auto pb-24 font-sans animate-fade-in">
      
      {/* Header bar */}
      <div className="p-6 border-b border-[#17273D] bg-[#102033]/80 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-mono text-[#2F80A8] font-bold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>BOLIVIAN NEON SITE COGNITIVE TERMINAL</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            {tr('telemetry', 'Telemetry Dashboard')}
          </h2>
          <p className="text-xs text-[#CBD5E1] font-mono mt-0.5 max-w-2xl">
            Real-time isotopic analysis of anomalies and predictive biome model status.
          </p>
        </div>

        <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-[#17273D] border border-[#3B3A73] text-[10px] font-mono text-[#3F7D4A] font-bold hover:border-[#3F7D4A] transition-colors cursor-pointer">
            EXPORT PDF REPORT
          </button>
          <div className="px-3 py-1.5 rounded-lg bg-[#17273D] border border-[#3B3A73] text-[10px] font-mono text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3F7D4A] animate-ping"></span>
            SYSTEM NOMINAL
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pt-6">
         
         {/* Sector Selector */}
         <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar animate-slide-up" style={{ animationDelay: '100ms' }}>
            {sectors.map(s => (
               <button 
                 key={s.id} 
                 onClick={() => onSelectSector(s.id)}
                 className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${s.id === selectedSectorId ? 'bg-[#3F7D4A]/10 border-[#3F7D4A] text-white' : 'bg-[#17273D] border-[#3B3A73] text-[#52616B] hover:border-[#1E293B]'}`}
               >
                  <MapPin className={`w-4 h-4 ${s.id === selectedSectorId ? 'text-[#3F7D4A]' : 'text-[#64748B]'}`} />
                  <div className="text-left">
                     <span className="block text-[10px] font-bold font-mono leading-none tracking-widest transition-colors">{s.name.split(':')[0]}</span>
                     <span className="block text-xs font-bold mt-0.5 transition-colors">{s.name.split(':')[1]?.trim() || 'Sector'}</span>
                  </div>
               </button>
            ))}
         </div>

         {/* Bento Grid layout */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-2">
            
            <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
                <DashboardCard title="Current Field Status" icon={<Zap className="w-5 h-5 text-[#2F80A8]" />} badge={selectedSector.cropStatus} badgeColor={selectedSector.cropStatus === "CRITICAL" ? "bg-[#B13A2E]" : selectedSector.cropStatus === "CAUTION" ? "bg-[#D99A2B]" : "bg-[#3F7D4A]"} badgeTextColor="text-[#102033]">
                   <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-5xl font-black font-mono tracking-tighter mb-2 transition-all">
                         {selectedSector.cropHealth}%
                      </div>
                      <h4 className="font-bold text-[#F8FAFC]">Photosynthetic Efficiency</h4>
                      <p className="text-sm text-[#52616B] text-center mt-2 leading-relaxed max-w-xs transition-opacity">
                         {selectedSector.cropStatus === "CRITICAL" ? "Extreme stomatal closure active under stress conditions. Immediate intervention required." : "Stable bio-photosynthesis cycle detected. Chlorophyll bounds indicate strong structure."}
                      </p>
                   </div>
                   <button className="mt-auto w-full py-2.5 rounded-xl border border-[#3B3A73] bg-[#17273D] text-[#2F80A8] font-bold text-sm hover:border-[#2F80A8]/50 transition-colors cursor-pointer">
                      View Detailed Biomarkers
                   </button>
                </DashboardCard>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                <DashboardCard title="Water & Soil" icon={<DropIcon />} badge="ISOTOPES" badgeColor="bg-[#3B3A73]" badgeTextColor="text-[#64748B]">
                   <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#17273D] border border-[#3B3A73]">
                         <div>
                            <span className="text-[10px] font-mono font-bold text-[#64748B] block uppercase">Moisture Level</span>
                            <strong className="text-xl font-mono text-[#F8FAFC] transition-all">{selectedSector.moisture}%</strong>
                         </div>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${selectedSector.moisture < 25 ? 'bg-[#B13A2E]/20 text-[#B13A2E]' : 'bg-[#3F7D4A]/20 text-[#D9A441]'}`}>
                            {selectedSector.moisture < 25 ? 'DEFICIT' : 'OPTIMAL'}
                         </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#17273D] border border-[#3B3A73]">
                         <div>
                            <span className="text-[10px] font-mono font-bold text-[#64748B] block uppercase">Oxygen-18 (δ18O) Evaporation</span>
                            <strong className="text-xl font-mono text-[#2F80A8] transition-all">{selectedSector.oxygen18.toFixed(1)}‰</strong>
                         </div>
                         <Activity className="w-5 h-5 text-[#2F80A8] opacity-50" />
                      </div>
                      <p className="text-sm text-[#52616B] leading-relaxed transition-opacity">
                         {selectedSector.moisture < 25 ? 'High evaporation detected via δ18O tracing. Initiate drip irrigation to prevent crop failure.' : 'Low evaporation losses over the last 24 hours. Moisture retention is optimal.'}
                      </p>
                   </div>
                   <button onClick={() => selectedSector.moisture < 25 && onDeployIrrigation(selectedSector.id)} className={`mt-auto w-full py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${selectedSector.moisture < 25 ? 'bg-[#2F80A8] text-[#102033] hover:bg-[#2F80A8]' : 'bg-[#17273D] text-[#CBD5E1] border border-[#3B3A73]'}`}>
                      {selectedSector.moisture < 25 ? 'Deploy Drip Irrigation' : 'Irrigation Stable'}
                   </button>
                </DashboardCard>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '250ms' }}>
                <DashboardCard title="Fertilizer Risk" icon={<Sprout className="w-5 h-5 text-[#D99A2B]" />} badge="N-15 TRACER" badgeColor="bg-[#3B3A73]" badgeTextColor="text-[#64748B]">
                   <div className="space-y-4 pt-2 flex flex-col h-full">
                      <div className="flex justify-between items-end p-4 rounded-xl bg-gradient-to-r from-[#17273D] to-[#102033] border border-[#3B3A73]">
                         <div>
                            <span className="text-[10px] font-mono font-bold text-[#D99A2B] block uppercase mb-1">Nitrogen-15 Absorption</span>
                            <strong className="text-3xl font-mono text-[#D99A2B] transition-all">{selectedSector.nitrogen15 >= 0 ? "+" : ""}{selectedSector.nitrogen15.toFixed(1)}‰</strong>
                         </div>
                      </div>
                      <p className="text-sm text-[#52616B] leading-relaxed">
                         Delta ratio δ15N tracks Nitrogen Use Efficiency (NUE). Values above +1.0‰ indicate poor absorption, meaning synthetic fertilizer is washing away as runoff.
                      </p>
                      
                      <div className="mt-auto items-center justify-between p-3 rounded-xl bg-[#D99A2B]/10 border border-[#D99A2B]/30 flex hidden">
                         {/* Used to pad space if needed */}
                      </div>
                      
                      <button className="mt-auto w-full py-2.5 rounded-xl border border-[#D99A2B]/30 text-[#D99A2B] bg-[#D99A2B]/10 font-bold text-sm hover:bg-[#D99A2B]/20 transition-colors cursor-pointer">
                         Analyze Runoff
                      </button>
                   </div>
                </DashboardCard>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
                <DashboardCard title="Weather Overview" icon={<CloudRain className="w-5 h-5 text-[#52616B]" />} badge="SENAMHI" badgeColor="bg-[#17273D]" badgeTextColor="text-[#CBD5E1]">
                   <div className="flex flex-col h-full space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                         <div className="bg-[#17273D] border border-[#3B3A73] p-3 rounded-xl text-center">
                            <span className="block text-[10px] font-mono font-bold text-[#64748B] mb-1 uppercase">Temp</span>
                            <span className="text-2xl font-black text-[#D99A2B]">24°C</span>
                         </div>
                         <div className="bg-[#17273D] border border-[#3B3A73] p-3 rounded-xl text-center">
                            <span className="block text-[10px] font-mono font-bold text-[#64748B] mb-1 uppercase">Wind</span>
                            <span className="text-2xl font-black text-[#CBD5E1]">42<span className="text-sm ml-1 text-[#64748B]">km/h</span></span>
                         </div>
                      </div>
                      <p className="text-sm text-[#52616B] leading-relaxed">
                         Extreme dry winds increasing evaporation risk across the Altiplano. Refrain from applying synthetic fertilizer.
                      </p>
                      <button className="mt-auto w-full py-2.5 rounded-xl bg-[#17273D] border border-[#3B3A73] text-[#CBD5E1] font-bold text-sm hover:border-[#1E293B] hover:text-white transition-colors cursor-pointer">
                         Fetch SAT Report
                      </button>
                   </div>
                </DashboardCard>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '350ms' }}>
                <DashboardCard title="Recommended Actions" icon={<ShieldAlert className="w-5 h-5 text-[#8FAE7D]" />} badge="AI MODEL" badgeColor="bg-[#3B3A73]" badgeTextColor="text-white">
                   <div className="flex flex-col h-full space-y-4">
                      {selectedSector.cropStatus === "CRITICAL" ? (
                         <div className="p-4 rounded-xl border border-[#B13A2E]/30 bg-[#B13A2E]/10">
                            <span className="text-[10px] font-mono font-bold text-[#B13A2E] uppercase tracking-widest block mb-2">Priority Task</span>
                            <p className="text-sm text-[#F8FAFC] leading-relaxed font-bold">Deploy immediate irrigation to Sector {selectedSector.id} to stabilize stomatal cell bounds.</p>
                         </div>
                      ) : (
                         <div className="p-4 rounded-xl border border-[#3F7D4A]/30 bg-[#3F7D4A]/10">
                            <span className="text-[10px] font-mono font-bold text-[#3F7D4A] uppercase tracking-widest block mb-2">Priority Task</span>
                            <p className="text-sm text-[#3F7D4A] leading-relaxed font-bold">Conditions stable. Continue passive monitoring.</p>
                         </div>
                      )}

                      <div className="p-4 rounded-xl border border-[#3B3A73] bg-[#17273D]">
                         <span className="text-[10px] font-mono font-bold text-[#2F80A8] uppercase tracking-widest block mb-1">Observation</span>
                         <p className="text-xs text-[#CBD5E1] leading-relaxed">Review the Seed Lab model to consider upgrading planting stock to drought-resistant Gamma traits before next season.</p>
                      </div>
                      
                      <button className="mt-auto w-full py-2.5 rounded-xl bg-[#3B3A73] text-white font-bold text-sm hover:bg-[#7C3AED] transition-colors cursor-pointer">
                         Ask Q-AI Assistant
                      </button>
                   </div>
                </DashboardCard>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                <DashboardCard title="Seed Improvement" icon={<FlaskConical className="w-5 h-5 text-[#3F7D4A]" />} badge="GAMMA" badgeColor="bg-[#3F7D4A]" badgeTextColor="text-[#102033]">
                   <div className="flex flex-col items-center justify-center py-4">
                      <div className="text-5xl font-black font-mono tracking-tighter mb-2 text-[#3F7D4A]">
                         +40%
                      </div>
                      <h4 className="font-bold text-white text-center">Frost & Drought Resistance</h4>
                      <p className="text-sm text-[#52616B] text-center mt-2 leading-relaxed max-w-xs transition-opacity">
                         Our irradiation models show extreme improvement potential for {selectedSector.name.split(':')[1]?.trim() || 'crops'} against current climate data.
                      </p>
                   </div>
                   <button className="mt-auto w-full py-2.5 rounded-xl bg-[#3F7D4A] text-[#102033] font-bold text-sm hover:bg-[#20b56b] transition-colors cursor-pointer">
                      Open Seed Simulator
                   </button>
                </DashboardCard>
            </div>

         </div>
      </div>
    </div>
  );
}

// Components
const DropIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2F80A8]"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
);

const DashboardCard = ({ title, icon, badge, badgeColor, badgeTextColor, children }: any) => (
   <div className="bg-[#102033] border border-[#3B3A73] rounded-3xl p-6 shadow-sm flex flex-col h-full relative overflow-hidden group hover:border-[#1E293B] transition-colors">
      <div className="flex items-center justify-between mb-6 z-10 relative">
         <h3 className="font-bold text-white flex items-center gap-2">
            {icon} {title}
         </h3>
         {badge && (
            <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded ${badgeColor} ${badgeTextColor}`}>
               {badge}
            </span>
         )}
      </div>
      <div className="flex-1 flex flex-col z-10 relative">
         {children}
      </div>
   </div>
);
