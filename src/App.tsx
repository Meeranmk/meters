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
  Minus,
  Download,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { ConversionMode } from './types';
import {
  metersToFeet,
  feetToMeters
} from './utils';

const ICON_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#c7d2fe" stop-opacity="0.5" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="24" y="24" width="464" height="464" rx="92" fill="none" stroke="url(#accentGrad)" stroke-width="4" stroke-dasharray="16 12" opacity="0.4" />
  <g filter="url(#shadow)" transform="translate(64, 64)">
    <rect x="0" y="0" width="384" height="384" rx="64" fill="white" fill-opacity="0.08" stroke="white" stroke-opacity="0.15" stroke-width="2" />
    <line x1="48" y1="48" x2="48" y2="72" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
    <line x1="86" y1="48" x2="86" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="124" y1="48" x2="124" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="162" y1="48" x2="162" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="200" y1="48" x2="200" y2="76" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
    <line x1="238" y1="48" x2="238" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="276" y1="48" x2="276" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="314" y1="48" x2="314" y2="60" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.7" />
    <line x1="336" y1="48" x2="336" y2="72" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.9" />
    <g transform="translate(192, 202)">
      <text x="-70" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="-2">m</text>
      <text x="75" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="76" font-weight="900" fill="#a5b4fc" text-anchor="middle" letter-spacing="-2">ft</text>
      <g stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M -20 -18 L 22 -18" opacity="0.8" />
        <path d="M 10 -28 L 22 -18 L 10 -8" opacity="0.8" />
        <path d="M 20 22 L -22 22" opacity="0.9" stroke="#cbd5e1" />
        <path d="M -10 12 L -22 22 L -10 32" opacity="0.9" stroke="#cbd5e1" />
      </g>
    </g>
    <circle cx="192" cy="320" r="4" fill="#818cf8" opacity="0.8" />
    <circle cx="152" cy="320" r="2" fill="#818cf8" opacity="0.4" />
    <circle cx="232" cy="320" r="2" fill="#818cf8" opacity="0.4" />
  </g>
