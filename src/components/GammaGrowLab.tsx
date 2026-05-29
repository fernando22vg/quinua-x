import React, { useState } from "react";
import { 
  Atom, Zap, Cpu, Award, ShieldAlert, Sparkles, RefreshCw, AlertCircle, 
  HelpCircle, ChevronRight, CheckCircle2, TrendingUp, FlaskConical, Scale, Dna,
  History, Download, ChevronLeft, Bot
} from "lucide-react";
import { Language, TRANSLATIONS } from "../translations";
import { calculateQuinoaGammaExperimentalModel } from "../models/quinoaGammaExperimentalModel";

interface GammaGrowLabProps {
  language: Language;
  userMode: "basic" | "expert";
}

interface SeedVariant {
  id: string;
  name: string;
  baseDose: number;
  sensitivity: "HIGH" | "MEDIUM" | "RESISTANT";
  growthCycle: string;
}

const NATIVE_SEEDS: SeedVariant[] = [
  { id: "quinoa", name: "Royal Quinoa (Quinua Real)", baseDose: 150, sensitivity: "MEDIUM", growthCycle: "140 days" },
  { id: "potato", name: "Imilla Potato (Papa Nativa)", baseDose: 8.2, sensitivity: "RESISTANT", growthCycle: "110 days" },
  { id: "tarwi", name: "Tarwi Lupin (Chocho)", baseDose: 3.1, sensitivity: "HIGH", growthCycle: "160 days" },
  { id: "coffee", name: "Yungas Premium Coffee", baseDose: 12.0, sensitivity: "RESISTANT", growthCycle: "240 days" },
  { id: "cacao", name: "Amazonian Cacao", baseDose: 10.5, sensitivity: "RESISTANT", growthCycle: "Perennial" },
  { id: "corn", name: "Andean Maize (Choclo)", baseDose: 5.5, sensitivity: "MEDIUM", growthCycle: "120 days" },
  { id: "barley", name: "High-Altitude Barley", baseDose: 4.0, sensitivity: "HIGH", growthCycle: "100 days" },
  { id: "wheat", name: "Hard Red Wheat", baseDose: 6.0, sensitivity: "MEDIUM", growthCycle: "130 days" },
  { id: "faba", name: "Broad Faba Beans", baseDose: 3.5, sensitivity: "HIGH", growthCycle: "150 days" },
  { id: "canahua", name: "Cañahua (Kañiwa)", baseDose: 4.2, sensitivity: "MEDIUM", growthCycle: "135 days" },
  { id: "amaranth", name: "Kiwicha (Amaranth)", baseDose: 4.8, sensitivity: "MEDIUM", growthCycle: "145 days" },
  { id: "rice", name: "Lowland Rice", baseDose: 5.0, sensitivity: "MEDIUM", growthCycle: "115 days" },
  { id: "tomato", name: "Heirloom Tomato", baseDose: 2.8, sensitivity: "HIGH", growthCycle: "90 days" },
  { id: "onion", name: "Tarija Onion", baseDose: 3.2, sensitivity: "HIGH", growthCycle: "110 days" },
  { id: "garlic", name: "Purple Garlic", baseDose: 3.6, sensitivity: "HIGH", growthCycle: "120 days" },
  { id: "peach", name: "Cochabamba Peach", baseDose: 7.5, sensitivity: "MEDIUM", growthCycle: "Perennial" },
  { id: "grape", name: "Tarija Wine Grape", baseDose: 8.0, sensitivity: "MEDIUM", growthCycle: "Perennial" },
  { id: "chili", name: "Locoto (Chili Pepper)", baseDose: 4.5, sensitivity: "MEDIUM", growthCycle: "100 days" },
  { id: "coca", name: "Legal Coca Leaf", baseDose: 6.5, sensitivity: "MEDIUM", growthCycle: "Perennial" }
];

