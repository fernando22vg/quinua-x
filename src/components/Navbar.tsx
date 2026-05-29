import React, { useState } from "react";
import { Language, TRANSLATIONS, t } from "../translations";
import { Menu, X, Globe, ShieldCheck, MapPin } from "lucide-react";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userMode: "basic" | "expert" | null;
  handleModeSelect: (mode: "basic" | "expert") => void;
  handleResetMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeAlertsCount: number;
}

export default function Navbar({
  currentPage,
  setCurrentPage,
  userMode,
  handleModeSelect,
  handleResetMode,
  language,
  setLanguage,
  activeAlertsCount
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tr = (key: string, fallback?: string) => t(language, key, fallback);

  const expertItems = [
    { id: "landing", label: tr('navHome', 'Home') },
    { id: "overview", label: tr('navDashboard', 'Dashboard') },
    { id: "isotope", label: tr('navScience', 'Soil & Water') },
    { id: "gamma-lab", label: tr('jathaLab', 'Jatha Lab') },
    { id: "satellite", label: tr('navMap', 'Map') },
    { id: "ai-agronomist", label: tr('navQai', 'Q-AI') }
  ];

  const basicItems = [
    { id: "landing", label: tr('navHome', 'Home') },
    { id: "basic-dashboard", label: tr('navMyField', 'My Field') },
    { id: "gamma-lab", label: tr('jathaLab', 'Jatha Lab') },
    { id: "ai-agronomist", label: tr('navAskQai', 'Ask Q-AI') }
  ];

  const menuItems = userMode === "basic" ? basicItems : expertItems;

  const navigate = (id: string) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  
  const isBasic = userMode === "basic" || currentPage === "landing";
  const navBg = isBasic ? "bg-[#F8F4EA]" : "bg-[#102033]";
  const navBorder = isBasic ? "border-[#B85C38]/20" : "border-[#17273D]";
  const textColor = isBasic ? "text-[#1F2933]" : "text-[#F8FAFC]";
  const mutedTextColor = isBasic ? "text-[#52616B]" : "text-[#EFE3C8]";
  const hoverBg = isBasic ? "hover:bg-[#D9A441]/10" : "hover:bg-[#D9A441]/5";
  const activeText = "text-[#D9A441]";
  const activeBg = "bg-[#D9A441]/10";
  const underlineColor = "bg-[#D9A441]";
  const inputBg = isBasic ? "bg-[#FFFFFF]" : "bg-[#102033]";
  const inputBorder = isBasic ? "border-[#B85C38]/20" : "border-[#2F80A8]";

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${navBg} border-b ${navBorder} shadow-md transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* LEFT: Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => navigate("landing")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3F7D4A] to-[#2F80A8] flex items-center justify-center p-[1px] shadow-sm">
              <div className={`w-full h-full ${isBasic ? 'bg-[#F8F4EA]' : 'bg-[#102033]'} rounded-[10px] flex items-center justify-center font-bold text-lg tracking-tighter text-[#3F7D4A]`}>
                QX
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-sm font-bold tracking-wider ${textColor} uppercase`}>QUINOA-X</h1>
              <span className={`text-[10px] font-mono ${isBasic ? 'text-[#3F7D4A]' : 'text-[#2F80A8]'} uppercase tracking-widest leading-none block pt-0.5`}>Atomic Agriculture Intelligence</span>
            </div>
          </div>

          {/* CENTER: Navigation (Desktop) */}
          <div className="hidden xl:flex items-center space-x-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                  currentPage === item.id 
                    ? `${activeText} ${activeBg}` 
                    : `${mutedTextColor} hover:text-[#D9A441] ${hoverBg}`
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className={`absolute bottom-0 left-2 right-2 h-[2px] ${underlineColor} rounded-t-sm fade-in`} />
                )}
                {item.id === "overview" && activeAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#B13A2E] text-[9px] font-bold text-white shadow-sm">
                    {activeAlertsCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* RIGHT: Controls (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            {/* Mode Selector */}
            <div className={`flex ${isBasic ? 'bg-[#FFFFFF] border-[#D9A441]' : 'bg-[#17273D] border-[#D9A441]/30'} border rounded-lg p-1 items-center`}>
               <button 
                  onClick={() => handleModeSelect("basic")}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-colors ${userMode === 'basic' ? 'bg-[#D9A441] text-[#102033]' : `${mutedTextColor} hover:text-[#D9A441]`}`}
                >
                  BASIC
                </button>
                <button 
                  onClick={() => handleModeSelect("expert")}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold font-mono transition-colors ${userMode === 'expert' ? 'bg-[#D9A441] text-[#102033]' : `${mutedTextColor} hover:text-[#D9A441]`}`}
                >
                  EXPERT
                </button>
            </div>

            {/* Language Selector */}
            <div className={`flex items-center gap-1.5 ${inputBg} border ${inputBorder} rounded-lg px-2 py-1.5 hover:border-[#D9A441] transition-colors cursor-pointer group`}>
              <Globe className="w-4 h-4 text-[#3F7D4A] group-hover:text-[#D9A441] transition-colors" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={`bg-transparent text-xs font-mono font-bold ${textColor} focus:outline-none cursor-pointer uppercase [&>option]:bg-[#F8F4EA] [&>option]:text-[#1F2933]`}
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="ay">AY</option>
                <option value="ru">RU</option>
              </select>
            </div>

            {/* GPS Button */}
            <button
               onClick={() => navigate("satellite")}
               className="p-2 bg-[#2F80A8] hover:bg-[#A7D8DE] border border-[#2F80A8] rounded-lg text-white transition-colors group"
               title="GPS / Map"
            >
               <MapPin className="w-4 h-4 text-white group-hover:text-[#102033]" />
            </button>

            {/* Start Analysis Button */}
            <button
              onClick={() => navigate(userMode === "basic" ? "basic-dashboard" : "overview")}
              className="flex items-center gap-1.5 bg-[#3F7D4A] hover:bg-[#20b56b] text-white font-mono text-xs font-bold px-4 py-2 rounded-lg transition-colors border border-[#D9A441]/50 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{tr('startAnalysis', 'START')}</span>
            </button>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden flex items-center">
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 ${textColor}`}>
               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className={`lg:hidden absolute top-[72px] left-0 w-full ${navBg} border-b ${navBorder} shadow-2xl pb-4 max-h-[calc(100vh-72px)] overflow-y-auto animate-slide-up origin-top`}>
           <div className="px-4 py-2 space-y-1">
             <div className={`text-[10px] ${mutedTextColor} font-mono tracking-wider uppercase mb-2 mt-2`}>Navigation</div>
             {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-between ${
                    currentPage === item.id 
                      ? `${activeText} ${activeBg}` 
                      : `${mutedTextColor} ${hoverBg} hover:text-[#D9A441]`
                  }`}
                >
                  {item.label}
                  {item.id === "overview" && activeAlertsCount > 0 && (
                    <span className="bg-[#B13A2E] text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
             ))}
           </div>
           
           <div className={`px-4 py-4 mt-2 border-t ${navBorder} grid gap-4`}>
              <div className={`text-[10px] ${mutedTextColor} font-mono tracking-wider uppercase`}>Mode & Settings</div>
              
              <div className={`flex ${isBasic ? 'bg-[#FFFFFF] border-[#D9A441]' : 'bg-[#17273D] border-[#D9A441]/30'} border rounded-lg p-1 min-h-[44px] items-center text-center`}>
                 <button 
                    onClick={() => { handleModeSelect("basic"); setMobileMenuOpen(false); }}
                    className={`flex-1 py-2 rounded text-xs font-bold font-mono transition-colors ${userMode === 'basic' ? 'bg-[#D9A441] text-[#102033]' : `${mutedTextColor} hover:text-[#D9A441]`}`}
                  >BASIC</button>
                  <button 
                    onClick={() => { handleModeSelect("expert"); setMobileMenuOpen(false); }}
                    className={`flex-1 py-2 rounded text-xs font-bold font-mono transition-colors ${userMode === 'expert' ? 'bg-[#D9A441] text-[#102033]' : `${mutedTextColor} hover:text-[#D9A441]`}`}
                  >EXPERT</button>
              </div>

               <div className="flex gap-2">
                 <div className={`flex-1 flex items-center justify-center gap-2 ${inputBg} border ${inputBorder} rounded-lg px-3 min-h-[44px] focus-within:border-[#D9A441]`}>
                    <Globe className="w-4 h-4 text-[#3F7D4A]" />
                    <select
                      value={language}
                      onChange={(e) => { setLanguage(e.target.value as any); setMobileMenuOpen(false); }}
                      className={`bg-transparent text-sm font-mono font-bold ${textColor} focus:outline-none w-full uppercase [&>option]:bg-[#F8F4EA] [&>option]:text-[#1F2933]`}
                    >
                      <option value="en">English (EN)</option>
                      <option value="es">Español (ES)</option>
                      <option value="ay">Aymara (AY)</option>
                      <option value="ru">Русский (RU)</option>
                    </select>
                 </div>
                 <button onClick={() => navigate("satellite")} className="w-[44px] bg-[#2F80A8] border border-[#2F80A8] rounded-lg flex items-center justify-center text-white hover:bg-[#A7D8DE]">
                    <MapPin className="w-5 h-5 text-white" />
                 </button>
               </div>

               <div className="grid grid-cols-1 gap-2 mt-2">
                  <button onClick={() => { navigate(userMode === "basic" ? "basic-dashboard" : "overview"); setMobileMenuOpen(false); }} className="min-h-[44px] flex items-center justify-center gap-1.5 bg-[#3F7D4A] hover:bg-[#20b56b] text-white font-mono text-xs font-bold rounded-lg px-2 tracking-wide border border-[#D9A441]/50 shadow-sm">
                    <ShieldCheck className="w-4 h-4" /> START
                  </button>
               </div>
           </div>
        </div>
      )}
    </nav>
  );

}
