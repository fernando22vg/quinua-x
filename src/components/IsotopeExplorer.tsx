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
    <div className="flex-1 bg-zinc-950 text-zinc-100 overflow-y-auto min-h-screen">
      {/* Page Header */}
      <div className="p-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Atom className="w-3.5 h-3.5" />
            <span>NUCLEONIC MASS SPECTHROMETRY CORES</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mt-1">
            Stable Isotope Atom Science
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 leading-relaxed">
            Non-radioactive isotopes tracing chemical absorption and plant transpiration.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          Nuclear Node: Q-STEADY
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ANIMATED NEON ISOTOPE ATOM SCHEMATIC - Left 7 Cols (inspired by screen 2) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-zinc-905 border border-zinc-855 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Scientific grid mesh pattern in the card background */}
          <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

          <div>
            <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 border-b border-zinc-90 w-full pb-3.5 mb-6 z-10 relative">
              <h3 className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Atom className="text-emerald-400 w-4 h-4" />
                STABLE ATOM SPECTRA: {selectedIsotope.fullName.toUpperCase()}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                Formula: {selectedIsotope.nuclearFormula}
              </span>
            </div>

            {/* Glowing neon animated atom viewport */}
            <div className="h-96 w-full bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-800/80 px-2.5 py-1 rounded text-[9.5px] font-mono text-zinc-400 flex items-center gap-1.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>Protons: {selectedIsotope.protons}</span>
                <span className="text-zinc-650">•</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Neutrons: {selectedIsotope.neutrons}</span>
              </div>

              {/* Central high fidelity interactive atom model wrapper */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                
                {/* 3 Concentric orbital vectors */}
                <div 
                  className="absolute rounded-full border border-zinc-800/60 pointer-events-none" 
                  style={{
                    width: "160px",
                    height: "160px",
                    transform: "rotateX(75deg) rotateY(15deg)",
                    animation: `spin ${12 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute top-0 left-1/2 -ml-1.25 blur-xs shadow-md shadow-cyan-400/50"></div>
                </div>

                <div 
                  className="absolute rounded-full border border-zinc-800/60 pointer-events-none" 
                  style={{
                    width: "220px",
                    height: "220px",
                    transform: "rotateX(45deg) rotateY(-45deg)",
                    animation: `spin ${18 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-1/2 left-0 -mt-1.25 blur-xs shadow-md shadow-emerald-400/50"></div>
                </div>

                <div 
                  className="absolute rounded-full border border-zinc-800/60 pointer-events-none" 
                  style={{
                    width: "280px",
                    height: "280px",
                    transform: "rotateX(15deg) rotateY(60deg)",
                    animation: `spin ${24 / orbitSpeed}s linear infinite`
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 absolute bottom-0 left-1/2 -ml-1.25 blur-xs shadow-md shadow-purple-400/50"></div>
                </div>

                {/* Nucleus Core (Grouping of Protons - Red/Pink and Neutrons - Green/Blue) */}
                <div 
                  className="relative flex flex-wrap w-24 h-24 rounded-full bg-zinc-900 border border-zinc-850 items-center justify-center p-2 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-transform duration-300"
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
                            : "bg-emerald-500 border border-emerald-400/30"
                          }
                        `}
                      />
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 rounded-full text-[10px] font-bold font-mono tracking-tighter text-zinc-300">
                    {selectedIsotope.symbol}
                  </div>
                </div>
              </div>

              {/* Formula and stable flag badge */}
              <div className="absolute bottom-4 right-4 bg-zinc-900/90 border border-zinc-800 px-3 py-1 rounded text-[10px] font-mono text-zinc-400">
                {selectedIsotope.fullName} • STABLE ISOTOPE
              </div>
            </div>

            {/* Custom control parameters panels */}
            <div className="mt-5 p-4 bg-zinc-950 border border-zinc-900/60 rounded-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1 leading-none">
                <span>Atomic customization panel</span>
                <span className="text-emerald-400">Steady State Simulation</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Orbit Control */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 block pb-1 border-b border-zinc-900">
                    Electron Orbit speed: <span className="font-bold text-emerald-400">{orbitSpeed}×</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={orbitSpeed}
                      onChange={(e) => setOrbitSpeed(parseInt(e.target.value) || 1)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-emerald-400 font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <span className="absolute right-3 top-2.5 text-zinc-500 text-xs font-mono select-none">×</span>
                  </div>
                  {orbitSpeed < 1 || orbitSpeed > 6 ? (
                    <p className="text-[10px] text-red-400 font-mono">Value must be between 1 and 6</p>
                  ) : null}
                  <button onClick={() => setOrbitSpeed(3)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono mt-1 underline">Reset to default</button>
                </div>

                {/* Core Control */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 block pb-1 border-b border-zinc-900">
                    Nucleus Core scale: <span className="font-bold text-cyan-400">{nucleusScale.toFixed(2)}x</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.8"
                      max="1.5"
                      step="0.1"
                      value={nucleusScale}
                      onChange={(e) => setNucleusScale(parseFloat(e.target.value) || 1)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-3 top-2.5 text-zinc-500 text-xs font-mono select-none">x scale</span>
                  </div>
                  {nucleusScale < 0.8 || nucleusScale > 1.5 ? (
                    <p className="text-[10px] text-red-400 font-mono">Value must be between 0.8 and 1.5</p>
                  ) : null}
                  <button onClick={() => setNucleusScale(1)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono mt-1 underline">Reset to default</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-zinc-500 font-mono text-center border-t border-zinc-900 pt-3">
            MASS SPECTROMETRIC PHYSICS DISCLOSURE: Nitrogen-15 is naturally occurring, non-radioactive stable nitrogen core.
          </div>
        </div>

        {/* DETAILED ISOTOPIC DATASHEET & FORMULA CARDS - Right 5 Cols */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Isotope selector */}
          <div className="bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-zinc-300 mb-3.5 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-400" />
              Active Spectrometric Isotope
            </h3>
            
            <div className="space-y-2">
              {ISOTOPES.map((iso) => (
                <button
                  key={iso.id}
                  onClick={() => setSelectedIsotopeId(iso.id)}
                  className={`w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between
                    ${iso.id === selectedIsotopeId
                      ? "bg-zinc-900 text-emerald-400 border-emerald-500/60 shadow shadow-emerald-950/20"
                      : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:bg-zinc-900/60"
                    }
                  `}
                >
                  <div>
                    <h4 className="font-bold text-sm text-zinc-200">{iso.fullName} ({iso.symbol})</h4>
                    <span className="text-[10.5px] font-mono text-zinc-500">Atomic weight tracers • stable</span>
                  </div>
                  <div className="font-mono text-xs text-zinc-400 px-2 py-1 rounded bg-zinc-950 border border-zinc-900">
                    Z={iso.protons}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Technical Specifications layout */}
          <div className="bg-zinc-900/35 border border-zinc-900 p-5 rounded-2xl space-y-4 font-mono text-[11.5px]">
            <h3 className="font-sans font-bold text-sm text-zinc-300 border-b border-zinc-900 pb-3">
              Technical Core Properties
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-zinc-900/80 pb-1.5">
                <span className="text-zinc-550">Stable nucleons:</span>
                <span className="font-bold text-zinc-300">{selectedIsotope.protons + selectedIsotope.neutrons} (A value)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/80 pb-1.5">
                <span className="text-zinc-550">Protons count:</span>
                <span className="font-bold text-zinc-300">{selectedIsotope.protons}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/80 pb-1.5">
                <span className="text-zinc-550">Neutrons count:</span>
                <span className="font-bold text-zinc-300">{selectedIsotope.neutrons}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900/80 pb-1.5">
                <span className="text-zinc-550">Electrons weight:</span>
                <span className="font-bold text-zinc-300">{selectedIsotope.electrons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-550">Nuclear Halflife:</span>
                <span className="text-emerald-400 font-bold">{selectedIsotope.halfLife}</span>
              </div>
            </div>
          </div>

          {/* Scientific Agronomical trace application & Formulas cards */}
          <div className="bg-gradient-to-b from-zinc-900/50 to-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4">
            <h3 className="font-sans font-bold text-sm text-zinc-300 pb-2.5 border-b border-zinc-900">
              Agronomical Application & Formula
            </h3>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Scientific Purpose</span>
                <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                  {selectedIsotope.description}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-900">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Agronomical Metric Target</span>
                <p className="text-xs text-emerald-400 mt-1 font-mono">
                  {selectedIsotope.agronomicalPurpose}
                </p>
              </div>

              {/* Mass Spectrometry formula card */}
              <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Mass delta tracing formula</span>
                <div className="py-2 flex justify-center text-zinc-100 font-mono text-xs bg-zinc-900/50 rounded border border-zinc-850 my-1">
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
                <p className="text-[10px] text-zinc-550 leading-relaxed font-mono">
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