export default function GammaGrowLab({ language, userMode }: GammaGrowLabProps) {
  const tr = (key: string, fallback?: string) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"][key] || fallback || key;
  };

  const [activeSeedId, setActiveSeedId] = useState<string>("quinoa");
  const [radiationDoseGy, setRadiationDoseGy] = useState<number>(150);
  const [doseUnit, setDoseUnit] = useState<"Gy" | "kGy">("Gy");
  const [targetTrait, setTargetTrait] = useState<string>("drought");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [quinoaResult, setQuinoaResult] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Synchronize internal doses
  const isQuinoa = activeSeedId === "quinoa";
  const selectedSeed = NATIVE_SEEDS.find(s => s.id === activeSeedId) || NATIVE_SEEDS[0];

  // Derived display dosifications
  const displayDose = doseUnit === "Gy" ? radiationDoseGy : radiationDoseGy / 1000;

  const handleDoseChange = (val: number) => {
     if (doseUnit === "Gy") setRadiationDoseGy(val);
     else setRadiationDoseGy(val * 1000);
  };

  const handleSimulateMutation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      let resultObj: any = null;

      if (isQuinoa) {
        resultObj = calculateQuinoaGammaExperimentalModel({ doseGy: radiationDoseGy, mode: userMode });
        setQuinoaResult(resultObj);
        setSimulationResult(null);
      } else {
        const doseKGy = radiationDoseGy / 1000;
        const optimalDose = selectedSeed.baseDose;
        const difference = Math.abs(doseKGy - optimalDose);
        
        let successChance = 100 - (difference * 12);
        successChance = Math.max(10, Math.min(98, Math.round(successChance)));

        let integrity = 100 - (doseKGy * 4.2);
        if (doseKGy > 9.5) integrity -= (doseKGy - 9) * 8;
        integrity = Math.max(5, Math.min(100, Math.round(integrity)));

        let yieldBonus = 0;
        if (successChance > 75 && integrity > 60) {
          yieldBonus = Math.round(15 + (successChance / 6));
        } else if (integrity < 40) {
          yieldBonus = -Math.round((100 - integrity) / 2);
        } else {
          yieldBonus = Math.round(successChance / 12);
        }

        let traitDisplay = "";
        let traitDetail = "";
        if (targetTrait === "frost") {
          traitDisplay = tr('frostResist', 'Frost Immunity');
          traitDetail = "Enzymatic superoxide dismutase activity increased by +240%, providing complete frost bypass down to -6.5°C.";
        } else if (targetTrait === "drought") {
          traitDisplay = tr('droughtResist', 'Drought Resistance');
          traitDetail = "Stomatal locking mechanisms speed up under high warm trade winds, reducing intercellular dehydration by -45%.";
        } else if (targetTrait === "salinity") {
          traitDisplay = tr('salinityResist', 'Salinity Exclusion');
          traitDetail = "Synthesized amino-acid complexes exclude sodium ions at the root tip membrane, supporting saline salt-zone colonization.";
        } else {
          traitDisplay = tr('pestResist', 'Pest Resistance');
          traitDetail = "Saponin compound molecular chain density modified, repelling native bird species and high-altitude leaf beetles.";
        }

        resultObj = {
          successChance,
          integrity,
          yieldBonus,
          traitName: traitDisplay,
          traitDetail,
          isLethal: integrity < 25,
          cobalt60Frequency: `${(1.2 + (doseKGy * 0.15)).toFixed(2)} Exahertz`,
          radiationAbsorptionFactor: `${Math.round(doseKGy * 124)} Gray/sec`,
          doseKGy,
          doseGy: radiationDoseGy,
          crop: selectedSeed.name
        };
        setSimulationResult(resultObj);
        setQuinoaResult(null);
      }

      // Add to history
      setHistory(prev => [{ ...resultObj, isQuinoa, timestamp: new Date().toLocaleTimeString(), id: Math.random() }, ...prev].slice(0, 5));
      setIsSimulating(false);
    }, 1200);
  };

  const handleDownloadReport = () => {
     let content = `--- ${tr('jathaLabTitle', "Jatha K'anchay Lab")} REPORT ---\n${tr('cropTypeLabel', 'Crop')}: ${selectedSeed.name}\n${tr('doseLabel', 'Dose')}: ${radiationDoseGy} Gy (${radiationDoseGy/1000} kGy)\n\n`;
     if (isQuinoa && quinoaResult) {
        content += `${tr('experimentalValues', 'Experimental Results')}:\n- Germination (7d): ${quinoaResult.germination.day7Pct}%\n- Survival (30d): ${quinoaResult.growth.survivalPct}%\n- Bio Damage: ${quinoaResult.biologicalDamagePct}%\n- Mutation Prob: ${quinoaResult.usefulMutationProbabilityPct}%\n`;
        content += `\nAnalysis: ${quinoaResult.classification.expertMessage}\n`;
        content += `\nModel: ${quinoaResult.modelReference}`;
     } else if (simulationResult) {
        content += `${tr('experimentalValues', 'Experimental Results')}:\n- Mutation Coef: ${simulationResult.successChance}%\n- Chromosome Integrity: ${simulationResult.integrity}%\n- Target: ${simulationResult.traitName}\n`;
        content += `\nAnalysis: ${simulationResult.traitDetail}\n`;
     }
     
     const blob = new Blob([content], { type: 'text/plain' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `jatha-lab-report-${selectedSeed.id}.txt`;
     a.click();
     URL.revokeObjectURL(url);
  };

  // Color mappings for Risk zones
  const getRiskColor = (doseGy: number, maxDoseGy: number) => {
     const ratio = doseGy / maxDoseGy;
     if (ratio < 0.2) return 'bg-[#2F80A8]'; // Low
     if (ratio < 0.5) return 'bg-[#3F7D4A]'; // Ideal 
     if (ratio < 0.8) return 'bg-amber-400'; // High risk
     return 'bg-[#B13A2E]'; // Lethal
  };

  const getRiskLabel = (doseGy: number, maxDoseGy: number) => {
     const ratio = doseGy / maxDoseGy;
     if (ratio < 0.2) return 'Low Effect';
     if (ratio < 0.5) return 'Optimal Zone';
     if (ratio < 0.8) return 'High Damage';
     return 'Lethal';
  };

  const maxRiskDose = isQuinoa ? 350 : 25000;

  return (
    <div id="gammagrow-lab-panel" className="flex-1 bg-[#102033] text-[#F8FAFC] overflow-y-auto pb-24 relative select-none font-sans">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#3F7D4A]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="p-6 border-b border-[#17273D] bg-[#102033]/80 backdrop-blur-md sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#8FAE7D] font-bold">
            <Atom className="w-4 h-4 text-[#8FAE7D] animate-spin-slow" />
            <span>{userMode === "expert" ? tr('gammaEngineTitle', 'IAEA B-7 COMPLIANT MUTATION ENGINE') : tr('jathaLabTitle', "Jatha K'anchay Lab")}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-[#F8FAFC] mt-1 transition-colors">
            {tr('jathaLabTitle', "Jatha K'anchay Lab")}
          </h2>
          <p className="text-xs text-[#CBD5E1] font-mono mt-0.5 max-w-2xl transition-colors">
            {tr('jathaLabSubtitle', 'Gamma Irradiation Seed Improvement Simulator')}
          </p>
        </div>

        {userMode === "expert" && (
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#17273D] border border-[#3B3A73] text-[10.5px] font-mono text-[#3F7D4A] font-bold">
              {tr('cobaltSourceStatus', 'Cobalt-60 Source: NOMINAL (98.2%)')}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 pt-8 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative z-20">
        
        {/* Left Column: Controls */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#17273D]/50 border border-[#3B3A73] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#F8FAFC] uppercase flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-[#2F80A8]" />
                {tr('labSetup', 'Laboratory Settings')}
              </h3>
              {userMode === "expert" && (
                <div className="flex bg-[#102033] border border-[#3B3A73] rounded-lg p-0.5 items-center">
                  <button onClick={() => setDoseUnit("Gy")} className={`px-2 py-1 text-[10px] font-bold font-mono rounded ${doseUnit === "Gy" ? 'bg-purple-900/50 text-purple-300' : 'text-[#64748B]'}`}>Gy</button>
                  <button onClick={() => setDoseUnit("kGy")} className={`px-2 py-1 text-[10px] font-bold font-mono rounded ${doseUnit === "kGy" ? 'bg-purple-900/50 text-purple-300' : 'text-[#64748B]'}`}>kGy</button>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-[#64748B] block uppercase mb-2">{tr('cropLabel', '1. TARGET NATIVE CROP')}</label>
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-2 no-scrollbar">
                {NATIVE_SEEDS.map((seed) => (
                  <button
                    key={seed.id}
                    onClick={() => {
                      if (seed.id === "quinoa" && activeSeedId !== "quinoa") setRadiationDoseGy(150);
                      else if (activeSeedId === "quinoa" && seed.id !== "quinoa") setRadiationDoseGy(seed.baseDose * 1000);
                      else if (activeSeedId !== "quinoa" && seed.id !== "quinoa") setRadiationDoseGy(seed.baseDose * 1000);
                      
                      setActiveSeedId(seed.id);
                      setSimulationResult(null);
                      setQuinoaResult(null);
                      setShowHistory(false);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      activeSeedId === seed.id
                        ? "bg-[#3B3A73]/20 border-[#3B3A73] text-[#F8FAFC]"
                        : "bg-[#102033] border-[#3B3A73] hover:border-[#1E293B] hover:text-[#CBD5E1]"
                    }`}
                  >
                    <span className="font-bold block text-[11px] truncate">{seed.name}</span>
                    {userMode === "expert" && (
                      <span className="text-[9px] text-[#64748B] block font-mono mt-1">
                        {seed.id === "quinoa" ? `Exp. Model` : `Empirical`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-[10px] font-mono font-bold text-[#64748B] block uppercase mb-2">{tr('gammaTarget', '2. TRAIT OBJECTIVE')}</label>
              <div className="grid grid-cols-2 gap-2">
                {["frost", "drought", "salinity", "pest"].map(trait => (
                  <button key={trait} onClick={() => setTargetTrait(trait)} className={`p-2 rounded-lg border text-xs font-bold text-center transition-all cursor-pointer ${targetTrait === trait ? "bg-[#2F80A8]/20 border-[#2F80A8] text-[#2F80A8]" : "bg-[#102033] border-[#3B3A73] text-[#52616B] hover:border-[#1E293B]"}`}>
                    {trait === "frost" ? tr('frostResist', 'Frost Immunity') : trait === "drought" ? tr('droughtResist', 'Drought Resistance') : trait === "salinity" ? tr('salinityResist', 'Salinity Exclusion') : tr('pestResist', 'Pest Resistance')}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-bold font-mono text-[#64748B] uppercase">
                  {userMode === "expert" ? `3. ${tr('gammaDose', 'RADIATION DOSE')} (${doseUnit})` : `3. ${tr('seedTreatment', 'TREATMENT LEVEL')}`}
                </label>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#8FAE7D]">{displayDose}</span>
                  <span className="text-[10px] font-mono text-[#64748B] ml-1">{doseUnit}</span>
                </div>
              </div>
              
              <div className="relative pt-2 pb-6">
                <input
                  type="range"
                  min="0"
                  max={doseUnit === "Gy" ? maxRiskDose : maxRiskDose / 1000}
                  step={isQuinoa ? (doseUnit === "Gy" ? "5" : "0.005") : (doseUnit === "Gy" ? "100" : "0.1")}
                  value={displayDose}
                  onChange={(e) => handleDoseChange(parseFloat(e.target.value) || 0)}
                  className="w-full h-2 bg-[#102033] rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                
                {/* Risk Bar Visualization underneath */}
                <div className="w-full h-1.5 mt-2 rounded flex overflow-hidden opacity-80">
                   <div className="bg-[#2F80A8]" style={{ width: '20%' }}></div>
                   <div className="bg-[#3F7D4A]" style={{ width: '30%' }}></div>
                   <div className="bg-amber-400" style={{ width: '30%' }}></div>
                   <div className="bg-[#B13A2E]" style={{ width: '20%' }}></div>
                </div>
                
                <div className="flex justify-between text-[9px] font-mono font-bold text-[#64748B] mt-1.5 uppercase">
                   <span>Safe</span>
                   <span className="text-[#3F7D4A]">Optimal</span>
                   <span>High Risk</span>
                   <span className="text-[#B13A2E]">Lethal</span>
                </div>
              </div>
            </div>

            {userMode === "basic" && (
               <div className="mt-2 p-3 rounded-xl bg-[#102033] border border-[#3B3A73] flex gap-3 pb-4">
                 <HelpCircle className="w-4 h-4 text-[#2F80A8] shrink-0 mt-0.5" />
                 <p className="text-[11px] leading-relaxed text-[#52616B]">
                   {tr('quinoaDisclaimerBasic', 'This is a simulation based on experimental seed irradiation data. Move the slider to find the right balance between improving the seed and keeping it alive.')}
                 </p>
               </div>
            )}

            <button
              onClick={handleSimulateMutation}
              disabled={isSimulating}
              className="mt-6 w-full py-4 rounded-xl bg-[#3B3A73] hover:bg-[#7C3AED] text-white font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.3)] shadow-[#3B3A73]/20 border border-[#3B3A73]"
            >
              <Zap className="w-4 h-4 text-white animate-pulse" />
              {isSimulating ? "APPLYING RADIATION..." : tr('simulateMutation', 'APPLY RADIATION')}
            </button>
          </div>
        </div>

        {/* Right Column: Output & Visualization */}
        <div className="xl:col-span-8 space-y-6">
          
          <div className="flex justify-end gap-3 mb-2">
             {history.length > 0 && (
               <>
                 <button onClick={() => setShowHistory(!showHistory)} className="px-3 py-1.5 bg-[#17273D] border border-[#3B3A73] rounded-lg text-[10px] font-mono font-bold text-[#CBD5E1] flex items-center gap-1.5 hover:border-[#3B3A73]">
                    {showHistory ? <ChevronLeft className="w-3.5 h-3.5" /> : <History className="w-3.5 h-3.5" />}
                    {showHistory ? "BACK TO RESULTS" : "COMPARE HISTORY"}
                 </button>
                 {!showHistory && (
                   <button onClick={handleDownloadReport} className="px-3 py-1.5 bg-[#17273D] border border-[#3B3A73] rounded-lg text-[10px] font-mono font-bold text-[#CBD5E1] flex items-center gap-1.5 hover:border-[#3F7D4A]">
                      <Download className="w-3.5 h-3.5 text-[#3F7D4A]" /> PDF REPORT
                   </button>
                 )}
               </>
             )}
          </div>

          <div className="bg-[#17273D]/30 border border-[#3B3A73] rounded-2xl p-6 min-h-[460px] relative overflow-hidden flex flex-col">
            
            {/* Visualizer animation when empty or simulating */}
            {(!quinoaResult && !simulationResult && !showHistory) || isSimulating ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border border-purple-500/10 animate-spin-slow"></div>
                    <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-spin-reverse-slow"></div>
                    <div className="absolute inset-8 rounded-full border border-[#2F80A8]/20 animate-pulse"></div>
                    <Atom className={`w-12 h-12 text-[#8FAE7D] ${isSimulating ? 'animate-spin' : 'opacity-20'}`} />
                 </div>
                 {isSimulating ? (
                   <p className="mt-8 text-sm font-mono font-bold tracking-widest text-[#8FAE7D] animate-pulse">APPLYING {radiationDoseGy} Gy TO {selectedSeed.name.toUpperCase()}</p>
                 ) : (
                   <p className="mt-8 text-sm font-mono tracking-widest text-[#64748B] uppercase">Ready for sequence</p>
                 )}
              </div>
            ) : showHistory ? (
              <div className="animate-fade-in relative z-10 flex-1">
                 <h3 className="text-sm font-bold text-[#F8FAFC] uppercase mb-4 border-b border-[#3B3A73] pb-2">Treatment History</h3>
                 <div className="space-y-3">
                    {history.map((h, i) => (
                      <div key={i} className="bg-[#102033] border border-[#3B3A73] rounded-xl p-4 flex items-center justify-between">
                         <div>
                            <span className="text-[10px] font-mono text-[#64748B]">{h.timestamp} - {h.crop}</span>
                            <div className="text-lg font-bold font-mono text-[#8FAE7D] mt-1">{h.doseGy} Gy</div>
                         </div>
                         <div className="text-right flex gap-6">
                            {h.isQuinoa ? (
                               <>
                                 <div><span className="text-[10px] font-mono text-[#64748B] block">Survival</span><span className="font-bold text-[#3F7D4A]">{h.growth.survivalPct}%</span></div>
                                 <div><span className="text-[10px] font-mono text-[#64748B] block">Damage</span><span className="font-bold text-amber-400">{h.biologicalDamagePct}%</span></div>
                                 <div><span className="text-[10px] font-mono text-[#64748B] block">Potential</span><span className="font-bold text-[#8FAE7D]">{h.usefulMutationProbabilityPct}%</span></div>
                               </>
                            ) : (
                               <>
                                 <div><span className="text-[10px] font-mono text-[#64748B] block">Integrity</span><span className="font-bold text-[#3F7D4A]">{h.integrity}%</span></div>
                                 <div><span className="text-[10px] font-mono text-[#64748B] block">Potential</span><span className="font-bold text-[#8FAE7D]">{h.successChance}%</span></div>
                               </>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            ) : (
               /* Results Rendering */
               <div className="animate-fade-in relative z-10 h-full flex flex-col">
                  
                  {/* Common Basic/Expert Switch logic for Quinoa / Empirical */}
                  <div className="mb-6 flex justify-between items-start border-b border-[#3B3A73] pb-4">
                     <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {isQuinoa ? `Quinoa Strain Analysis` : `${selectedSeed.name} Analysis`}
                        </h3>
                        <p className="text-xs text-[#52616B] font-mono">
                          {isQuinoa ? QuinoaResultView(quinoaResult, userMode, doseUnit, radiationDoseGy, getRiskColor).message : `General Empirical Projection`}
                        </p>
                     </div>
                     <div className={`px-4 py-2 rounded-xl border flex flex-col items-end ${getRiskColor(radiationDoseGy, maxRiskDose).replace('bg-', 'border-').replace('text-', '')} bg-opacity-10 bg-black`}>
                       <span className="text-[10px] font-mono uppercase text-[#64748B]">TREATMENT LEVEL</span>
                       <span className={`text-xl font-bold font-mono ${getRiskColor(radiationDoseGy, maxRiskDose).replace('bg-', 'text-')}`}>
                         {doseUnit === "Gy" ? radiationDoseGy : radiationDoseGy / 1000} {doseUnit}
                       </span>
                     </div>
                  </div>

                  {userMode === "basic" ? (
                    // BASIC VIEW - Friendly Cards
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                       <BasicMetricCard title="Survival Chance" value={isQuinoa ? `${quinoaResult.growth.survivalPct}%` : `${simulationResult.integrity}%`} color="text-[#3F7D4A]" />
                       <BasicMetricCard title="Biological Damage" value={isQuinoa ? `${quinoaResult.biologicalDamagePct}%` : `${100 - simulationResult.integrity}%`} color="text-amber-400" />
                       <BasicMetricCard title="Improvement Potential" value={isQuinoa ? `${quinoaResult.usefulMutationProbabilityPct}%` : `${simulationResult.successChance}%`} color="text-[#8FAE7D]" />
                       <BasicMetricCard title="Status" value={getRiskLabel(radiationDoseGy, maxRiskDose)} color="text-white" bg="bg-[#102033]" />
                    </div>
                  ) : (
                    // EXPERT VIEW - Data dense
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <ExpertDataCard label="7d Germination" value={isQuinoa ? `${quinoaResult.germination.day7Pct}%` : 'N/A'} />
                        <ExpertDataCard label="Cellular Integrity" value={isQuinoa ? `${quinoaResult.growth.survivalPct}%` : `${simulationResult.integrity}%`} />
                        <ExpertDataCard label="Mutation Coef" value={isQuinoa ? `${quinoaResult.usefulMutationProbabilityPct}` : `${simulationResult.successChance}%`} />
                        <ExpertDataCard label="Radiation Absorbed" value={Math.round(radiationDoseGy * 124) + " Gy/s"} />
                        
                        {isQuinoa && (
                          <div className="col-span-full mt-2 border-t border-[#3B3A73] pt-4">
                             <div className="text-[10px] font-mono text-[#64748B] mb-2 flex justify-between">
                               <span>EXPERIMENTAL DOSE-RESPONSE (PASANKALLA)</span>
                               <span>{quinoaResult.modelReference}</span>
                             </div>
                             <div className="flex items-end h-24 gap-1 p-2 bg-[#102033] rounded-xl border border-[#3B3A73]">
                                {[0, 100, 150, 200, 250, 300, 350].map((d) => (
                                   <div key={d} className="flex-1 flex flex-col items-center justify-end h-full gap-1 group relative">
                                      <div className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${Math.abs(d - radiationDoseGy) < 25 ? 'bg-purple-500' : 'bg-[#1E293B]'}`} style={{ height: `${d === 0 ? 90 : d === 150 ? 53 : d === 250 ? 28 : (d >= 350 ? 5 : Math.max(10, 80 - d/4))}%`}}></div>
                                      <span className={`text-[8px] font-mono ${Math.abs(d - radiationDoseGy) < 25 ? 'text-[#8FAE7D]' : 'text-[#64748B]'}`}>{d}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Q-AI Explanation Box */}
                  <div className="mt-auto pt-4 flex flex-col gap-2">
                     {userMode === "basic" && (
                        <button onClick={() => setShowExplanation(!showExplanation)} className="text-xs font-mono font-bold text-[#2F80A8] flex items-center gap-1.5 w-fit hover:underline">
                          <Bot className="w-4 h-4" /> 
                          {showExplanation ? "Hide Scientific Details" : "Ask Q-AI for Scientific Details"}
                        </button>
                     )}
                     
                     {(userMode === "expert" || showExplanation) && (
                        <div className="bg-[#102033] p-4 rounded-xl border border-[#3B3A73]">
                           <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-[#8FAE7D]">
                             <Sparkles className="w-3 h-3" /> Q-AI MODEL SYNOPSIS
                           </div>
                           <p className="text-xs text-[#52616B] leading-relaxed">
                             {isQuinoa 
                               ? quinoaResult.classification.expertMessage 
                               : `Simulated exposure of ${radiationDoseGy} Gy. ${simulationResult.traitDetail}`}
                           </p>
                           {isQuinoa && userMode === "expert" && (
                              <p className="text-[10px] text-[#64748B] font-mono mt-3 pt-3 border-t border-[#3B3A73]">
                                Technical note: Piecewise linear interpolation utilized across 0-350Gy experimental bounds.
                              </p>
                           )}
                        </div>
                     )}
                  </div>

               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Sub-components
const BasicMetricCard = ({ title, value, color, bg = "bg-[#102033]" }: any) => (
  <div className={`${bg} border border-[#3B3A73] p-4 rounded-xl shadow-sm flex flex-col justify-between`}>
     <span className="text-[10px] font-mono text-[#52616B] uppercase block mb-2">{title}</span>
     <strong className={`text-xl md:text-2xl font-bold font-mono ${color}`}>{value}</strong>
  </div>
);

const ExpertDataCard = ({ label, value }: any) => (
  <div className="bg-[#102033] border border-[#3B3A73] p-3 rounded-lg flex flex-col justify-between">
    <span className="text-[9px] font-mono text-[#64748B] uppercase block mb-1">{label}</span>
    <strong className="text-sm font-bold font-mono text-[#F8FAFC]">{value}</strong>
  </div>
);

const QuinoaResultView = (result: any, userMode: string, doseUnit: string, dose: number, getRiskColor: any) => {
  if (!result) return { message: "" };
  return {
    message: result.classification.basicMessage
  };
}
