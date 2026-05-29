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
    <aside className="w-80 bg-zinc-950 border-r border-zinc-850/80 flex flex-col h-screen overflow-y-auto shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onPageChange("landing")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-950/40 flex items-center justify-center">
            <span className="font-mono text-xl font-bold text-zinc-950">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100 tracking-tight leading-none">QUINOA-X</h1>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest leading-none">HACKATHON 2026</span>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] bg-red-950/60 border border-red-800 text-red-500 font-mono flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
          LIVE SECURE
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="text-[10.5px] font-mono text-zinc-500 tracking-wider uppercase mb-3 px-3">
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
                    ? "bg-zinc-900 text-emerald-400 border border-emerald-900/40 shadow shadow-emerald-950/20"
                    : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </div>
              
              {item.id === "overview" && activeAlertsCount > 0 && (
                <span className="bg-red-500 text-white text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom telemetry card details */}
      <div className="p-4 m-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-medium text-zinc-300">AESA Ground Station</span>
        </div>
        <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">
          Uplink: Active (3850m) <br />
          Bolivia Altiplano Node QX-4 <br />
          Titicaca Basin telemetry nominal.
        </p>
        <div className="mt-3 pt-3 border-t border-zinc-850/80 flex items-center justify-between text-[10.5px] font-mono text-zinc-400">
          <span>Lat: 16.90° S</span>
          <span>Lng: 68.12° W</span>
        </div>
      </div>
    </aside>
  );
}
