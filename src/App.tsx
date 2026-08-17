import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Ruler,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  History,
  Trash2
} from 'lucide-react';
import { ConversionMode, HistoryItem } from './types';
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

  // Interactive copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Precision level state (2, 3, or 4 decimals)
  const [precision, setPrecision] = useState<number>(2);

  // History state loaded from localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('meterfeet_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });



  useEffect(() => {
    try {
      localStorage.setItem('meterfeet_history', JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }, [history]);

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

  // Helper adjustment triggers
  const adjustMeters = (amount: number) => {
    const nextVal = Math.max(0, parsedMeters + amount);
    setMetersInput(parseFloat(nextVal.toFixed(precision)).toString());
  };

  const adjustFeet = (amount: number) => {
    const nextVal = Math.max(0, parsedFeet + amount);
    setFeetInput(parseFloat(nextVal.toFixed(precision)).toString());
  };

  // Safe Mode Toggle
  const toggleMode = () => {
    if (mode === 'm_to_ft') {
      if (!metersInput.trim()) {
        setFeetInput('');
      } else {
        const convertedFt = metersToFeet(parsedMeters);
        setFeetInput(convertedFt.toFixed(precision));
      }
      setMode('ft_to_m');
    } else {
      if (!feetInput.trim()) {
        setMetersInput('');
      } else {
        const convertedMeters = feetToMeters(parsedFeet);
        setMetersInput(convertedMeters.toFixed(precision));
      }
      setMode('m_to_ft');
    }
  };

  // Save current conversion to history
  const saveToHistory = (fromVal: string, fromUnit: string, toVal: string, toUnit: string) => {
    if (!fromVal.trim() || parseFloat(fromVal) <= 0) return;
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromValue: fromVal,
      fromUnit,
      toValue: toVal,
      toUnit
    };
    setHistory(prev => [newItem, ...prev.slice(0, 9)]);
  };

  // Perform clipboard copy & store history
  const handleCopyText = () => {
    if (!navigator.clipboard) return;
    const isEmpty = mode === 'm_to_ft' ? !metersInput.trim() : !feetInput.trim();
    if (isEmpty) return;

    const fromVal = mode === 'm_to_ft' ? metersInput : feetInput;
    const fromUnit = mode === 'm_to_ft' ? 'm' : 'ft';
    const toVal = mode === 'm_to_ft' ? finalFeet.toFixed(precision) : finalMeters.toFixed(precision);
    const toUnit = mode === 'm_to_ft' ? 'ft' : 'm';

    const txt = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;

    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      saveToHistory(fromVal, fromUnit, toVal, toUnit);
    });
  };

  const handleReset = () => {
    if (mode === 'm_to_ft') {
      setMetersInput('');
    } else {
      setFeetInput('');
    }
  };

  const applyPreset = (val: number) => {
    if (mode === 'm_to_ft') {
      setMetersInput(val.toString());
    } else {
      setFeetInput(val.toString());
    }
  };



  const presets = mode === 'm_to_ft' ? [1, 2, 5, 10, 50, 100] : [1, 3, 6, 10, 50, 100];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-start items-center p-0 select-none font-sans">

      {/* Navigation Header */}
      <nav className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 py-4 px-4 text-white shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Ruler className="w-5 h-5 text-indigo-100" />
            </div>
            <div className="text-left">
              <h1 className="font-display font-black text-lg leading-tight tracking-tight">
                Meters ⇄ Feet
              </h1>
              <span className="text-[10px] text-indigo-200 block font-mono">v7.0.0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Single Column Adaptive Container */}
      <main className="w-full max-w-md px-4 py-5 flex flex-col gap-4">

        {/* INPUT PANEL CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 relative">

          {/* Header Label inside Card */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Adjust Value ({mode === 'm_to_ft' ? 'Meters' : 'Feet'})
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
                      className="w-full bg-transparent text-center text-3xl font-extrabold text-slate-900 border-none outline-none focus:ring-0 font-mono"
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
                      className="w-full bg-transparent text-center text-3xl font-extrabold text-slate-900 border-none outline-none focus:ring-0 font-mono"
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

          {/* Quick Presets Row */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block mb-2 font-mono">QUICK PRESETS</span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-600 font-mono transition-all active:scale-95 cursor-pointer"
                >
                  {p}{mode === 'm_to_ft' ? 'm' : 'ft'}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* OUTPUT LIVE PREVIEW CONTAINER */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xs relative overflow-hidden">

          <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Conversion Result
            </span>

            <div className="flex items-center gap-2">
              {/* Precision selector */}
              <div className="flex items-center bg-white/10 rounded-lg p-0.5 text-[10px] font-mono text-slate-300">
                {[2, 3, 4].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrecision(p)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${precision === p ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'}`}
                  >
                    .{p}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyText}
                id="mobile-copy-button"
                className="bg-white/10 hover:bg-white/20 active:scale-90 px-3 py-1.5 rounded-xl text-slate-200 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold font-mono"
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
          </div>

          <div className="my-2 relative z-10">
            {mode === 'm_to_ft' ? (
              <div className="flex flex-col gap-1">
                <div className="text-4xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-1.5">
                  <span>{!metersInput.trim() ? '—' : finalFeet.toFixed(precision)}</span>
                  <span className="text-xl text-indigo-300 font-normal">feet</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Exact: <span className="text-white font-semibold">{!metersInput.trim() ? '—' : `${finalFeet.toFixed(6)} ft`}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="text-4xl font-extrabold font-display tracking-tight text-white flex items-baseline gap-1.5">
                  <span>{!feetInput.trim() ? '—' : finalMeters.toFixed(precision)}</span>
                  <span className="text-xl text-indigo-300 font-normal">meters</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Exact: <span className="text-white font-semibold">{!feetInput.trim() ? '—' : `${finalMeters.toFixed(6)} m`}</span></span>
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

        {/* HISTORY LOG CARD */}
        {history.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                Recent History
              </span>
              <button
                onClick={() => setHistory([])}
                className="text-[10px] text-red-500 hover:text-red-600 font-mono flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 border border-slate-100 hover:border-indigo-200 transition-all"
                >
                  <div>
                    <span className="font-semibold">{item.fromValue} {item.fromUnit}</span>
                    <span className="text-slate-400 mx-1.5">→</span>
                    <span className="text-indigo-600 font-bold">{item.toValue} {item.toUnit}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>



    </div>
  );
}

