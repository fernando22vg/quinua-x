import React, { useState } from "react";
import { 
  Atom, Zap, Cpu, Award, ShieldAlert, Sparkles, RefreshCw, AlertCircle, 
  HelpCircle, ChevronRight, CheckCircle2, TrendingUp, FlaskConical, Scale, Dna
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
  { id: "quinoa", name: "Royal Quinoa (Quinua Real)", baseDose: 150, sensitivity: "MEDIUM", growthCycle: "140 days" }, // Note: baseDose is Gy now for quinoa
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
  const [radiationDose, setRadiationDose] = useState<number>(150); // Initial dose is 150 Gy for Quinoa
  const [targetTrait, setTargetTrait] = useState<string>("drought");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [quinoaResult, setQuinoaResult] = useState<any | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const selectedSeed = NATIVE_SEEDS.find(s => s.id === activeSeedId) || NATIVE_SEEDS[0];
  const isQuinoa = activeSeedId === "quinoa";

  const handleSimulateMutation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    setQuinoaResult(null);

    setTimeout(() => {
      if (isQuinoa) {
        const result = calculateQuinoaGammaExperimentalModel({ doseGy: radiationDose, mode: userMode });
        setQuinoaResult(result);
      } else {
        const optimalDose = selectedSeed.baseDose;
        const difference = Math.abs(radiationDose - optimalDose);
        
        let successChance = 100 - (difference * 12);
        successChance = Math.max(10, Math.min(98, Math.round(successChance)));

        let integrity = 100 - (radiationDose * 4.2);
        if (radiationDose > 9.5) integrity -= (radiationDose - 9) * 8;
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

        setSimulationResult({
          successChance,
          integrity,
          yieldBonus,
          traitName: traitDisplay,
          traitDetail,
          isLethal: integrity < 25,
          cobalt60Frequency: `${(1.2 + (radiationDose * 0.15)).toFixed(2)} Exahertz`,
          radiationAbsorptionFactor: `${Math.round(radiationDose * 124)} Gray/sec`
        });
      }

      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div id="gammagrow-lab-panel" className="flex-1 bg-zinc-950 text-zinc-100 overflow-y-auto pb-24 relative select-none">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="p-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Atom className="w-4 h-4 text-purple-400 animate-spin-slow" />
            <span>{tr('gammaEngineTitle', 'IAEA B-7 COMPLIANT MUTATION ENGINE')}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-zinc-100 mt-1">
            {tr('gammaTitle', 'GammaGrow Mutation Lab')}
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5 max-w-2xl">
            {tr('gammaDesc', 'Pioneering safe, controlled atomic mutation breeding')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-[#09090b] border border-zinc-900 text-[10.5px] font-mono text-emerald-400">
            {tr('cobaltSourceStatus', 'Cobalt-60 Source: NOMINAL (98.2%)')}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-20">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-6">
            <h3 className="text-sm font-mono font-bold text-zinc-250 uppercase flex items-center gap-2 mb-4">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              {tr('labSetup', '1. Laboratory Settings Setup')}
            </h3>

            <div>
              <label className="text-[10px] font-mono text-zinc-500 block uppercase mb-1.5">{tr('cropLabel', '1. TARGET NATIVE CROP')}</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                {NATIVE_SEEDS.map((seed) => (
                  <button
                    key={seed.id}
                    onClick={() => {
                       // if changing TO quinoa, set dose to 150 Gy.
                      if (seed.id === "quinoa" && activeSeedId !== "quinoa") {
                        setRadiationDose(150);
                      } 
                      // if changing FROM quinoa to generic, set dose to seed.baseDose kGy
                      else if (activeSeedId === "quinoa" && seed.id !== "quinoa") {
                        setRadiationDose(seed.baseDose);
                      }
                      // if changing between generic crops, also set dose to baseDose
                      else if (activeSeedId !== "quinoa" && seed.id !== "quinoa") {
                         setRadiationDose(seed.baseDose);
                      }
                      setActiveSeedId(seed.id);
                      setSimulationResult(null);
                      setQuinoaResult(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                      activeSeedId === seed.id
                        ? "bg-purple-950/30 border-purple-500 text-purple-300"
                        : "bg-zinc-950 border-zinc-805 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span className="font-semibold block">{seed.name}</span>
                    <span className="text-[9.5px] text-zinc-500 block font-mono mt-0.5">
                      {seed.id === "quinoa" ? `Model: Pasankalla` : `${tr('optDoseLabel', 'Optimal Dose')}: ${seed.baseDose} kGy`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="text-[10px] font-mono text-zinc-500 block uppercase mb-1.5">{tr('gammaTarget', 'MUTATION TRAIT OBJECTIVE')}</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => setTargetTrait("frost")} className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${targetTrait === "frost" ? "bg-purple-950/40 border-purple-500 text-purple-300" : "bg-zinc-950 border-zinc-805 hover:border-zinc-750"}`}>
                  {tr('frostResist', 'Frost Immunity')}
                </button>
                <button onClick={() => setTargetTrait("drought")} className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${targetTrait === "drought" ? "bg-purple-950/40 border-purple-500 text-purple-300" : "bg-zinc-950 border-zinc-805 hover:border-zinc-750"}`}>
                  {tr('droughtResist', 'Drought Resistance')}
                </button>
                <button onClick={() => setTargetTrait("salinity")} className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${targetTrait === "salinity" ? "bg-purple-950/40 border-purple-500 text-purple-300" : "bg-zinc-950 border-zinc-805 hover:border-zinc-750"}`}>
                  {tr('salinityResist', 'Salinity Exclusion')}
                </button>
                <button onClick={() => setTargetTrait("pest")} className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all cursor-pointer ${targetTrait === "pest" ? "bg-purple-950/40 border-purple-500 text-purple-300" : "bg-zinc-950 border-zinc-805 hover:border-zinc-750"}`}>
                  {tr('pestResist', 'Pest Resistance')}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-mono mb-2">
                <span className="text-zinc-500 uppercase">{isQuinoa ? tr('doseInGy', 'Dose in Gy') : tr('gammaDose', 'NUCLEAR RADIATION DOSE (kGy)')}</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max={isQuinoa ? "350" : "9999"}
                  step={isQuinoa ? "5" : "0.1"}
                  value={radiationDose}
                  onChange={(e) => setRadiationDose(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-805 hover:border-zinc-700 rounded px-3 py-2.5 text-purple-400 font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="absolute right-3 top-2.5 text-zinc-500 text-xs font-mono select-none">{isQuinoa ? "Gy" : "kGy"}</span>
              </div>
              
              {isQuinoa ? (
                <>
                  <button onClick={() => setRadiationDose(150)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono mt-1.5 underline block text-right w-full cursor-pointer">{tr('resetDose', 'Reset to 150 Gy')}</button>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-650 mt-1.5 uppercase">
                    <span>0 Gy (Control)</span>
                    <span>150 Gy ({tr('balancedMutationZone', 'Balanced')})</span>
                    <span>250+ Gy ({tr('highMutationDamage', 'High Damage')})</span>
                  </div>
                </>
              ) : (
                <>
                  {radiationDose < 0 || radiationDose > 50.0 ? (
                    <p className="text-[10px] text-red-500 font-mono mt-1">{tr('extremeDoseWarning', 'Extreme high dose detected! Reality breakdown imminent.')}</p>
                  ) : null}
                  <button onClick={() => setRadiationDose(selectedSeed.baseDose)} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono mt-1.5 underline block text-right w-full cursor-pointer">{tr('resetDose', 'Reset to Optimal Dose')}</button>
                  <div className="flex justify-between text-[8px] font-mono text-zinc-650 mt-1.5 uppercase">
                    <span>0 kGy ({tr('lowMut', 'Low mutation')})</span>
                    <span>{selectedSeed.baseDose} kGy ({tr('optimalLabel', 'Optimal')})</span>
                    <span>15+ kGy ({tr('lethalMut', 'Lethal Limit')})</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 flex gap-3 text-xs text-zinc-400">
              <Scale className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-zinc-350 font-semibold block uppercase">Nuclear Dosimetry Principle:</span>
                <p className="text-[11px] leading-relaxed mt-0.5 text-zinc-500">
                  {isQuinoa ? (
                    userMode === "basic" ? tr('quinoaDisclaimerBasic', 'This is a simulation based on experimental quinoa seed irradiation data. It helps guide decisions but does not replace field trials.') : tr('quinoaDisclaimerExpert', 'This model uses experimental dose-response data for quinoa cv. Pasankalla and piecewise linear interpolation. It is intended for educational and decision-support purposes and does not replace controlled laboratory or field validation.')
                  ) : (
                     radiationDose > 10 
                      ? "Warning: Doses exceeding 10 kGy severely damage native seed chromosomes, causing cell death (lethal mutations)." 
                      : "Optimal range: Cobalt-60 isotopic energy breaks specific chemical strings to accelerate natural adaptations without transgenic alterations."
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleSimulateMutation}
              disabled={isSimulating}
              className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-zinc-950 hover:scale-[1.01] active:scale-[0.99] font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-zinc-950 animate-pulse" />
              {isSimulating ? "BOMBARDEO ATÓMICO EN PROGRESO..." : tr('simulateMutation', 'SIMULATE RADIATION BREEDING')}
            </button>
          </div>

          <div className="p-4 bg-zinc-900/10 border border-zinc-870 rounded-xl text-[11px] text-zinc-500 italic leading-relaxed text-center">
            {tr('nuclearIsSafe', 'Safety Note: Gamma irradiation is a controlled, safe technology.')}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 flex flex-col justify-between h-[360px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 text-[8.5px] font-mono text-zinc-650 tracking-widest">
              {tr('chamberStatus', 'CHAMBER STATUS: READY')}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="absolute w-48 h-48 rounded-full border border-purple-500/15 flex items-center justify-center animate-spin-slow">
                <div className="w-36 h-36 rounded-full border border-indigo-500/25 flex items-center justify-center animate-spin-reverse-slow">
                  <div className="w-24 h-24 rounded-full border border-purple-500/40 flex items-center justify-center animate-pulse">
                    <Atom className={`w-8 h-8 text-purple-400 ${isSimulating ? 'animate-spin' : ''}`} />
                  </div>
                </div>
              </div>

              {isSimulating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-12 h-12 rounded-full border border-purple-400 opacity-80 animate-ping"></div>
                  <div className="absolute w-28 h-28 rounded-full border border-indigo-400 opacity-60 animate-ping delay-150"></div>
                  <div className="absolute w-44 h-44 rounded-full border border-purple-400 opacity-30 animate-ping delay-300"></div>
                </div>
              )}

              <div className="mt-4 opacity-90 text-center relative z-10">
                <div className="bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-500 block">{tr('irradiatingSample', 'IRRADIATING SAMPLE')}</span>
                  <strong className="text-zinc-200 text-sm font-semibold">{selectedSeed.name}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-zinc-900 pt-4 text-center">
              <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-850">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase block">{tr('freqUplink', 'FREQ UPLINK')}</span>
                <strong className="text-xs font-mono font-bold text-purple-400">
                  {isSimulating ? tr('scanning', 'SCANNING...') : "1.82 EXAHZ"}
                </strong>
              </div>
              <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-850">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase block">{tr('halflife', 'Cobalt-60 HalfLife')}</span>
                <strong className="text-xs font-mono font-bold text-zinc-300">5.27 {tr('years', 'years')}</strong>
              </div>
              <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-850">
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase block">{tr('mutationIndex', 'MUTATION INDEX')}</span>
                <strong className="text-xs font-mono font-bold text-emerald-400">{tr('safe', 'SAFE')}</strong>
              </div>
            </div>
          </div>

          {/* Quinoa Experimental Model Output */}
          {quinoaResult && isQuinoa && (
            <div className="bg-gradient-to-br from-purple-950/20 to-zinc-900/55 border border-purple-500/30 rounded-2xl p-6 animate-fade-in relative">
              <span className={`absolute -top-3 left-6 text-[9px] px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider shadow ${quinoaResult.classification.risk === 'Lethal' ? 'bg-red-900 text-red-200 border border-red-700/60' : 'bg-purple-900 text-purple-200 border border-purple-700/60'}`}>
                {quinoaResult.classification.risk === 'Lethal' ? tr('lethalZone', 'Lethal zone') : tr('seedImprovementRecommendation', 'Seed Improvement Recommendation')}
              </span>

              {userMode === "basic" ? (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">{quinoaResult.classification.basicMessage}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase mb-1">{tr('seedSurvivalCondition', 'Seed survival condition')}</span>
                      <strong className={`text-xl font-bold font-mono ${quinoaResult.growth.survivalPct < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {quinoaResult.growth.survivalPct}%
                      </strong>
                    </div>
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase mb-1">{tr('biologicalDamage', 'Biological damage')}</span>
                      <strong className={`text-xl font-bold font-mono ${quinoaResult.biologicalDamagePct > 50 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {quinoaResult.biologicalDamagePct}%
                      </strong>
                    </div>
                  </div>
                  <div className="bg-zinc-950/50 p-4 rounded-lg border border-zinc-850">
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase mb-1">{tr('usefulImprovementChance', 'Useful improvement chance')}</span>
                      <strong className="text-2xl font-bold font-mono text-purple-400">
                        {quinoaResult.usefulMutationProbabilityPct}%
                      </strong>
                  </div>

                  <div className="border-t border-zinc-900 pt-4 mt-2">
                    <button 
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="text-xs font-mono text-purple-400 hover:text-purple-300 transition-colors w-full text-left"
                    >
                      {showExplanation ? tr('hideScience', 'Hide Science') : tr('showScientificExplanation', 'Show scientific explanation')}
                    </button>

                    {showExplanation && (
                       <div className="mt-3 bg-zinc-950/80 p-3 rounded-lg border border-zinc-850 text-[10px] font-mono text-zinc-400 space-y-1.5 leading-relaxed">
                          <p><strong>{tr('doseInGy', 'Dose in Gy')}:</strong> {quinoaResult.doseGy} Gy</p>
                          <p><strong>{tr('equivalentInKGy', 'Equivalent in kGy')}:</strong> {quinoaResult.doseKGy} kGy</p>
                          <p><strong>{tr('germination7Days', 'Germination at 7 days')}:</strong> {quinoaResult.germination.day7Pct}%</p>
                          <p><strong>{tr('survival30Days', 'Survival at 30 days')}:</strong> {quinoaResult.growth.survivalPct}%</p>
                          <p><strong>{tr('rootLength', 'Root length')}:</strong> {quinoaResult.growth.rootLengthCm} cm</p>
                          <p><strong>{tr('seedlingHeight', 'Seedling height')}:</strong> {quinoaResult.growth.seedlingHeightCm} cm</p>
                          <p><strong>{tr('modelReference', 'Model reference')}:</strong> {quinoaResult.modelReference}</p>
                       </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="text-sm font-bold text-purple-300 uppercase">{tr('experimentalQuinoaModel', 'Experimental Quinoa Model')}</h4>
                     <span className={`text-[10px] px-2 py-1 rounded font-mono font-bold ${quinoaResult.classification.risk === 'Lethal' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {quinoaResult.classification.zone}
                     </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">{quinoaResult.classification.expertMessage}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-850 text-center">
                       <span className="text-[8px] font-mono text-zinc-500 block uppercase">{tr('doseInGy', 'Dose in Gy')}</span>
                       <strong className="text-sm font-bold font-mono text-zinc-200">{quinoaResult.doseGy} Gy</strong>
                       <p className="text-[8px] text-zinc-600 mt-1">{quinoaResult.doseKGy} kGy</p>
                    </div>
                    <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-850 text-center">
                       <span className="text-[8px] font-mono text-zinc-500 block uppercase">{tr('survival30Days', 'Survival at 30 days')}</span>
                       <strong className="text-sm font-bold font-mono text-emerald-400">{quinoaResult.growth.survivalPct}%</strong>
                    </div>
                     <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-850 text-center">
                       <span className="text-[8px] font-mono text-zinc-500 block uppercase">{tr('biologicalDamage', 'Biological damage')}</span>
                       <strong className="text-sm font-bold font-mono text-amber-400">{quinoaResult.biologicalDamagePct}%</strong>
                    </div>
                    <div className="bg-zinc-950/50 p-2 rounded-lg border border-zinc-850 text-center">
                       <span className="text-[8px] font-mono text-zinc-500 block uppercase">{tr('breedingUtilityIndex', 'Breeding Utility Index')}</span>
                       <strong className="text-sm font-bold font-mono text-purple-400">{quinoaResult.usefulMutationProbabilityPct}</strong>
                    </div>
                  </div>

                  <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-850 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] font-mono text-zinc-400">
                     <p>7d Germ: <span className="text-zinc-200">{quinoaResult.germination.day7Pct}%</span></p>
                     <p>15d Germ: <span className="text-zinc-200">{quinoaResult.germination.day15Pct}%</span></p>
                     <p>Root L: <span className="text-zinc-200">{quinoaResult.growth.rootLengthCm}cm</span></p>
                     <p>Seed L: <span className="text-zinc-200">{quinoaResult.growth.seedlingHeightCm}cm</span></p>
                  </div>

                  {/* Chart Replacement - Simplified table and SVG */}
                  <div className="mt-4 pt-4 border-t border-zinc-900 border-dashed grid grid-cols-1 gap-4">
                      <div>
                        <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase mb-2">{tr('experimentalPasankallaData', 'Experimental Pasankalla Quinoa Data')}</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[9px] font-mono text-zinc-400 border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-800 text-zinc-500">
                                <th className="py-1">Dose</th>
                                <th className="py-1">Germ 7d</th>
                                <th className="py-1">Root</th>
                                <th className="py-1">Survival</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className={`border-b border-zinc-800/50 ${radiationDose < 100 ? 'text-purple-400 font-bold bg-purple-900/10' : ''}`}>
                                <td className="py-1">0 Gy</td><td className="py-1">100%</td><td className="py-1">7.23 cm</td><td className="py-1">80%</td>
                              </tr>
                              <tr className={`border-b border-zinc-800/50 ${radiationDose >= 100 && radiationDose < 220 ? 'text-purple-400 font-bold bg-purple-900/10' : ''}`}>
                                <td className="py-1">150 Gy</td><td className="py-1">71%</td><td className="py-1">4.58 cm</td><td className="py-1">53%</td>
                              </tr>
                              <tr className={`border-b border-zinc-800/50 ${radiationDose >= 220 && radiationDose < 350 ? 'text-purple-400 font-bold bg-purple-900/10' : ''}`}>
                                <td className="py-1">250 Gy</td><td className="py-1">63%</td><td className="py-1">4.07 cm</td><td className="py-1">28%</td>
                              </tr>
                              <tr className={`${radiationDose >= 350 ? 'text-red-400 font-bold bg-red-900/10' : ''}`}>
                                <td className="py-1">350 Gy</td><td className="py-1">52%</td><td className="py-1">2.80 cm</td><td className="py-1">0%</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Lightweight SVG Chart: Dose vs Survival and Damage */}
                      <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 relative h-32 flex items-end justify-between px-6 pb-6 pt-8">
                        <span className="absolute top-2 left-3 text-[9px] font-mono text-zinc-500 uppercase">Dose vs Survival & Bio Damage (Gy)</span>
                        {[0, 150, 250, 350].map((doseTick) => {
                           const isCurrent = (doseTick === 0 && radiationDose < 100) || (doseTick === 150 && radiationDose >= 100 && radiationDose < 220) || (doseTick === 250 && radiationDose >= 220 && radiationDose < 350) || (doseTick === 350 && radiationDose >= 350);
                           // Approximation for graph heights
                           const survHeight = doseTick === 0 ? 80 : doseTick === 150 ? 53 : doseTick === 250 ? 28 : 0;
                           const dmgHeight = doseTick === 0 ? 0 : doseTick === 150 ? 30 : doseTick === 250 ? 55 : 100;
                           return (
                             <div key={doseTick} className="flex flex-col items-center gap-1 group relative">
                                <div className="flex items-end gap-1 h-[60px]">
                                   {/* Survival Bar */}
                                   <div style={{ height: `${survHeight}%` }} className={`w-3 rounded-t-sm ${isCurrent ? 'bg-emerald-400' : 'bg-emerald-900/50'}`}></div>
                                   {/* Damage Bar */}
                                   <div style={{ height: `${dmgHeight}%` }} className={`w-3 rounded-t-sm ${isCurrent ? 'bg-amber-400' : 'bg-amber-900/50'}`}></div>
                                </div>
                                <span className={`text-[9px] font-mono mt-2 ${isCurrent ? 'text-purple-400 font-bold' : 'text-zinc-600'}`}>{doseTick}</span>
                             </div>
                           );
                        })}
                      </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Regular Model Output */}
          {simulationResult && !isQuinoa && (
            <div className="bg-gradient-to-br from-purple-950/20 to-zinc-900/55 border border-purple-500/30 rounded-2xl p-6 animate-fade-in relative">
              <span className="absolute -top-3 left-6 bg-purple-900 text-purple-200 border border-purple-700/60 text-[9px] px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider shadow">
                {simulationResult.isLethal ? "LETHAL DAMAGE WARNING" : tr('mutationSuccess', 'NUCLEAR EPIGENETIC MUTATION DETECTED')}
              </span>

              {simulationResult.isLethal ? (
                <div className="space-y-4">
                  <div className="flex gap-3 text-red-400 items-start">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold">Lethal Dose Breakout Error</h4>
                      <p className="text-[11.5px] text-zinc-400 leading-normal mt-1">
                        A dose of {radiationDose} kGy caused high nuclear breakage. Cellular chromosome bonds collapsed under severe bombardment. Retarget low-energy levels.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex gap-4 items-start border-b border-zinc-900 pb-4">
                    <Dna className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-md font-bold text-white uppercase">{simulationResult.traitName}</h4>
                      <p className="text-xs text-zinc-400 leading-normal mt-1">
                        {simulationResult.traitDetail}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">MUTATION COEF</span>
                      <strong className="text-lg font-mono font-bold text-purple-400">{simulationResult.successChance}%</strong>
                    </div>
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-850">
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">CHROMOSOME INTEGRITY</span>
                      <strong className="text-lg font-mono font-bold text-cyan-400">{simulationResult.integrity}%</strong>
                    </div>
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-850 col-span-2 md:col-span-1">
                      <span className="text-[8px] font-mono text-zinc-500 block uppercase">YIELD MODIFIER</span>
                      <strong className="text-lg font-mono font-bold text-emerald-400">+{simulationResult.yieldBonus}%</strong>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-zinc-500 leading-normal flex items-start gap-1">
                    <span className="w-2 h-2 rounded bg-purple-500 mt-1 shrink-0"></span>
                    <span>
                      Mutant baseline ready to export. Quinoa-X agronomy server registered this molecular variety code: <strong className="text-zinc-300">QX-MUT-{activeSeedId.toUpperCase()}-{Math.floor(100+Math.random()*900)}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
