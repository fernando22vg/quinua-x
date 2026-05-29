import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import LandingView from "./components/LandingView";
import OverviewDashboard from "./components/OverviewDashboard";
import SatelliteMapView from "./components/SatelliteMapView";
import IsotopeExplorer from "./components/IsotopeExplorer";
import AgronomistAI from "./components/AgronomistAI";
import GammaGrowLab from "./components/GammaGrowLab";
import BasicDashboard from "./components/basic/BasicDashboard";
import { INITIAL_SECTORS } from "./data";
import { Sector, Message } from "./types";
import { Language, TRANSLATIONS, t } from "./translations";
import { Bot, User, Send, MessageSquare, X, RefreshCw, Globe, ShieldCheck } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedSectorId, setSelectedSectorId] = useState<number>(4); // Default to Sector 4 (Crisis sector)
  const [sectors, setSectors] = useState<Sector[]>(INITIAL_SECTORS);
  const [language, setLanguage] = useState<Language>("en");
  
  // Floating Q-AI Chat Interface State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInputValue, setChatInputValue] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [userMode, setUserMode] = useState<"basic" | "expert" | null>(null);
  const [showModeModal, setShowModeModal] = useState<boolean>(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("qx-user-mode");
    if (savedMode === "basic" || savedMode === "expert") {
      setUserMode(savedMode);
      setShowModeModal(false);
    } else {
      setShowModeModal(true);
    }
  }, []);

  const handleModeSelect = (mode: "basic" | "expert") => {
    setUserMode(mode);
    localStorage.setItem("qx-user-mode", mode);
    setShowModeModal(false);
    if (mode === "basic") {
      setCurrentPage("basic-dashboard");
    }
  };

  const handleResetMode = () => {
    localStorage.removeItem("qx-user-mode");
    setShowModeModal(true);
  };

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || sectors[0];
  const tr = (key: string, fallback?: string) => t(language, key, fallback);

  // Load welcome greeting on language swift
  useEffect(() => {
    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        content: TRANSLATIONS[language]?.qaiGreeting || "Authorized. Dynamic uplink secured with Q-AI Cognitive Node.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  // Handle scrolling of chat
  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatLoading, isChatOpen]);

  // Global action to deploy high frequency drift irrigation
  const handleDeployIrrigation = (sectorId: number) => {
    setSectors((prevSectors) =>
      prevSectors.map((s) => {
        if (s.id === sectorId) {
          return {
            ...s,
            moisture: 36, // Set to stable optimal range
            cropHealth: 92, // Revitalizes chloroplast bonds
            cropStatus: "OPTIMAL",
            alerts: s.alerts.filter((alert) => !alert.includes("IRRIGATION NEEDED"))
          };
        }
        return s;
      })
    );
  };

  // Adjust crop nutritional absorption variables
  const handleAdjustNutrition = (sectorId: number, adjustment: number) => {
    setSectors((prevSectors) =>
      prevSectors.map((s) => {
        if (s.id === sectorId) {
          const newN15 = s.nitrogen15 + adjustment;
          const newHealth = Math.min(100, Math.max(50, s.cropHealth + 6));
          return {
            ...s,
            nitrogen15: parseFloat(newN15.toFixed(1)),
            cropHealth: newHealth
          };
        }
        return s;
      })
    );
  };

  // Chat agent sync
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInputValue("");
    setIsChatLoading(true);

    try {
      const messagesPayload = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/agronomist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          soilConfig: {
            moisture: `${selectedSector.moisture}%`,
            d15N: `${selectedSector.nitrogen15}‰`,
            d18O: `${selectedSector.oxygen18}‰`,
            d2H: `${selectedSector.deuterium}‰`
          }
        })
      });

      if (!res.ok) {
        throw new Error("API Offline");
      }

      const data = await res.json();
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      // High intelligence simulated offline response depending on active languagues
      setTimeout(() => {
        let answer = "";
        const lower = text.toLowerCase();
        if (lower.includes("gamma") || lower.includes("radiación") || lower.includes("radiation") || lower.includes("mutation")) {
          answer = language === "en" ? "Gamma radiation uses safe Cobalt-60 isotopic energy to trigger specific mutations. Optimal doses of 4.5 kGy trigger deep drought-resistant adaptations." :
                   language === "es" ? "La irradiación gamma con Cobalto-60 induce mutaciones epigenéticas totalmente seguras que aumentan la dismutasa de superóxido, protegiendo las plantas de heladas severas." :
                   language === "ay" ? "Gamma radiation yatxatawix sumawa, janiw usunti mank'ar." :
                   "Гамма-излучение безопасно и не оставляет радиоактивных следов.";
        } else if (lower.includes("isotope") || lower.includes("isótopo") || lower.includes("15n") || lower.includes("18o")) {
          answer = language === "en" ? "Stable isotopes are non-radioactive natural signatures. Oxygen-18 tracks surface moisture evaporation while Nitrogen-15 detects trace bio-fertilizer absorption." :
                   language === "es" ? "Los isótopos estables son huellas naturales seguras. El Oxígeno-18 mide la evaporación improductiva mientras el Nitrógeno-15 valida la correcta digestión del abono." :
                   language === "ay" ? "Isótopos sumawa, uraq yatiyäwinak uñjaña." :
                   "Стабильные изотопы отслеживают влажность и усвоение удобрений.";
        } else {
          answer = language === "en" ? "Affirmative. I recommend executing a high-precision Nitrogen-15 soil trace sweep before adjusting municipal drip feeds. Soil salinity in Sector 2 is currently caution state." :
                   language === "es" ? "Afirmativo. Recomiendo calibrar la sonda de Deuterio antes del riego. En el Sector 4, la evaporación indica que el mulch biológico es necesario." :
                   language === "ay" ? "Suma. Sector 4 uñjaña." :
                   "Принято. Я рекомендую откалибровать зонд. Сектор 4 требует внимания.";
        }

        const assistantMsg: Message = {
          id: Math.random().toString(),
          role: "assistant",
          content: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }, 1000);
    } finally {
      setIsLoadingFalseDelayed();
    }
  };

  const setIsLoadingFalseDelayed = () => {
    setTimeout(() => {
      setIsChatLoading(false);
    }, 1100);
  };


  const activeAlertsList = sectors.flatMap((s) => s.alerts);
  const activeAlertsCount = activeAlertsList.length;

  return (
    <div className="flex bg-[#09090b] text-zinc-150 font-sans h-screen overflow-hidden relative">
      
      {/* Dynamic persistent global multi-language navbar flag layout */}
      <div className="fixed top-0 left-0 w-full z-55 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-850 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage("landing")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center font-bold text-sm tracking-tighter text-emerald-400">
                QX
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider text-zinc-100 uppercase">QUINOA-X</h1>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
          {/* Mode Switcher */}
          <div className="flex bg-zinc-900 shadow-sm border border-zinc-800 rounded-lg p-1 min-h-[44px] items-center space-x-1">
             <button 
                onClick={() => handleModeSelect("basic")}
                className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-colors ${userMode === 'basic' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                BASIC
              </button>
              <button 
                onClick={() => handleModeSelect("expert")}
                className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-colors ${userMode === 'expert' ? 'bg-purple-900/50 text-purple-400 border border-purple-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                EXPERT
              </button>
              <button 
                onClick={handleResetMode}
                className="px-2 py-1.5 rounded text-[11px] font-bold font-mono text-zinc-500 hover:text-red-400 border border-transparent hover:border-red-900/50 transition-colors ml-1"
                title="Show Mode Selector Again"
              >
                ↻ RESET
              </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-900 shadow-sm border border-zinc-800 rounded-lg px-3 py-2 min-h-[44px] hover:border-emerald-500 transition-colors w-full sm:w-auto justify-center">
            <Globe className="w-4 h-4 text-emerald-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs font-mono font-bold text-zinc-300 focus:outline-none cursor-pointer uppercase [&>option]:bg-zinc-900"
            >
              <option value="en">English 🇬🇧</option>
              <option value="es">Español 🇧🇴</option>
              <option value="ay">Aymara 🇧🇴</option>
              <option value="ru">Русский 🇷🇺</option>
            </select>
          </div>

          {/* Start Analysis Button */}
          <button
            onClick={() => setCurrentPage("overview")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 min-h-[44px] bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-zinc-950 font-mono text-xs font-bold px-4 rounded-lg shadow-sm transition-all cursor-pointer border border-emerald-400/50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="whitespace-nowrap">{tr('ctaEnter', 'START ANALYSIS')}</span>
          </button>

        </div>
      </div>

      {/* Interactive sidebar navigation core */}
      {currentPage !== "landing" && (
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          activeAlertsCount={activeAlertsCount}
          language={language}
          userMode={userMode}
        />
      )}

      {/* Primary viewport switch */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {currentPage === "landing" && (
          <LandingView onNavigate={setCurrentPage} language={language} setLanguage={setLanguage} userMode={userMode} setMode={handleModeSelect} />
        )}

        {currentPage === "basic-dashboard" && (
          <BasicDashboard language={language} />
        )}

        {currentPage === "overview" && (
          <OverviewDashboard
            sectors={sectors}
            onSelectSector={setSelectedSectorId}
            selectedSectorId={selectedSectorId}
            onDeployIrrigation={handleDeployIrrigation}
            activeAlerts={activeAlertsList}
            language={language}
          />
        )}

        {currentPage === "satellite" && (
          <SatelliteMapView
            sectors={sectors}
            onSelectSector={setSelectedSectorId}
            selectedSectorId={selectedSectorId}
            onDeployIrrigation={handleDeployIrrigation}
            onAdjustNutrition={handleAdjustNutrition}
            language={language}
          />
        )}

        {currentPage === "isotope" && (
          <IsotopeExplorer language={language} />
        )}

        {currentPage === "gamma-lab" && (
          <GammaGrowLab language={language} userMode={userMode || "basic"} />
        )}

        {currentPage === "ai-agronomist" && (
          <AgronomistAI currentSector={selectedSector} language={language} />
        )}
      </main>

      {/* Floating Action Quick Navigation bar */}
      {currentPage === "landing" && (
        <div className="fixed bottom-6 left-6 bg-zinc-950/90 border border-zinc-850 p-2 text-zinc-100 rounded-full flex gap-3 shadow-2xl z-50">
          <button
            onClick={() => setCurrentPage("overview")}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 font-bold text-xs text-zinc-950 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {tr('ctaEnter', 'ENTER')}
          </button>
        </div>
      )}

      {/* FLOATING AI CHAT ASSISTANT "Q-AI" WIDGET (Requirement 4) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-emerald-500 to-cyan-500 hover:rotate-12 transition-all duration-300 flex items-center justify-center text-zinc-950 shadow-2xl cursor-pointer ring-4 ring-zinc-950 group relative"
          >
            <MessageSquare className="w-6 h-6 fill-zinc-950 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 border border-zinc-950 flex items-center justify-center text-[8px] font-mono text-white animate-pulse">
              AI
            </span>
          </button>
        ) : (
          <div className="w-[360px] md:w-[420px] h-[550px] rounded-3xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-850 shadow-2xl flex flex-col justify-between overflow-hidden relative animate-fade-in ring-4 ring-zinc-950">
            {/* Holographic glowing borders */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-500 via-emerald-500 to-cyan-500"></div>

            {/* Chat Header */}
            <div className="p-4 bg-zinc-900/60 border-b border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-emerald-400 p-[1px]">
                  <div className="w-full h-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Q-AI Nucleus Core</h4>
                  <span className="text-[9px] font-mono text-cyan-400 block tracking-widest uppercase">multilingual active</span>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 px-2.5 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 hover:text-zinc-200 text-xs text-zinc-400 cursor-pointer transition-all flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-950/30">
              {chatMessages.map((msg) => {
                const isAI = msg.role === "assistant";
                return (
                  <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center border text-[11px] shrink-0
                      ${isAI ? "bg-purple-950/20 border-purple-900/30 text-purple-400" : "bg-zinc-900 border-zinc-800 text-zinc-350"}
                    `}>
                      {isAI ? "AI" : "U"}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed border
                      ${isAI ? "bg-zinc-900/40 border-zinc-900 text-zinc-300" : "bg-emerald-600 border-emerald-550 text-zinc-950 font-semibold"}
                    `}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span className="block text-[8px] font-mono text-zinc-550 text-right mt-1.5 leading-none">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex gap-2.5 mr-auto max-w-[80%] animate-pulse">
                  <div className="w-6 h-6 rounded-md bg-purple-950/20 border border-purple-900/30 text-purple-400 flex items-center justify-center text-[10px]">
                    ...
                  </div>
                  <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-2xl text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                    <span>Q-AI decrypting parameters...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Sugestion Quick Prompts */}
            <div className="px-4 pb-1 pt-2 bg-zinc-950/80 border-t border-zinc-900 flex gap-1.5 overflow-x-auto select-none no-scrollbar">
              <button
                onClick={() => handleSendChatMessage("Explain GammaGrow Breeding")}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-zinc-450 whitespace-nowrap cursor-pointer hover:text-emerald-400 border border-zinc-850"
              >
                ⚡ Gamma Mutation Lab
              </button>
              <button
                onClick={() => handleSendChatMessage("How do stable isotopes measure evaporation?")}
                className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-zinc-440 whitespace-nowrap cursor-pointer hover:text-cyan-400 border border-zinc-850"
              >
                🔬 Isotope Science
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage(chatInputValue);
              }}
              className="p-3 bg-zinc-900/50 border-t border-zinc-950 flex items-center gap-1.5"
            >
              <input
                type="text"
                value={chatInputValue}
                onChange={(e) => setChatInputValue(e.target.value)}
                placeholder={language === 'en' ? "Ask Q-AI about cobalt science or soils..." : language === 'es' ? "Pregunta sobre rayos gamma u oxígen-18..." : "Saisir la question agronomique..."}
                className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl px-3.5 py-2.5 text-xs text-zinc-150 placeholder-zinc-550 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInputValue.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-zinc-950 transition-colors cursor-pointer text-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* OVERLAY MODAL FOR FIRST LOAD (Requirement 1) */}
      {showModeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center p-[1px] mb-4">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-zinc-100 font-sans tracking-tight mb-2">Welcome to QUINOA-X</h2>
              <p className="text-zinc-400 text-sm">Do you have knowledge of nuclear technologies?</p>
            </div>

            <div className="space-y-4">
              {/* Option A */}
              <button 
                onClick={() => handleModeSelect("basic")}
                className="w-full text-left p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-emerald-950/30 hover:border-emerald-500/50 transition-all group flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold mb-1">A. Basic Mode</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">For farmers or general users. Simple language, easy inputs, practical agricultural recommendations.</p>
                </div>
              </button>

              {/* Option B */}
              <button 
                onClick={() => handleModeSelect("expert")}
                className="w-full text-left p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-purple-950/30 hover:border-purple-500/50 transition-all group flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-500/20">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-purple-400 font-bold mb-1">B. Expert Mode</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">For users with technical knowledge. Isotopes, gamma irradiation, thresholds, formulas and advanced parameters.</p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-[10px] text-zinc-600 font-mono">*You can change this later in the top navigation bar.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
