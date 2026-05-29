import React, { useState } from "react";
import { 
  Sprout, Droplets, Map, Sun, AlertTriangle, CheckCircle2, FlaskConical, MapPin
} from "lucide-react";
import { Language, TRANSLATIONS, t } from "../../translations";

interface BasicDashboardProps {
  language: Language;
}

export default function BasicDashboard({ language }: BasicDashboardProps) {
  const tr = (key: string, fallback?: string) => t(language, key, fallback);

  // Field Data
  const [basicLocation, setBasicLocation] = useState<string>("La Paz");
  const [basicArea, setBasicArea] = useState<number>(1);
  const [basicAreaType, setBasicAreaType] = useState<string>("hectares");
  const [selectedCrop, setSelectedCrop] = useState<string>("quinoa");
  const [basicIrrigationMethod, setBasicIrrigationMethod] = useState<string>("rainfed only");

  // Condition Data
  const [basicSoilCond, setBasicSoilCond] = useState<string>("normal");
  const [basicIrrigation, setBasicIrrigation] = useState<string>("more than 1 week ago");
  const [basicCropCond, setBasicCropCond] = useState<string>("healthy green");
  const [basicWeather, setBasicWeather] = useState<string>("very hot");
  const [basicProblem, setBasicProblem] = useState<string>("none");

  // Fertilizer Data
  const [fertilizerType, setFertilizerType] = useState<string>("organic");
  const [basicFertAmount, setBasicFertAmount] = useState<string>("normal");

  // Explanation state for Basic Mode
  const [showExplanationId, setShowExplanationId] = useState<string | null>(null);

  // Quote Engine State
  const [inputArea, setInputArea] = useState<number>(25);
  const [areaUnit, setAreaUnit] = useState<string>("hectares");
  const [trialFrequency, setTrialFrequency] = useState<string>("seasonal");

  const getHectaresValue = (area: number, unit: string) => {
    switch (unit) {
      case "hectares": return area;
      case "sqmeters": return area / 10000;
      case "acres": return area * 0.404686;
      default: return area;
    }
  };

  const calculateTrialQuote = () => {
    const currentHectares = getHectaresValue(inputArea, areaUnit);
    const testCostPerHectare = trialFrequency === "continuous" ? 28 : trialFrequency === "seasonal" ? 16 : 9;
    const satelliteGridFee = 120; // flat Copernicus Sentinel fee
    const subtotalUSD = (testCostPerHectare * currentHectares) + satelliteGridFee;
    const subtotalBOB = Math.round(subtotalUSD * 6.90);
    return {
      usd: subtotalUSD,
      bob: subtotalBOB
    };
  };

  const quote = calculateTrialQuote();

  return (
    <div className="flex-1 bg-white text-zinc-800 overflow-y-auto pb-24 relative select-none">
      <div className="p-6 border-b border-zinc-200 bg-white sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-emerald-800">
            {tr('myFieldAndRecommendations', 'My Field & Recommendations')}
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5 max-w-2xl">
            {tr('basicDashboardDesc', 'Simple field observations, powerful agricultural insights.')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-8 space-y-12 relative z-20">
        
        {/* Step 1: Tell us about your field */}
        <section>
          <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2 mb-4 border-b border-emerald-100 pb-2">
            <MapPin className="w-5 h-5" /> {tr('step1Field', 'Step 1: Tell us about your field')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('crop', 'Crop')}</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="quinoa">{tr('optQuinoa', 'Quinoa')}</option>
                <option value="potato">{tr('optPotato', 'Potato')}</option>
                <option value="tarwi">{tr('optTarwi', 'Tarwi')}</option>
                <option value="coffee">{tr('optCoffee', 'Coffee')}</option>
                <option value="corn">{tr('optCorn', 'Corn')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('location', 'Location')}</label>
              <select
                value={basicLocation}
                onChange={(e) => setBasicLocation(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="La Paz">{tr('optLaPaz', 'La Paz Suburbs')}</option>
                <option value="Oruro">{tr('optOruro', 'Oruro Meadowlands')}</option>
                <option value="Potosi">{tr('optPotosi', 'Uyuni Periphery (Potosí)')}</option>
                <option value="Cochabamba">{tr('optCocha', 'Cochabamba Valleys')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('landArea', 'Land Area')}</label>
              <div className="flex gap-2">
                 <input
                  type="number"
                  value={basicArea}
                  onChange={(e) => setBasicArea(parseFloat(e.target.value) || 1)}
                  className="w-1/2 bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
                />
                <select 
                  value={basicAreaType}
                  onChange={(e) => setBasicAreaType(e.target.value)}
                  className="w-1/2 bg-white border border-zinc-300 rounded-lg px-2 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
                >
                  <option value="hectares">{tr('optHectares', 'Hectares')}</option>
                  <option value="acres">{tr('optAcres', 'Acres')}</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('irrigationMethod', 'Irrigation Method')}</label>
              <select
                value={basicIrrigationMethod}
                onChange={(e) => setBasicIrrigationMethod(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                <option value="rainfed only">{tr('optRainfed', 'Rainfed Only')}</option>
                <option value="gravity">{tr('optGravity', 'Gravity / Furrow')}</option>
                <option value="sprinkler">{tr('optSprinkler', 'Sprinkler')}</option>
                <option value="drip">{tr('optDrip', 'Drip Irrigation')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 2: How is your field today? */}
        <section>
          <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-4 border-b border-blue-100 pb-2">
            <Sun className="w-5 h-5" /> {tr('step2Condition', 'Step 2: How is your field today?')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('soilCondition', 'Soil Condition')}</label>
              <select
                value={basicSoilCond}
                onChange={(e) => setBasicSoilCond(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="dry">{tr('optDry', 'Dry / Dusty')}</option>
                <option value="normal">{tr('optNormal', 'Normal')}</option>
                <option value="wet">{tr('optWet', 'Wet / Muddy')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('lastIrrigation', 'Last Rain / Irrigation')}</label>
              <select
                value={basicIrrigation}
                onChange={(e) => setBasicIrrigation(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="today">{tr('optToday', 'Today')}</option>
                <option value="yesterday">{tr('optYesterday', 'Yesterday')}</option>
                <option value="2-3 days ago">{tr('optDaysAgo', '2-3 days ago')}</option>
                <option value="more than 1 week ago">{tr('optWeekAgo', 'More than 1 week ago')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('currentWeather', 'Weather Observation')}</label>
              <select
                value={basicWeather}
                onChange={(e) => setBasicWeather(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="very hot">{tr('optHot', 'Very Hot / Sunny')}</option>
                <option value="windy">{tr('optWindy', 'Dry Wind')}</option>
                <option value="cold">{tr('optCold', 'Cold / Frost')}</option>
                <option value="cloudy">{tr('optCloudy', 'Cloudy / Mild')}</option>
              </select>
            </div>
            <div>
               <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('cropCondition', 'Visible Crop Condition')}</label>
              <select
                value={basicCropCond}
                onChange={(e) => setBasicCropCond(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="healthy green">{tr('optHealthy', 'Healthy Green')}</option>
                <option value="yellowing">{tr('optYellowing', 'Yellowing Leaves')}</option>
                <option value="wilting">{tr('optWilting', 'Wilting / Drooping')}</option>
                <option value="stunted">{tr('optStunted', 'Slow / Stunted Growth')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 3: Fertilizer and crop care */}
        <section>
          <h3 className="text-lg font-bold text-amber-700 flex items-center gap-2 mb-4 border-b border-amber-100 pb-2">
            <Sprout className="w-5 h-5" /> {tr('step3Fertilizer', 'Step 3: Fertilizer and crop care')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('fertilizerType', 'Fertilizer Type')}</label>
              <select
                value={fertilizerType}
                onChange={(e) => setFertilizerType(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
              >
                <option value="organic">{tr('optOrganic', 'Organic Compost / Manure')}</option>
                <option value="bio-slurry">{tr('optBioSlurry', 'Bio-slurry')}</option>
                <option value="synthetic">{tr('optSynthetic', 'Synthetic Chemical')}</option>
                <option value="none">{tr('optNone', 'None')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('mainProblem', 'Symptoms / Pests')}</label>
              <select
                value={basicProblem}
                onChange={(e) => setBasicProblem(e.target.value)}
                className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
              >
                <option value="none">{tr('optProblemNone', 'None observed')}</option>
                <option value="lack of water">{tr('optDrying', 'Drying out quickly')}</option>
                <option value="pests">{tr('optPests', 'Insects or Bugs')}</option>
                <option value="frost damage">{tr('optFrost', 'Frost bite')}</option>
              </select>
            </div>
          </div>
        </section>

        {/* Step 4: Your recommendation */}
        <section>
          <h3 className="text-xl font-bold text-zinc-800 flex items-center gap-2 mb-4 border-b border-zinc-200 pb-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> {tr('step4Recommendation', 'Step 4: Your Recommendation')}
          </h3>
          
          <div className="space-y-4">
            
            <div className="bg-white p-5 rounded-2xl border flex flex-col md:flex-row gap-6 shadow-sm border-emerald-100">
              <div className="flex-1 space-y-4">
                 <div>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4" /> {tr('waterCondition', 'Water Condition')}
                  </h4>
                  <div className={`p-4 rounded-xl border ${basicSoilCond === 'dry' ? 'bg-amber-50 border-amber-200' : basicSoilCond === 'wet' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className={`text-lg font-bold ${basicSoilCond === 'dry' ? 'text-amber-700' : basicSoilCond === 'wet' ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {basicSoilCond === 'dry' ? tr('highRiskEvaporation', 'High Risk - Fast Evaporation') : basicSoilCond === 'normal' ? tr('optimalHealthy', 'Optimal - Healthy') : tr('lowRiskHydrated', 'Low Risk - Well Hydrated')}
                    </div>
                    <p className="text-sm text-zinc-600 mt-1">
                      {basicSoilCond === 'dry' ? tr('waterActionDry', 'Soil is dry and losing moisture fast due to wind or heat. Irrigate as soon as possible.') : tr('waterActionNormal', 'Adequate water levels retained in the soil. Keep monitoring.')}
                    </p>
                    <button onClick={() => setShowExplanationId(showExplanationId === 'water' ? null : 'water')} className="text-xs mt-3 text-emerald-600 hover:text-emerald-800 font-medium underline">
                      {showExplanationId === 'water' ? tr('hideScience', 'Hide Science') : tr('showScientificExplanation', 'Show scientific explanation')}
                    </button>

                    {showExplanationId === 'water' && (
                      <div className="mt-3 p-3 bg-emerald-100/50 rounded text-xs font-mono text-emerald-900 border border-emerald-200">
                        <strong>Isotope Estimate:</strong> Oxygen-18 (δ18O) shows evaporation enrichment based on conditions.<br/>
                        <strong>Threshold Warning:</strong> Indicates potential failure of stomatal efficiency.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4" /> {tr('fertilizerUse', 'Fertilizer Use')}
                  </h4>
                   <div className={`p-4 rounded-xl border ${fertilizerType === 'synthetic' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div className={`text-lg font-bold ${fertilizerType === 'synthetic' ? 'text-red-700' : 'text-green-700'}`}>
                      {fertilizerType === 'organic' || fertilizerType === 'bio-slurry' ? tr('lowRiskFert', 'Low Risk: Good absorption.') : fertilizerType === 'synthetic' ? tr('highRiskFert', 'High Risk: Possible leaching.') : tr('noFert', 'No fertilizer detected.')}
                    </div>
                     <p className="text-sm text-zinc-600 mt-1">
                      {fertilizerType === 'synthetic' ? tr('fertActionSynth', 'Synthetic nutrients wash away easily in rain or heavy irrigation.') : tr('fertActionOrg', 'Organic matter helps the soil retain fertility longer.')}
                    </p>
                    <button onClick={() => setShowExplanationId(showExplanationId === 'fert' ? null : 'fert')} className="text-xs mt-3 text-amber-600 hover:text-amber-800 font-medium underline">
                        {showExplanationId === 'fert' ? tr('hideScience', 'Hide Science') : tr('showScientificExplanation', 'Show scientific explanation')}
                    </button>
                    {showExplanationId === 'fert' && (
                      <div className="mt-3 p-3 bg-amber-100/50 rounded text-xs font-mono text-amber-900 border border-amber-200">
                        <strong>Isotope Estimate:</strong> Nitrogen-15 (δ15N).<br/>
                        <strong>Model:</strong> N-Fertilizer Use Efficiency (FUE) indicates significant potential waste of synthetics.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div className="flex-1 space-y-4">
                 <div className="bg-zinc-800 text-white p-5 rounded-2xl shadow-md h-full flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                         <AlertTriangle className="w-5 h-5 text-amber-400" /> {tr('todaysActionPlan', 'Today\'s Action Plan')}
                      </h4>
                      <ul className="space-y-4">
                        <li className="flex gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                           <p className="text-sm leading-relaxed text-zinc-300">
                              Your <strong>{selectedCrop}</strong> in <strong>{basicLocation}</strong> needs attention based on the {basicWeather} weather.
                           </p>
                        </li>
                        <li className="flex gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                           <p className="text-sm leading-relaxed text-zinc-300">
                              {basicSoilCond === 'dry' ? 'The soil is drying rapidly. Schedule an irrigation cycle today to protect the roots.' : 'Soil moisture is stable. Wait before watering again to avoid root rot.'}
                           </p>
                        </li>
                        <li className="flex gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                           <p className="text-sm leading-relaxed text-zinc-300">
                             {basicProblem !== 'none' ? `For your issue with "${basicProblem}", please consult the Q-AI Assistant or your local cooperative.` : `Growth appears stable. Continue normal observation.`}
                           </p>
                        </li>
                      </ul>
                    </div>
                    
                 </div>
              </div>
            </div>

          </div>
        </section>

        {/* Cost Estimate Section */}
        <section className="bg-zinc-100 rounded-3xl p-6 border border-zinc-200 shadow-inner">
           <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-zinc-800">
            <FlaskConical className="w-6 h-6 text-zinc-500" /> {tr('costEstimate', 'Cost Estimate')}
          </h3>
          <p className="text-sm text-zinc-600 mb-6 max-w-2xl">
            Interested in obtaining absolute proof of your soil's health? Request an official laboratory isotope analysis for certification and advanced agronomy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('landArea', 'Land Area')}</label>
                <div className="flex gap-2">
                  <input
                    type="number" value={inputArea}
                    onChange={(e) => setInputArea(parseFloat(e.target.value) || 1)}
                    className="w-1/2 bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-500"
                  />
                  <select 
                    value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)}
                    className="w-1/2 bg-white border border-zinc-300 rounded-lg px-2 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-500"
                  >
                    <option value="hectares">{tr('optHectares', 'Hectares')}</option>
                    <option value="sqmeters">{tr('optMetersSq', 'Meters²')}</option>
                    <option value="acres">{tr('optAcres', 'Acres')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 block uppercase mb-1.5">{tr('frequency', 'Testing Frequency')}</label>
                <select
                  value={trialFrequency} onChange={(e) => setTrialFrequency(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2.5 text-zinc-800 focus:outline-none focus:border-zinc-500"
                >
                  <option value="once">{tr('optOnce', 'Once (Baseline only)')}</option>
                  <option value="seasonal">{tr('optSeasonal', 'Seasonal (3 milestones)')}</option>
                  <option value="continuous">{tr('optContinuous', 'Continuous (Every 2 months)')}</option>
                </select>
              </div>
               <div className="flex flex-col justify-end">
                <div className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-bold text-zinc-500 uppercase">{tr('estimatedCost', 'Estimated Cost')}</span>
                  <div className="text-right">
                    <strong className="text-2xl font-bold text-emerald-600">${quote.usd.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
          </div>
        </section>

      </div>
    </div>
  );
}
