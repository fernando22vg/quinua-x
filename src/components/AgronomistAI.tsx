import React, { useState, useRef, useEffect } from "react";
import { Cpu, Send, RefreshCw, AlertCircle, Trash2, HelpCircle, User, Bot, Sparkles } from "lucide-react";
import { Message, Sector } from "../types";
import { Language, TRANSLATIONS } from "../translations";

interface AgronomistAIProps {
  currentSector: Sector;
  language: Language;
}

export default function AgronomistAI({ currentSector, language }: AgronomistAIProps) {
  const tr = (key: string, fallback?: string) => TRANSLATIONS[language]?.[key] || TRANSLATIONS["en"][key] || fallback || key;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: tr('qaiGreeting'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Command prompt presets
  const presetPrompts = [
    {
      id: "action-plan",
      label: tr('actionPlanLabel', 'Generate Farmer Action Plan'),
      prompt: `Generate a step-by-step agronomical farmer action plan including irrigation schedules and isotope mitigation strategies.`
    },
    {
      id: "sec4-crisis",
      label: tr('optSectorLabel', 'Optimize Evaporation (d18O)'),
      prompt: `Formulate an urgent agronomical protocol to minimize soil water evaporation based on d18O values of ${currentSector.oxygen18}‰ and low soil moisture of ${currentSector.moisture}%.`
    },
    {
      id: "n15-ratio",
      label: tr('valN15Label', 'Validate N15 Absorption'),
      prompt: `Analyze the delta 15N isotopic trace of ${currentSector.nitrogen15}‰. Is the plant actively absorbing custom fertilizer or leaching?`
    }
  ];

  const handleSendMessage = async (rawText: string) => {
    if (!rawText.trim() || isLoading) return;

    setApiError(null);
    const userMsg: Message = {
      id: Math.random().toString(),
      role: "user",
      content: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map existing messages to raw format required by /api/agronomist
      const messagesPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const useExternalAi = import.meta.env.VITE_ENABLE_EXTERNAL_AI !== 'false';

      if (!useExternalAi) {
        // Mock offline response
        const userText = userMsg.content.toLowerCase();
        let mockResponseText = "This is a simulated demo response. To use the real AI, enable VITE_ENABLE_EXTERNAL_AI and provide the GEMINI_API_KEY.";
        
        if (currentSector.crop?.toLowerCase().includes("quinoa") && userText.includes("gammagrow")) {
          // Check if user mode is passed somehow, or just output both or general
           mockResponseText = "(Demo Response) The quinoa seed improvement model uses experimental gamma irradiation data. It estimates survival, biological damage and useful improvement chance from the selected treatment level. You only need to select a simple treatment level; the scientific calculations happen behind the platform.";
        } else if (userText.includes("gammagrow")) {
           mockResponseText = "(Demo Response) The GammaGrow model for this crop is empirical. Experimental data is pending.";
        } else {
           mockResponseText = `(Demo Response) Based on the ${currentSector.name} profile, maintain moisture around ${currentSector.moisture}% and optimize nitrogen trace (d15N: ${currentSector.nitrogen15}‰).`;
        }

        setTimeout(() => {
          const assistantMsg: Message = {
            id: Math.random().toString(),
            role: "assistant",
            content: mockResponseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
        }, 1000);
        return;
      }

      const res = await fetch("/api/agronomist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesPayload,
          soilConfig: {
            moisture: `${currentSector.moisture}%`,
            d15N: `${currentSector.nitrogen15}‰`,
            d18O: `${currentSector.oxygen18}‰`,
            d2H: `${currentSector.deuterium}‰`
          }
        })
      });

      if (!res.ok) {
        throw new Error("Unable to establish communication with Quinoa-X full-stack agronomist API.");
      }

      const data = await res.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected error occurred during API communication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Cognitive core flushed. Telemetry systems restabilized with Altiplano Node QX-4. Please shoot any agronomic mass diagnostics.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setApiError(null);
  };

  return (
    <div className="flex-1 bg-zinc-950 text-zinc-100 flex flex-col h-screen overflow-hidden">
      
      {/* Module Title Bar */}
      <div className="p-6 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>{tr('aiModuleTitle', 'GEMINI COGNITIVE OPTIMIZER MODULE')}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white mt-1">
            {tr('aiTerminal', 'Isotopic AI Agronomist Terminal')}
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5 leading-relaxed">
            {tr('aiTerminalDesc', 'Real server-side AI evaluating Nitrogen-15, Oxygen-18 evaporation vectors, and crop anomalies.')}
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-805 hover:border-zinc-700 text-xs font-mono text-zinc-400 flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5 text-zinc-500" />
          {tr('flushTerminalLogs', 'FLUSH TERMINAL LOGS')}
        </button>
      </div>

      {/* Main chat body window */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        
        {/* Dynamic Sector Profile Sync Banner */}
        <div className="p-3.5 bg-zinc-900/40 border border-zinc-902 rounded-xl flex items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="font-mono text-xs text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>{tr('aiSectorLinked', 'AI Sector Feed Linked:')} <strong className="text-zinc-200">{currentSector.name}</strong></span>
          </div>
          <div className="flex gap-4 text-[11px] font-mono text-zinc-500">
            <span>Moisture: <strong className="text-emerald-400">{currentSector.moisture}%</strong></span>
            <span>d15N: <strong className="text-cyan-400">{currentSector.nitrogen15 >= 0 ? "+" : ""}{currentSector.nitrogen15}‰</strong></span>
          </div>
        </div>

        {/* Message elements */}
        <div className="max-w-4xl mx-auto space-y-4 pt-4">
          {messages.map((m) => {
            const isAI = m.role === "assistant";
            return (
              <div 
                key={m.id} 
                className={`flex gap-3 max-w-3xl ${isAI ? "mr-auto" : "ml-auto flex-row-reverse"}`}
              >
                {/* Agent User avatar placeholder display */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border
                  ${isAI 
                    ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-400" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-300"
                  }
                `}>
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl p-4 md:p-5 border text-[13px] leading-relaxed
                  ${isAI 
                    ? "bg-[#09090b]/80 border-zinc-900/80 text-zinc-300" 
                    : "bg-emerald-600 border-emerald-550 text-zinc-950 font-medium"
                  }
                `}>
                  <div className="whitespace-pre-wrap font-sans">
                    {m.content}
                  </div>
                  
                  <span className={`block text-[9px] font-mono mt-3 text-right leading-none
                    ${isAI ? "text-zinc-550" : "text-emerald-900"}
                  `}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Loader indicator while generating */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#09090b]/80 border border-zinc-900/80 rounded-2xl p-4 text-[13px] font-mono text-zinc-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>{tr('aiGenerating', 'Generating agronomical evaluation dispatch from isotopic ratios...')}</span>
              </div>
            </div>
          )}

          {/* Errors feed if exists */}
          {apiError && (
            <div className="p-3 bg-red-950/20 border border-red-900 text-xs font-mono text-red-400 rounded-xl max-w-4xl mx-auto flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

      </div>

      {/* Inputs panel & Preset Prompts */}
      <div className="p-6 border-t border-zinc-900 bg-zinc-950/90 gap-4 shrink-0">
        
        {/* Preset list on header rail */}
        <div className="max-w-4xl mx-auto mb-4">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 px-1">
            {tr('rapidDiagnostics', 'Rapid Diagnostic Commands')}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {presetPrompts.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSendMessage(preset.prompt)}
                theme="neutral"
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 hover:text-emerald-400 border border-zinc-900 text-[10.5px] font-mono text-zinc-400 cursor-pointer text-left transition-all max-w-xs md:max-w-md truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary chat field input */}
        <div className="max-w-4xl mx-auto">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="relative flex items-center bg-[#09090b] rounded-xl border border-zinc-900"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={tr('askQuinoaX', 'Ask Quinoa-X Agronomist AI about isotopic metrics or Altiplano crops stress...')}
              className="w-full bg-transparent px-4 py-4 text-sm text-zinc-100 placeholder-zinc-550 border-0 outline-none pr-12 focus:ring-1 focus:ring-emerald-500 rounded-xl"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className={`absolute right-3 p-2 rounded-lg transition-all cursor-pointer
                ${inputValue.trim() && !isLoading
                  ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                  : "bg-zinc-900 text-zinc-650 cursor-not-allowed"
                }
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-zinc-500 font-mono text-center">
            {tr('poweredByGemini', '*Powered by high-precision Gemini. Exclusively localized to Altiplano agro-technical sectors.')}
          </div>
        </div>

      </div>

    </div>
  );
}