</svg>`;

const downloadPng = (size: number, filename: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  const svgBlob = new Blob([ICON_SVG_STRING], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, size, size);
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };
  img.src = url;
};

const generateMobileScreenshot = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Slate-50
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 320, 640);

  // Upper header gradient bar
  const grad = ctx.createLinearGradient(0, 0, 320, 0);
  grad.addColorStop(0, '#4f46e5');
  grad.addColorStop(1, '#6366f1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 320, 70);

  // App title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Meters ⇄ Feet', 160, 42);

  const drawRoundedRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    c.fill();
  };

  // Mock Box Input Card background
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.05)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  drawRoundedRect(ctx, 16, 96, 288, 140, 24);

  // Remove shadow for inner drawings
  ctx.shadowColor = 'transparent';

  // Inner card contents
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('ADJUST VALUE', 32, 124);

  // Inner Incrementor container
  ctx.fillStyle = '#f1f5f9';
  drawRoundedRect(ctx, 32, 140, 256, 76, 16);

  // Plus and minus icons mock
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('-', 52, 184);
  ctx.fillText('+', 250, 184);

  // Value typing text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'extrabold 28px monospace';
  ctx.fillText('5.00', 160, 174);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 9px sans-serif';
  ctx.fillText('METERS (m)', 160, 196);

  // Conversion Result Label & Output Card
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, 16, 256, 288, 145, 24);

  // Sparkle stars mock
  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('✦ CONVERSION RESULT', 36, 288);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px monospace';
  ctx.fillText('Copy', 240, 288);

  // Giant main result text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 36px -apple-system, sans-serif';
  ctx.fillText('16.40', 36, 336);

  ctx.fillStyle = '#818cf8';
  ctx.font = 'normal 18px -apple-system, sans-serif';
  ctx.fillText(' feet', 145, 336);

  // High precision text
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('High precision: 16.40420 ft', 36, 368);

  // Switch conversion button
  ctx.fillStyle = '#4f46e5';
  drawRoundedRect(ctx, 16, 420, 288, 54, 16);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⇄   Switch to Feet to Meters', 160, 452);

  // Bottom Visual ruler guideline
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(16, 520);
  ctx.lineTo(304, 520);
  ctx.stroke();

  // Tick marks
  for (let i = 20; i <= 300; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 520);
    ctx.lineTo(i, i % 40 === 0 ? 532 : 526);
    ctx.stroke();
  }

  // Visual text helper overlay
  ctx.fillStyle = '#4f46e5';
  ctx.font = 'bold 14px -apple-system, sans-serif';
  ctx.fillText('5m matches 16.4 feet', 160, 565);

  const pngUrl = canvas.toDataURL('image/png');
  const d = document.createElement('a');
  d.href = pngUrl;
  d.download = 'screenshot-mobile.png';
  document.body.appendChild(d);
  d.click();
  document.body.removeChild(d);
};

const generateDesktopScreenshot = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Slate-50
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 768);

  // Upper bar
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#4f46e5');
  grad.addColorStop(1, '#6366f1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 96);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Meters ⇄ Feet Converter', 64, 56);

  ctx.fillStyle = '#c7d2fe';
  ctx.font = 'normal 14px monospace';
  ctx.fillText('STANDALONE SECURE HIGH-PRECISION TOOL', 64, 80);

  const drawRoundedRect = (c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
    c.fill();
  };

  // 1. Input Box Card
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(15, 23, 42, 0.04)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 6;
  drawRoundedRect(ctx, 64, 160, 416, 260, 24);

  // 2. Output Box Card
  ctx.fillStyle = '#0f172a';
  drawRoundedRect(ctx, 544, 160, 416, 260, 24);

  ctx.shadowColor = 'transparent';

  // Inside input
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('METERS UNIT INPUT', 96, 204);

  ctx.fillStyle = '#f1f5f9';
  drawRoundedRect(ctx, 96, 224, 352, 100, 16);

  // Incrementor value
  ctx.fillStyle = '#0f172a';
  ctx.font = 'extrabold 36px monospace';
  ctx.fillText('10.00', 120, 286);
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('Meters (m)', 280, 284);

  // Inside output (Slate-900 card)
  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('✦ HIGH ACCURACY COMPUTED RESULT', 576, 204);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'extrabold 56px -apple-system, sans-serif';
  ctx.fillText('32.81', 576, 280);
  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'normal 24px -apple-system, sans-serif';
  ctx.fillText(' feet', 740, 280);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('Full precise float: 32.80840 ft', 576, 330);

  // Conversion switch block on bottom
  ctx.fillStyle = '#4f46e5';
  drawRoundedRect(ctx, 64, 460, 896, 70, 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Active conversion state: Meters to Feet (Click to reverse conversion model direction)', 512, 502);

  // Visual ruler graph representation in desktop
  ctx.textAlign = 'left';
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(64, 600);
  ctx.lineTo(960, 600);
  ctx.stroke();

  // Tick lines
  for (let i = 64; i <= 960; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 600);
    ctx.lineTo(i, (i - 64) % 128 === 0 ? 618 : 610);
    ctx.stroke();
    
    if ((i - 64) % 128 === 0) {
      ctx.fillStyle = '#475569';
      ctx.font = '10px monospace';
      ctx.fillText(`${(i - 64) / 64}m`, i - 8, 638);
    }
  }

  // Subtitle info
  ctx.fillStyle = '#64748b';
  ctx.font = 'normal 13px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Perfect precision conversion based on official ISO standards (1 meter = 3.280839895 feet)', 512, 690);

  const pngUrl = canvas.toDataURL('image/png');
  const d = document.createElement('a');
  d.href = pngUrl;
  d.download = 'screenshot-desktop.png';
  document.body.appendChild(d);
  d.click();
  document.body.removeChild(d);
};


export default function App() {
  // Unit conversion mode: meters to feet or feet to meters
  const [mode, setMode] = useState<ConversionMode>('m_to_ft');

  // Input states stored as strings to allow natural typing
  const [metersInput, setMetersInput] = useState<string>('');
  const [feetInput, setFeetInput] = useState<string>('');

  // Interactive copy feedback feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Toggle PWA Assets Generator Drawer
  const [showPwaTools, setShowPwaTools] = useState<boolean>(false);

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
                Meters ⇄ Feet
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

        {/* PWA PUBLISHER HELPER PANEL */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 overflow-hidden transition-all duration-200">
          <button
            onClick={() => setShowPwaTools(!showPwaTools)}
            className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-hidden"
          >
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  Play Store Publisher Kit
                </h3>
                <p className="text-[10px] text-slate-400 font-medium font-mono">PWABuilder Checklist Assets</p>
              </div>
            </div>
            {showPwaTools ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <AnimatePresence>
            {showPwaTools && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                  <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-100 text-[10.5px] text-amber-800 leading-relaxed font-sans flex gap-2.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-0.5 text-amber-900">Vercel & PWABuilder Real Assets Fix:</p>
                      We have auto-generated baseline icons on the server so your PWABuilder checks pass instantly! To update with real high-resolution matching assets, download these 4 files below, place them inside your <code className="bg-amber-100 py-0.5 px-1 rounded-sm font-semibold">public/</code> directory, and commit to GitHub.
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Size 192 Icon */}
                    <button
                      onClick={() => downloadPng(192, 'icon-192.png')}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 active:scale-95 text-left rounded-xl transition-all cursor-pointer flex flex-col justify-between h-20 group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <Smartphone className="w-4 h-4 text-indigo-500" />
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold text-slate-850">Launcher Icon</div>
                        <div className="text-[9px] font-medium text-slate-400 font-mono">192 × 192 px</div>
                      </div>
                    </button>

                    {/* Size 512 Icon */}
                    <button
                      onClick={() => downloadPng(512, 'icon-512.png')}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 active:scale-95 text-left rounded-xl transition-all cursor-pointer flex flex-col justify-between h-20 group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold text-slate-850">Store Play Icon</div>
                        <div className="text-[9px] font-medium text-slate-400 font-mono">512 × 512 px</div>
                      </div>
                    </button>

                    {/* Mobile Screenshot */}
                    <button
                      onClick={generateMobileScreenshot}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 active:scale-95 text-left rounded-xl transition-all cursor-pointer flex flex-col justify-between h-20 group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold text-slate-850">Mobile Frame</div>
                        <div className="text-[9px] font-medium text-slate-400 font-mono">320 × 640 px</div>
                      </div>
                    </button>

                    {/* Desktop Screenshot */}
                    <button
                      onClick={generateDesktopScreenshot}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 active:scale-95 text-left rounded-xl transition-all cursor-pointer flex flex-col justify-between h-20 group"
                    >
                      <div className="flex items-start justify-between w-full">
                        <Monitor className="w-4 h-4 text-emerald-500" />
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <div>
                        <div className="text-[10.5px] font-bold text-slate-850">Desktop View</div>
                        <div className="text-[9px] font-medium text-slate-400 font-mono">1024 × 768 px</div>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>


      
    </div>
  );
}
