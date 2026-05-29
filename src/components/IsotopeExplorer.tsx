import React, { useState } from "react";
import { Lightbulb, Settings, Compass, Atom, Cpu, ArrowRight, HelpCircle } from "lucide-react";
import { Isotope } from "../types";
import { ISOTOPES } from "../data";

export default function IsotopeExplorer() {
  const [selectedIsotopeId, setSelectedIsotopeId] = useState<string>("N15");
  const selectedIsotope = ISOTOPES.find(i => i.id === selectedIsotopeId) || ISOTOPES[0];

  // Interactive state variables to customize the animated atomic model in real-time
  const [orbitSpeed, setOrbitSpeed] = useState<number>(3); // 1 = slow, 3 = normal, 6 = super fast
  const [nucleusScale, setNucleusScale] = useState<number>(1); // Zoom scale
  const [energyFilter, setEnergyFilter] = useState<string>("neutral");

  return (
    <div className="flex-1 bg-[#102033] text-[#F8FAFC] overflow-y-auto min-h-screen animate-fade-in">
      {/* Page Header */}
      <div className="p-6 border-b border-[#3B3A73]/50 bg-[#102033]/80 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-mono text-[#D9A441]">
            <Atom className="w-3.5 h-3.5" />
            <span>NUCLEONIC MASS SPECTHROMETRY CORES</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mt-1">
            Stable Isotope Atom Science
          </h2>
          <p className="text-xs text-[#EFE3C8]/80 font-mono mt-0.5 leading-relaxed">
            Non-radioactive isotopes tracing chemical absorption and plant transpiration.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#17273D] border border-[#3B3A73]/80 text-[11px] font-mono text-[#EFE3C8] animate-slide-up" style={{ animationDelay: '50ms' }}>
          Nuclear Node: Q-STEADY
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ANIMATED NEON ISOTOPE ATOM SCHEMATIC - Left 7 Cols (inspired by screen 2) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#102033] border border-[#3B3A73]/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-slide-up" style={{ animationDelay: '100ms' }}>
          
          {/* Scientific grid mesh pattern in the card background */}
          <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

          <div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-[#3B3A73]/40 w-full pb-3.5 mb-6 z-10 relative">
              <h3 className="font-mono text-xs font-bold text-[#D9A441] flex items-center gap-1.5 transition-colors">
                <Atom className="text-[#D9A441] w-4 h-4 animate-spin-slow" />
                STABLE ATOM SPECTRA: {selectedIsotope.fullName.toUpperCase()}
              </h3>
              <span className="text-[10px] font-mono text-[#EFE3C8]/80 transition-colors">
                Formula: {selectedIsotope.nuclearFormula}
              </span>
            </div>

            {/* Glowing neon animated atom viewport */}
            <div className="h-96 w-full bg-[#102033] rounded-xl border border-[#3B3A73]/50 flex items-center justify-center p-4 relative overflow-hidden shadow-inner">
              <div className="absolute top-4 left-4 bg-[#17273D]/90 border border-[#3B3A73]/80/80 px-2.5 py-1 rounded text-[9.5px] font-mono text-[#EFE3C8] flex items-center gap-1.5 shadow z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="transition-all">Protons: {selectedIsotope.protons}</span>
                <span className="text-[#EFE3C8]/50">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]"></span>
                <span className="transition-all">Neutrons: {selectedIsotope.neutrons}</span>
              </div>

              {/* Central high fidelity interactive atom model wrapper */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                
                {/* 3 Concentric orbital vectors */}
                <div 
                  className="absolute rounded-full border border-[#3B3A73]/80/60 pointer-events-none" 
                  style={{
                    width: "160px",
                    height: "160px",
                    transform: "rotateX(75deg) rotateY(15deg)",
                    animation: `spin ${12 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F80A8] absolute top-0 left-1/2 -ml-1.25 blur-xs shadow-md shadow-cyan-400/50"></div>
                </div>

                <div 
                  className="absolute rounded-full border border-[#3B3A73]/80/60 pointer-events-none" 
                  style={{
                    width: "220px",
                    height: "220px",
                    transform: "rotateX(45deg) rotateY(-45deg)",
                    animation: `spin ${18 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D9A441] absolute top-1/2 left-0 -mt-1.25 blur-xs shadow-md shadow-emerald-400/50"></div>
                </div>

                <div 
                  className="absolute rounded-full border border-[#3B3A73]/80/60 pointer-events-none" 
                  style={{
                    width: "280px",
                    height: "280px",
                    transform: "rotateX(15deg) rotateY(60deg)",
                    animation: `spin ${24 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3B3A73] absolute bottom-0 left-1/2 -ml-1.25 blur-xs shadow-md shadow-[#3B3A73]/50"></div>
                </div>

                {/* Nucleus Core (Grouping of Protons - Red/Pink and Neutrons - Green/Blue) */}
                <div 
                  className="relative flex flex-wrap w-24 h-24 rounded-full bg-[#17273D] border border-[#3B3A73]/60 items-center justify-center p-2 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-transform duration-300"
                  style={{ transform: `scale(${nucleusScale})` }}
                >
                  {/* Generate multiple particles in nucleus */}
                  {Array.from({ length: selectedIsotope.protons + selectedIsotope.neutrons }).map((_, idx) => {
                    const isProton = idx % 2 === 0;
                    return (
                      <div
                        key={idx}
                        className={`w-3.5 h-3.5 rounded-full -m-0.5 shadow-sm transition-all duration-300
                          ${isProton 
                            ? "bg-indigo-500 border border-indigo-400/30" 
                            : "bg-[#3F7D4A] border border-[#3F7D4A]/30"
                          }
                        `}
                      />
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#102033]/60 rounded-full text-[10px] font-bold font-mono tracking-tighter text-[#F8FAFC]/90">
                    {selectedIsotope.symbol}
                  </div>
                </div>
              </div>

              {/* Formula and stable flag badge */}
              <div className="absolute bottom-4 right-4 bg-[#17273D]/90 border border-[#3B3A73]/80 px-3 py-1 rounded text-[10px] font-mono text-[#EFE3C8]">
                {selectedIsotope.fullName} • STABLE ISOTOPE
              </div>
            </div>

            {/* Custom control parameters panels */}
            <div className="mt-5 p-4 bg-[#102033] border border-[#3B3A73]/50/60 rounded-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#EFE3C8]/80 mb-1 leading-none">
                <span>Atomic customization panel</span>
                <span className="text-[#D9A441]">Steady State Simulation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Orbit Control */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#EFE3C8] block pb-1 border-b border-[#3B3A73]/50">
                    Electron Orbit speed: <span className="font-bold text-[#D9A441]">{orbitSpeed}×</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={orbitSpeed}
                      onChange={(e) => setOrbitSpeed(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#102033] border border-[#3B3A73]/80 rounded px-3 py-2 text-[#D9A441] font-mono text-sm focus:outline-none focus:border-[#D9A441]"
                    />
                    <span className="absolute right-3 top-2.5 text-[#EFE3C8]/80 text-xs font-mono select-none">×</span>
                  </div>
                  {orbitSpeed < 1 || orbitSpeed > 6 ? (
                    <p className="text-[10px] text-[#B13A2E] font-mono">Value must be between 1 and 6</p>
                  ) : null}
                  <button onClick={() => setOrbitSpeed(3)} className="text-[10px] text-[#EFE3C8]/80 hover:text-[#F8FAFC]/90 font-mono mt-1 underline">Reset to default</button>
                </div>

                {/* Core Control */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-[#EFE3C8] block pb-1 border-b border-[#3B3A73]/50">
                    Nucleus Core scale: <span className="font-bold text-[#2F80A8]">{nucleusScale.toFixed(2)}x</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.8"
                      max="1.5"
                      step="0.1"
                      value={nucleusScale}
                      onChange={(e) => setNucleusScale(parseFloat(e.target.value) || 1)}
                      className="w-full bg-[#102033] border border-[#3B3A73]/80 rounded px-3 py-2 text-[#2F80A8] font-mono text-sm focus:outline-none focus:border-[#2F80A8]"
                    />
                    <span className="absolute right-3 top-2.5 text-[#EFE3C8]/80 text-xs font-mono select-none">x scale</span>
                  </div>
                  {nucleusScale < 0.8 || nucleusScale > 1.5 ? (
                    <p className="text-[10px] text-[#B13A2E] font-mono">Value must be between 0.8 and 1.5</p>
                  ) : null}
                  <button onClick={() => setNucleusScale(1)} className="text-[10px] text-[#EFE3C8]/80 hover:text-[#F8FAFC]/90 font-mono mt-1 underline">Reset to default</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-[#EFE3C8]/80 font-mono text-center border-t border-[#3B3A73]/50 pt-3">
            MASS SPECTROMETRIC PHYSICS DISCLOSURE: Nitrogen-15 is naturally occurring, non-radioactive stable nitrogen core.
          </div>
        </div>

        {/* DETAILED ISOTOPIC DATASHEET & FORMULA CARDS - Right 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Isotope selector */}
          <div className="bg-[#17273D]/35 border border-[#3B3A73]/50 p-5 rounded-2xl animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h3 className="font-bold text-sm text-[#F8FAFC]/90 mb-3.5 flex items-center gap-1.5 transition-colors">
              <Settings className="w-4 h-4 text-[#D9A441] group-hover:rotate-90 transition-transform" />
              Active Spectrometric Isotope
            </h3>
            
            <div className="space-y-2">
              {ISOTOPES.map((iso) => (
                <button
                  key={iso.id}
                  onClick={() => setSelectedIsotopeId(iso.id)}
                  className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between group
                    ${iso.id === selectedIsotopeId
                      ? "bg-[#17273D] text-[#D9A441] border-[#D9A441]/60 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]"
                      : "bg-[#102033] border-[#3B3A73]/50 text-[#EFE3C8] hover:bg-[#17273D]/60 hover:scale-[1.01]"
                    }
                  `}
                >
                  <div>
                    <h4 className={`font-bold text-sm transition-colors ${iso.id === selectedIsotopeId ? 'text-[#D9A441]' : 'text-[#F8FAFC]'}`}>{iso.fullName} ({iso.symbol})</h4>
                    <span className="text-[10.5px] font-mono text-[#EFE3C8]/80 transition-colors">Atomic weight tracers • stable</span>
                  </div>
                  <div className={`font-mono text-xs px-2 py-1 rounded transition-colors ${iso.id === selectedIsotopeId ? 'bg-[#D9A441]/10/50 border border-[#D9A441]/30 text-[#D9A441]' : 'text-[#EFE3C8] bg-[#102033] border border-[#3B3A73]/50'}`}>
                    Z={iso.protons}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Technical Specifications layout */}
          <div className="bg-[#17273D]/35 border border-[#3B3A73]/50 p-5 rounded-2xl space-y-4 font-mono text-[11.5px] animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="font-sans font-bold text-sm text-[#F8FAFC]/90 border-b border-[#3B3A73]/50 pb-3 transition-colors">
              Technical Core Properties
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-[#3B3A73]/50/80 pb-1.5 transition-all hover:bg-[#17273D]/50 -mx-2 px-2 rounded">
                <span className="text-[#EFE3C8]/70">Stable nucleons:</span>
                <span className="font-bold text-[#F8FAFC]/90 animate-fade-in" key={`${selectedIsotope.id}-a`}>{selectedIsotope.protons + selectedIsotope.neutrons} (A value)</span>
              </div>
              <div className="flex justify-between border-b border-[#3B3A73]/50/80 pb-1.5 transition-all hover:bg-[#17273D]/50 -mx-2 px-2 rounded">
                <span className="text-[#EFE3C8]/70">Protons count:</span>
                <span className="font-bold text-[#F8FAFC]/90 animate-fade-in" key={`${selectedIsotope.id}-p`}>{selectedIsotope.protons}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B3A73]/50/80 pb-1.5 transition-all hover:bg-[#17273D]/50 -mx-2 px-2 rounded">
                <span className="text-[#EFE3C8]/70">Neutrons count:</span>
                <span className="font-bold text-[#F8FAFC]/90 animate-fade-in" key={`${selectedIsotope.id}-n`}>{selectedIsotope.neutrons}</span>
              </div>
              <div className="flex justify-between border-b border-[#3B3A73]/50/80 pb-1.5 transition-all hover:bg-[#17273D]/50 -mx-2 px-2 rounded">
                <span className="text-[#EFE3C8]/70">Electrons weight:</span>
                <span className="font-bold text-[#F8FAFC]/90 animate-fade-in" key={`${selectedIsotope.id}-e`}>{selectedIsotope.electrons}</span>
              </div>
              <div className="flex justify-between transition-all hover:bg-[#17273D]/50 -mx-2 px-2 rounded">
                <span className="text-[#EFE3C8]/70">Nuclear Halflife:</span>
                <span className="text-[#D9A441] font-bold animate-fade-in" key={`${selectedIsotope.id}-hl`}>{selectedIsotope.halfLife}</span>
              </div>
            </div>
          </div>

          {/* Scientific Agronomical trace application & Formulas cards */}
          <div className="bg-gradient-to-b from-[#17273D]/50 to-[#102033] border border-[#3B3A73]/50 p-5 rounded-2xl space-y-4 animate-slide-up" style={{ animationDelay: '250ms' }}>
            <h3 className="font-sans font-bold text-sm text-[#F8FAFC]/90 pb-2.5 border-b border-[#3B3A73]/50 transition-colors">
              Agronomical Application & Formula
            </h3>

            <div className="space-y-3.5">
              <div className="animate-fade-in" key={`${selectedIsotope.id}-desc`}>
                <span className="text-[10px] font-mono text-[#EFE3C8]/80 uppercase block">Scientific Purpose</span>
                <p className="text-xs text-[#F8FAFC]/90 mt-1 leading-relaxed transition-colors">
                  {selectedIsotope.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#3B3A73]/50 animate-fade-in" key={`${selectedIsotope.id}-agro`}>
                <span className="text-[10px] font-mono text-[#EFE3C8]/80 uppercase block">Agronomical Metric Target</span>
                <p className="text-xs text-[#D9A441] mt-1 font-mono transition-colors">
                  {selectedIsotope.agronomicalPurpose}
                </p>
              </div>

              {/* Mass Spectrometry formula card */}
              <div className="p-3.5 bg-[#102033] border border-[#3B3A73]/50 rounded-xl space-y-1 animate-fade-in" key={`${selectedIsotope.id}-form`}>
                <span className="text-[10px] font-mono text-[#EFE3C8]/80 uppercase block">Mass delta tracing formula</span>
                <div className="py-2 flex justify-center text-[#F8FAFC] font-mono text-xs bg-[#17273D]/50 rounded border border-[#3B3A73]/60 my-1">
                  {selectedIsotopeId === "N15" && (
                    <span>d15N (‰) = [ (R_sample / R_standard) - 1 ] x 1000</span>
                  )}
                  {selectedIsotopeId === "O18" && (
                    <span>d18O (‰) = [ (R_sample / R_standard) - 1 ] x 1000</span>
                  )}
                  {selectedIsotopeId === "H2" && (
                    <span>d2H (‰) = [ (R_sample / R_standard) - 1 ] x 1000</span>
                  )}
                  {selectedIsotopeId === "C13" && (
                    <span>d13C (‰) = [ (R_sample / R_standard) - 1 ] x 1000</span>
                  )}
                </div>
                <p className="text-[10px] text-[#EFE3C8]/70 leading-relaxed font-mono">
                  Where R represents high-precision heavy-to-light numeric ratios (e.g. 15N/14N or 18O/16O) measured dynamically using high vacuum systems.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded CSS animation of Spinning orbits */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .blinking {
          animation: blinker 1.5s linear infinite;
        }
        @keyframes blinker {
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
