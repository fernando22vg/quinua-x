import React from "react";
import { LayoutDashboard, Compass, Radio, Lightbulb, ShieldAlert, Cpu, Atom, Home, Map, CloudRain, Calculator } from "lucide-react";
import { Language, TRANSLATIONS, t } from "../translations";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  activeAlertsCount: number;
  language: Language;
  userMode: "basic" | "expert" | null;
}

export default function Sidebar({ currentPage, onPageChange, activeAlertsCount, language, userMode }: SidebarProps) {
  const tr = (key: string, fallback?: string) => t(language, key, fallback);

  const expertItems = [
    { id: "landing", label: tr('stableIsotopes', 'STABLE ISOTOPES'), icon: Compass },
    { id: "overview", label: tr('telemetry', 'TELEMETRY OVERVIEW'), icon: LayoutDashboard },
    { id: "satellite", label: tr('satellites', 'SATELLITES & MAPS'), icon: Radio },
    { id: "isotope", label: tr('science', 'NUCLEAR SCIENCE BASICS'), icon: Lightbulb },
    { id: "gamma-lab", label: tr('gammaLab', 'GAMMA GROW LAB'), icon: Atom },
    { id: "ai-agronomist", label: tr('aiAssistant', 'ISOTOPIC AI TERMINAL'), icon: Cpu },
  ];

  const basicItems = [
    { id: "landing", label: tr('home', 'HOME'), icon: Home },
    { id: "basic-dashboard", label: tr('myField', 'MY FIELD'), icon: Map },
    { id: "gamma-lab", label: tr('seedImprovement', 'SEED IMPROVEMENT'), icon: Atom },
    { id: "ai-agronomist", label: tr('askQAi', 'ASK Q-AI'), icon: Cpu },
  ];

  const menuItems = userMode === "basic" ? basicItems : expertItems;

  return (
    <aside className="w-80 bg-[#102033] border-r border-[#3B3A73]/60/80 flex flex-col h-screen overflow-y-auto shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#3B3A73]/50 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange("landing")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-950/40 flex items-center justify-center">
            <span className="font-mono text-xl font-bold text-[#102033]">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#F8FAFC] tracking-tight leading-none">QUINOA-X</h1>
            <span className="text-[10px] font-mono text-[#D9A441] uppercase tracking-widest leading-none">HACKATHON 2026</span>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] bg-[#B13A2E]/20 border border-[#B13A2E]/50 text-[#B13A2E] font-mono flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B13A2E] animate-ping"></span>
          LIVE SECURE
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="text-[10.5px] font-mono text-[#EFE3C8]/80 tracking-wider uppercase mb-3 px-3">
          Control Unit Modules
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left
                ${
                  isActive
                    ? "bg-[#17273D] text-[#D9A441] border border-[#D9A441]/20 shadow shadow-emerald-950/20"
                    : "text-[#EFE3C8] hover:bg-[#17273D]/50 hover:text-[#F8FAFC]"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-[#D9A441]" : "text-[#EFE3C8]/80"}`} />
                <span>{item.label}</span>
              </div>
              
              {item.id === "overview" && activeAlertsCount > 0 && (
                <span className="bg-[#B13A2E] text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom telemetry card details */}
      <div className="p-4 m-4 rounded-xl bg-[#17273D]/60 border border-[#3B3A73]/80/80">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-[#D9A441]" />
          <span className="text-xs font-mono font-medium text-[#F8FAFC]/90">AESA Ground Station</span>
        </div>
        <p className="text-[11px] text-[#EFE3C8]/80 leading-relaxed font-mono">
          Uplink: Active (3850m) <br />
          Bolivia Altiplano Node QX-4 <br />
          Titicaca Basin telemetry nominal.
        </p>
        <div className="mt-3 pt-3 border-t border-[#3B3A73]/60/80 flex items-center justify-between text-[10.5px] font-mono text-[#EFE3C8]">
          <span>Lat: 16.90° S</span>
          <span>Lng: 68.12° W</span>
        </div>
      </div>
    </aside>
  );
}
