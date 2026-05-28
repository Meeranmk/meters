import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { ConversionMode } from './types';
import {
  metersToFeet,
  feetToMeters
} from './utils';

export default function App() {
  // Unit conversion mode: meters to feet or feet to meters
  const [mode, setMode] = useState<ConversionMode>('m_to_ft');

  // Input states stored as strings to allow natural typing
  const [metersInput, setMetersInput] = useState<string>('');
  const [feetInput, setFeetInput] = useState<string>('');

  // Interactive copy feedback feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Parse safety checks
  const parsedMeters = Math.max(0, parseFloat(metersInput) || 0);
  const parsedFeet = Math.max(0, parseFloat(feetInput) || 0);

  // Computed Values
  let finalMeters = 0;
  let finalFeet = 0;

  if (mode === 'm_to_ft') {
    finalMeters = parsedMeters;
    finalFeet = metersToFeet(parsedMeters);
  } else {
    finalMeters = feetToMeters(parsedFeet);
    finalFeet = parsedFeet;
  }

  // Helper adjustment triggers for responsive design
  const adjustMeters = (amount: number) => {
    const nextVal = Math.max(0, parsedMeters + amount);
    // Format to 2 decimal places to avoid float precision artifacts
    setMetersInput(parseFloat(nextVal.toFixed(2)).toString());
  };

  const adjustFeet = (amount: number) => {
    const nextVal = Math.max(0, parsedFeet + amount);
    // Format to 2 decimal places
    setFeetInput(parseFloat(nextVal.toFixed(2)).toString());
  };

  // Safe Mode Toggle inputs without losing general scale
  const toggleMode = () => {
    if (mode === 'm_to_ft') {
      if (!metersInput.trim()) {
        setFeetInput('');
      } else {
        const convertedFt = metersToFeet(parsedMeters);
        setFeetInput(convertedFt.toFixed(2));
      }
      setMode('ft_to_m');
    } else {
      if (!feetInput.trim()) {
        setMetersInput('');
      } else {
        const convertedMeters = feetToMeters(parsedFeet);
        setMetersInput(convertedMeters.toFixed(2));
      }
      setMode('m_to_ft');
    }
  };

  // Perform clipboard copy
  const handleCopyText = () => {
    if (!navigator.clipboard) return;
    const isEmpty = mode === 'm_to_ft' ? !metersInput.trim() : !feetInput.trim();
    if (isEmpty) return; // Don't copy empty states
    
    const txt = mode === 'm_to_ft'
      ? `${metersInput}m = ${finalFeet.toFixed(2)} ft`
      : `${feetInput} ft = ${finalMeters.toFixed(2)}m`;
    
    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Preset reset values to empty string
  const handleReset = () => {
    if (mode === 'm_to_ft') {
      setMetersInput('');
    } else {
      setFeetInput('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-start items-center p-0 select-none">
      
      {/* Upper Brand / Theme Header */}
      <nav className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 py-5 px-4 text-white shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-md mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Ruler className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-lg leading-tight tracking-tight">
                Meters to Feet
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Single Column Adaptive Container */}
      <main className="w-full max-w-md px-4 py-6 flex flex-col gap-4">

        {/* INPUT PANEL CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 relative">
          
          {/* Header Label inside Card */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Adjust Value
            </span>
            <button
              onClick={handleReset}
              id="mobile-reset-button"
              className="text-xs text-slate-400 hover:text-indigo-600 active:scale-95 transition-all flex items-center gap-1 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'm_to_ft' ? (
              <motion.div
                key="m_to_ft_controls"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="space-y-4"
              >
                {/* Meter Incrementor Box */}
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <button
                    onClick={() => adjustMeters(-0.1)}
                    className="w-12 h-12 bg-white active:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-2xs cursor-pointer select-none touch-manipulation"
                    id="dec-meters-btn"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 text-center relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={metersInput}
                      onChange={(e) => setMetersInput(e.target.value)}
                      className="w-full bg-transparent text-center text-3xl font-extrabold text-slate-900 border-none outline-hidden focus:ring-0 font-mono"
                      placeholder="0.00"
                      id="meters-mobile-input"
                    />
                    <div className="text-[10px] text-slate-400 font-bold block">METERS (m)</div>
                  </div>

                  <button
                    onClick={() => adjustMeters(0.1)}
                    className="w-12 h-12 bg-white active:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-2xs cursor-pointer select-none touch-manipulation"
                    id="inc-meters-btn"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ft_to_m_controls"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="space-y-4"
              >
                {/* Feet Incrementor Box */}
                <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
                  <button
                    onClick={() => adjustFeet(-0.1)}
                    className="w-12 h-12 bg-white active:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-2xs cursor-pointer select-none touch-manipulation"
                    id="dec-feet-btn"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 text-center relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={feetInput}
                      onChange={(e) => setFeetInput(e.target.value)}
                      className="w-full bg-transparent text-center text-3xl font-extrabold text-slate-900 border-none outline-hidden focus:ring-0 font-mono"
                      placeholder="0.00"
                      id="feet-mobile-input"
                    />
                    <div className="text-[10px] text-slate-400 font-bold block">FEET (ft)</div>
                  </div>

                  <button
                    onClick={() => adjustFeet(0.1)}
                    className="w-12 h-12 bg-white active:bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 border border-slate-200/60 shadow-2xs cursor-pointer select-none touch-manipulation"
                    id="inc-feet-btn"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* OUTPUT LIVE PREVIEW CONTAINER */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">
          
          {/* Subtle accent sphere */}
          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Label + Interactive Controls Bar */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Conversion Result
            </span>
            
            <button
              onClick={handleCopyText}
              id="mobile-copy-button"
              className="bg-white/5 hover:bg-white/10 active:scale-90 px-3 py-1.5 rounded-xl text-slate-350 border border-white/10 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold font-mono"
              title="Copy converted value"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div key="copied" className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </motion.div>
                ) : (
                  <motion.div key="copy" className="flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Copy</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Core Simple Result display */}
          <div className="my-2 relative z-10">
            {mode === 'm_to_ft' ? (
              <div className="flex flex-col gap-1">
                <div className="text-4xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-1.5">
                  <span>{!metersInput.trim() ? '—' : finalFeet.toFixed(2)}</span>
                  <span className="text-xl text-indigo-300 font-normal">feet</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  High precision: <span className="text-white font-semibold">{!metersInput.trim() ? '—' : `${finalFeet.toFixed(5)} ft`}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="text-4xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-1.5">
                  <span>{!feetInput.trim() ? '—' : finalMeters.toFixed(2)}</span>
                  <span className="text-xl text-indigo-300 font-normal">meters</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>High precision: <span className="text-white font-semibold">{!feetInput.trim() ? '—' : `${finalMeters.toFixed(5)} m`}</span></span>
                  <span>cm: <span className="text-white font-semibold">{!feetInput.trim() ? '—' : (finalMeters * 100).toFixed(1)}</span></span>
                  <span>mm: <span className="text-white font-semibold">{!feetInput.trim() ? '—' : (finalMeters * 1000).toFixed(0)}</span></span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* SWAP CONVERSION MODE BUTTON */}
        <button
          onClick={toggleMode}
          id="mobile-swap-mode-button"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-display font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all duration-150 cursor-pointer"
        >
          <ArrowRightLeft className="w-4 h-4 text-indigo-200" />
          <span>Switch to {mode === 'm_to_ft' ? 'Feet to Meters' : 'Meters to Feet'}</span>
        </button>

      </main>


      
    </div>
  );
}
