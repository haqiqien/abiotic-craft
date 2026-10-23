import React, { useState, useEffect, useMemo } from 'react';
import {
  ELEMENTS,
  RECIPES,
  ELEMENT_MAP,
  INITIAL_UNLOCKED_IDS,
  TIER_LABELS,
  findRecipeResult,
  normalizeRecipeKey,
  AlchemyElement,
  ElementTier,
} from './data/alchemyData';
import { soundEngine } from './utils/soundEngine';
import { buildStandaloneHtmlFile } from './utils/standaloneHtmlBuilder';
import {
  Search,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Lightbulb,
  Code2,
  FlaskConical,
  X,
  ArrowRight,
  Lock,
  Layers,
  Flame,
  BarChart3,
} from 'lucide-react';

const STORAGE_KEY = 'alkimia_teknologi_save_v1';

type ActiveTab = 'play' | 'hints' | 'codex' | 'export';

interface SynthesisFeedback {
  type: 'idle' | 'new' | 'known' | 'fail';
  message: string;
  element?: AlchemyElement;
  recipeText?: string;
}

export default function App() {
  // Game State persisted in localStorage
  const [unlockedIds, setUnlockedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlocked) && parsed.unlocked.length >= 4) {
          return parsed.unlocked;
        }
      }
    } catch {
      // Fallback to initial
    }
    return [...INITIAL_UNLOCKED_IDS];
  });

  const [discoveredRecipes, setDiscoveredRecipes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.discoveredRecipes)) {
          return parsed.discoveredRecipes;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Track usage count per recipe key ("a+b=result")
  const [recipeUsageCounts, setRecipeUsageCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recipeUsageCounts && typeof parsed.recipeUsageCounts === 'object') {
          return parsed.recipeUsageCounts;
        }
      }
    } catch {
      // Fallback
    }
    return {};
  });

  const [recentlyUnlockedIds, setRecentlyUnlockedIds] = useState<string[]>([]);

  // Synthesis Altar State
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<'a' | 'b' | 'altar' | null>(null);
  const [feedback, setFeedback] = useState<SynthesisFeedback>({
    type: 'idle',
    message: 'Ketuk 2 elemen atau seret ke slot untuk mensintesis benda mati & teknologi baru.',
  });
  const [shakeKey, setShakeKey] = useState<number>(0);

  // Filters & Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('play');
  const [desktopSideTab, setDesktopSideTab] = useState<'hints' | 'codex' | 'export'>('hints');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<'all' | ElementTier>('all');
  const [hintTierFilter, setHintTierFilter] = useState<'all' | ElementTier>('all');
  const [onlyReadyHints, setOnlyReadyHints] = useState<boolean>(false);

  // Audio, Reset & Export states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);
  const [selectedCodexElement, setSelectedCodexElement] = useState<AlchemyElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          unlocked: unlockedIds,
          discoveredRecipes,
          recipeUsageCounts,
        })
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [unlockedIds, discoveredRecipes, recipeUsageCounts]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) soundEngine.playSelect();
  };

  // Evaluate combination whenever both slotA and slotB are populated
  const evaluateCombination = (idA: string, idB: string) => {
    const elA = ELEMENT_MAP[idA];
    const elB = ELEMENT_MAP[idB];
    if (!elA || !elB) return;

    const match = findRecipeResult(idA, idB);
    if (match) {
      const resultElement = ELEMENT_MAP[match.result];
      if (!resultElement) return;

      const isNewElement = !unlockedIds.includes(resultElement.id);
      const recipeCode = `${normalizeRecipeKey(idA, idB)}=${resultElement.id}`;

      // Increment usage frequency for this recipe
      setRecipeUsageCounts((prev) => ({
        ...prev,
        [recipeCode]: (prev[recipeCode] || 0) + 1,
      }));

      if (isNewElement) {
        soundEngine.playNewDiscovery();
        setUnlockedIds((prev) => [...prev, resultElement.id]);
        setRecentlyUnlockedIds((prev) => [
          resultElement.id,
          ...prev.filter((item) => item !== resultElement.id).slice(0, 5),
        ]);
        setFeedback({
          type: 'new',
          element: resultElement,
          recipeText: `${elA.emoji} ${elA.name} + ${elB.emoji} ${elB.name}`,
          message: `Penemuan Baru! ${resultElement.name} telah ditambahkan ke inventaris.`,
        });
      } else {
        soundEngine.playKnownCombine();
        setFeedback({
          type: 'known',
          element: resultElement,
          recipeText: `${elA.emoji} ${elA.name} + ${elB.emoji} ${elB.name}`,
          message: `Sintesis berhasil menghasilkan ${resultElement.name} (sudah ditemukan).`,
        });
      }

      if (!discoveredRecipes.includes(recipeCode)) {
        setDiscoveredRecipes((prev) => [recipeCode, ...prev]);
      }
    } else {
      soundEngine.playFail();
      setShakeKey((prev) => prev + 1);
      setFeedback({
        type: 'fail',
        recipeText: `${elA.emoji} ${elA.name} + ${elB.emoji} ${elB.name}`,
        message: `${elA.name} dan ${elB.name} tidak bereaksi. Coba kombinasi material lain.`,
      });
    }
  };

  // Handle tapping an element in inventory
  const handleSelectElement = (id: string) => {
    soundEngine.playSelect();
    if (!slotA) {
      setSlotA(id);
      setFeedback({
        type: 'idle',
        message: `${ELEMENT_MAP[id]?.name} masuk ke Bahan 1. Pilih Bahan 2 untuk menggabungkan.`,
      });
    } else if (!slotB) {
      setSlotB(id);
      evaluateCombination(slotA, id);
    } else {
      setSlotA(id);
      setSlotB(null);
      setFeedback({
        type: 'idle',
        message: `${ELEMENT_MAP[id]?.name} masuk ke Bahan 1. Pilih Bahan 2 untuk menggabungkan.`,
      });
    }
  };

  // Handle dropping an element onto a specific slot or the altar
  const handleDropElement = (id: string, target: 'a' | 'b' | 'altar') => {
    setDragOverSlot(null);
    if (!id || !ELEMENT_MAP[id]) return;

    if (target === 'a') {
      soundEngine.playSelect();
      setSlotA(id);
      if (slotB) {
        evaluateCombination(id, slotB);
      } else {
        setFeedback({
          type: 'idle',
          message: `${ELEMENT_MAP[id]?.name} ditempatkan di Bahan 1.`,
        });
      }
    } else if (target === 'b') {
      soundEngine.playSelect();
      setSlotB(id);
      if (slotA) {
        evaluateCombination(slotA, id);
      } else {
        setFeedback({
          type: 'idle',
          message: `${ELEMENT_MAP[id]?.name} ditempatkan di Bahan 2.`,
        });
      }
    } else {
      handleSelectElement(id);
    }
  };

  const handleClearSlots = () => {
    soundEngine.playClear();
    setSlotA(null);
    setSlotB(null);
    setFeedback({
      type: 'idle',
      message: 'Meja sintesis dikosongkan. Pilih 2 elemen untuk digabungkan.',
    });
  };

  const handleUseResultAsIngredient = (id: string) => {
    soundEngine.playSelect();
    setSlotA(id);
    setSlotB(null);
    setFeedback({
      type: 'idle',
      message: `${ELEMENT_MAP[id]?.name} siap di Bahan 1 untuk sintesis berjenjang berikutnya.`,
    });
  };

  const handleLoadHintIngredient = (ingredientId: string) => {
    soundEngine.playSelect();
    setSlotA(ingredientId);
    setSlotB(null);
    setActiveTab('play');
    setFeedback({
      type: 'idle',
      message: `Petunjuk dimuat: ${ELEMENT_MAP[ingredientId]?.name} di Bahan 1. Cari pasangan kombinasinya!`,
    });
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3500);
      return;
    }
    soundEngine.playClear();
    setUnlockedIds([...INITIAL_UNLOCKED_IDS]);
    setDiscoveredRecipes([]);
    setRecipeUsageCounts({});
    setRecentlyUnlockedIds([]);
    setSlotA(null);
    setSlotB(null);
    setConfirmReset(false);
    setFeedback({
      type: 'idle',
      message: 'Progres telah diatur ulang ke 4 elemen dasar (Air, Api, Tanah, Udara).',
    });
  };

  // Filtered unlocked elements for inventory
  const unlockedElements = useMemo(() => {
    return ELEMENTS.filter((el) => unlockedIds.includes(el.id))
      .filter((el) => tierFilter === 'all' || el.tier === tierFilter)
      .filter((el) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          el.name.toLowerCase().includes(q) ||
          el.category.toLowerCase().includes(q) ||
          el.description.toLowerCase().includes(q)
        );
      });
  }, [unlockedIds, tierFilter, searchQuery]);

  // Collection Statistics for the Summary Cards above Inventory
  const collectionStats = useMemo(() => {
    const tierBreakdown = ([0, 1, 2, 3, 4] as ElementTier[]).map((tier) => {
      const totalInTier = ELEMENTS.filter((e) => e.tier === tier).length;
      const unlockedInTier = ELEMENTS.filter(
        (e) => e.tier === tier && unlockedIds.includes(e.id)
      ).length;
      const pct = totalInTier > 0 ? Math.round((unlockedInTier / totalInTier) * 100) : 0;
      return { tier, totalInTier, unlockedInTier, pct };
    });

    // Highest tier reached
    let highestTier: ElementTier = 0;
    for (const id of unlockedIds) {
      const el = ELEMENT_MAP[id];
      if (el && el.tier > highestTier) {
        highestTier = el.tier;
      }
    }
    const highestTierData = tierBreakdown.find((t) => t.tier === highestTier)!;

    // Most frequently used recipe (fallback to most recently discovered recipe if counts are empty)
    let topRecipeInfo: {
      code: string;
      elA: AlchemyElement;
      elB: AlchemyElement;
      result: AlchemyElement;
      count: number;
      sharePct: number;
    } | null = null;

    const entries = Object.entries(recipeUsageCounts).filter(([, count]) => count > 0);
    const totalSyntheses = entries.reduce((acc, [, count]) => acc + count, 0);

    let bestCode: string | null = null;
    let bestCount = 0;

    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]);
      bestCode = entries[0][0];
      bestCount = entries[0][1];
    } else if (discoveredRecipes.length > 0) {
      bestCode = discoveredRecipes[0];
      bestCount = 1;
    }

    if (bestCode) {
      const [pairPart, resId] = bestCode.split('=');
      const [idA, idB] = (pairPart || '').split('+');
      const elA = ELEMENT_MAP[idA];
      const elB = ELEMENT_MAP[idB];
      const result = ELEMENT_MAP[resId];
      if (elA && elB && result) {
        topRecipeInfo = {
          code: bestCode,
          elA,
          elB,
          result,
          count: bestCount,
          sharePct:
            totalSyntheses > 0
              ? Math.min(100, Math.max(18, Math.round((bestCount / totalSyntheses) * 100)))
              : 100,
        };
      }
    }

    return {
      tierBreakdown,
      highestTier,
      highestTierData,
      topRecipeInfo,
      totalSyntheses,
    };
  }, [unlockedIds, recipeUsageCounts, discoveredRecipes]);

  // Locked Elements & 1-Ingredient Hint Resolver
  const lockedHints = useMemo(() => {
    const lockedTargets = ELEMENTS.filter((el) => !unlockedIds.includes(el.id)).filter(
      (el) => hintTierFilter === 'all' || el.tier === hintTierFilter
    );

    const mapped = lockedTargets.map((target) => {
      const targetRecipes = RECIPES.filter((r) => r.result === target.id);
      const bothUnlockedRecipe = targetRecipes.find(
        (r) => unlockedIds.includes(r.a) && unlockedIds.includes(r.b)
      );
      const oneUnlockedRecipe = targetRecipes.find(
        (r) => unlockedIds.includes(r.a) || unlockedIds.includes(r.b)
      );
      const chosenRecipe = bothUnlockedRecipe || oneUnlockedRecipe || targetRecipes[0];

      let knownIngredient: AlchemyElement | null = null;
      if (chosenRecipe) {
        if (unlockedIds.includes(chosenRecipe.a)) {
          knownIngredient = ELEMENT_MAP[chosenRecipe.a];
        } else if (unlockedIds.includes(chosenRecipe.b)) {
          knownIngredient = ELEMENT_MAP[chosenRecipe.b];
        }
      }

      const isCraftableNow = Boolean(bothUnlockedRecipe);

      return {
        target,
        knownIngredient,
        isCraftableNow,
      };
    });

    if (onlyReadyHints) {
      return mapped.filter((h) => h.knownIngredient !== null);
    }
    return mapped;
  }, [unlockedIds, hintTierFilter, onlyReadyHints]);

  // Standalone 1-file HTML code memo
  const standaloneHtmlCode = useMemo(() => buildStandaloneHtmlFile(), []);

  const handleCopyStandaloneHtml = async () => {
    try {
      await navigator.clipboard.writeText(standaloneHtmlCode);
      setCopiedHtml(true);
      soundEngine.playKnownCombine();
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadStandaloneHtml = () => {
    soundEngine.playNewDiscovery();
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alkimia-benda-mati-teknologi.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalElements = ELEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const progressPercentage = Math.round((unlockedCount / totalElements) * 100);

  // SVG Ring Constants
  const ringRadius = 18;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeDashoffset =
    ringCircumference - (progressPercentage / 100) * ringCircumference;

  const elemA = slotA ? ELEMENT_MAP[slotA] : null;
  const elemB = slotB ? ELEMENT_MAP[slotB] : null;

  return (
    <div className="min-h-dvh bg-[#0B0F19] text-slate-100 flex flex-col pb-16 lg:pb-0">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5 bg-[#111827]/95 backdrop-blur-md border-b border-white/[0.08]">
        {/* Zone 1: Brand Title (single text element) */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('play');
          }}
          className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Alkimia Benda Mati &amp; Teknologi
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveTab('play');
              setDesktopSideTab('hints');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'play' && desktopSideTab === 'hints' ? 'text-cyan-400 underline underline-offset-4' : ''
            }`}
          >
            Meja Sintesis
          </button>
          <button
            onClick={() => {
              setActiveTab('hints');
              setDesktopSideTab('hints');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'hints' ? 'text-cyan-400 underline underline-offset-4' : ''
            }`}
          >
            Buku Petunjuk
          </button>
          <button
            onClick={() => {
              setActiveTab('codex');
              setDesktopSideTab('codex');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              desktopSideTab === 'codex' ? 'text-cyan-400 underline underline-offset-4' : ''
            }`}
          >
            Ensiklopedia Material
          </button>
          <button
            onClick={() => {
              setActiveTab('export');
              setDesktopSideTab('export');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              desktopSideTab === 'export' ? 'text-cyan-400 underline underline-offset-4' : ''
            }`}
          >
            Kode 1-File HTML
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadStandaloneHtml}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh File HTML</span>
          </button>
        </div>
      </header>

      {/* Main Responsive Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Mobile-First Portrait Alchemy Game Frame */}
        <div
          className={`lg:col-span-7 xl:col-span-6 w-full max-w-[440px] lg:max-w-none mx-auto bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl ${
            activeTab !== 'play' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Sub-Header Status & Controls */}
          <div className="px-4 py-3.5 bg-slate-900/90 border-b border-white/[0.07]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono tabular-nums">
                <span className="font-semibold text-white">
                  {unlockedCount} / {totalElements} Elemen
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-400">{progressPercentage}% Selesai</span>
                <span aria-hidden="true">·</span>
                <span>{discoveredRecipes.length} Resep</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleSound}
                  aria-label={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
                  className="min-h-[38px] min-w-[38px] px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                </button>
                <button
                  onClick={handleResetProgress}
                  className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    confirmReset
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{confirmReset ? 'Konfirmasi Reset?' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* SYNTHESIS ALTAR (Tap or Drag & Drop) */}
          <div
            key={shakeKey}
            onDragOver={(e) => {
              e.preventDefault();
              if (!dragOverSlot) setDragOverSlot('altar');
            }}
            onDragLeave={() => setDragOverSlot(null)}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/plain');
              handleDropElement(id, 'altar');
            }}
            className={`p-4 m-3.5 rounded-2xl bg-[#0B0F19]/90 border transition-colors ${
              dragOverSlot === 'altar'
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-white/[0.08]'
            } ${feedback.type === 'fail' ? 'animate-shake' : ''}`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Meja Sintesis Material</span>
                <span aria-hidden="true">·</span>
                <span>100% Benda Mati &amp; Teknologi</span>
              </div>
              {(slotA || slotB) && (
                <button
                  onClick={handleClearSlots}
                  className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>
              )}
            </div>

            {/* 2 Input Slots + Result Slot */}
            <div className="grid grid-cols-11 items-center gap-1.5 sm:gap-2">
              {/* Slot A */}
              <button
                type="button"
                onClick={() => {
                  if (slotA) {
                    soundEngine.playClear();
                    setSlotA(null);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverSlot('a');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const id = e.dataTransfer.getData('text/plain');
                  handleDropElement(id, 'a');
                }}
                className={`col-span-3 min-h-[86px] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  elemA
                    ? 'bg-slate-800/90 border border-cyan-400/60 shadow-inner'
                    : dragOverSlot === 'a'
                    ? 'bg-cyan-950/30 border-2 border-dashed border-cyan-400'
                    : 'bg-slate-900/70 border border-dashed border-slate-700 hover:border-slate-500'
                }`}
              >
                {elemA ? (
                  <>
                    <span className="text-3xl leading-none select-none">{elemA.emoji}</span>
                    <span className="mt-1.5 text-xs font-semibold text-white line-clamp-1">
                      {elemA.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Ketuk hapus</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl text-slate-500 select-none">＋</span>
                    <span className="mt-1 text-xs font-medium text-slate-400">Bahan 1</span>
                  </>
                )}
              </button>

              {/* Plus Operator */}
              <div className="col-span-1 flex items-center justify-center font-mono text-base font-bold text-slate-500">
                +
              </div>

              {/* Slot B */}
              <button
                type="button"
                onClick={() => {
                  if (slotB) {
                    soundEngine.playClear();
                    setSlotB(null);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragOverSlot('b');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const id = e.dataTransfer.getData('text/plain');
                  handleDropElement(id, 'b');
                }}
                className={`col-span-3 min-h-[86px] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  elemB
                    ? 'bg-slate-800/90 border border-cyan-400/60 shadow-inner'
                    : dragOverSlot === 'b'
                    ? 'bg-cyan-950/30 border-2 border-dashed border-cyan-400'
                    : 'bg-slate-900/70 border border-dashed border-slate-700 hover:border-slate-500'
                }`}
              >
                {elemB ? (
                  <>
                    <span className="text-3xl leading-none select-none">{elemB.emoji}</span>
                    <span className="mt-1.5 text-xs font-semibold text-white line-clamp-1">
                      {elemB.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Ketuk hapus</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl text-slate-500 select-none">＋</span>
                    <span className="mt-1 text-xs font-medium text-slate-400">Bahan 2</span>
                  </>
                )}
              </button>

              {/* Equals Operator */}
              <div className="col-span-1 flex items-center justify-center font-mono text-base font-bold text-slate-500">
                =
              </div>

              {/* Result Slot */}
              <div
                onClick={() => {
                  if (feedback.element) {
                    handleUseResultAsIngredient(feedback.element.id);
                  }
                }}
                className={`col-span-3 min-h-[86px] rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all ${
                  feedback.type === 'new' && feedback.element
                    ? 'bg-amber-500/15 border border-amber-400/70 cursor-pointer animate-pop'
                    : feedback.type === 'known' && feedback.element
                    ? 'bg-cyan-500/15 border border-cyan-400/60 cursor-pointer animate-pop'
                    : feedback.type === 'fail'
                    ? 'bg-rose-500/10 border border-rose-500/40'
                    : 'bg-slate-900/50 border border-slate-800'
                }`}
              >
                {feedback.element ? (
                  <>
                    <span className="text-3xl leading-none select-none">
                      {feedback.element.emoji}
                    </span>
                    <span className="mt-1.5 text-xs font-bold text-white line-clamp-1">
                      {feedback.element.name}
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono">Pakai lagi →</span>
                  </>
                ) : feedback.type === 'fail' ? (
                  <>
                    <span className="text-2xl leading-none select-none">✖️</span>
                    <span className="mt-1 text-xs font-medium text-rose-300">Gagal</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl leading-none select-none opacity-60">⚗️</span>
                    <span className="mt-1 text-xs font-medium text-slate-500">Hasil</span>
                  </>
                )}
              </div>
            </div>

            {/* Reaction Status Banner */}
            <div
              className={`mt-3 px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2 ${
                feedback.type === 'new'
                  ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                  : feedback.type === 'known'
                  ? 'bg-cyan-500/12 text-cyan-200 border border-cyan-500/25'
                  : feedback.type === 'fail'
                  ? 'bg-rose-500/12 text-rose-200 border border-rose-500/25'
                  : 'bg-slate-900/90 text-slate-300 border border-white/[0.05]'
              }`}
            >
              <div className="flex-1">
                {feedback.recipeText && (
                  <div className="font-mono text-[11px] opacity-85 mb-0.5">
                    {feedback.recipeText}
                  </div>
                )}
                <div className="font-medium leading-snug">{feedback.message}</div>
              </div>
              {feedback.element && (
                <button
                  onClick={() => handleUseResultAsIngredient(feedback.element!.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-cyan-300 font-semibold text-xs whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Jadikan Bahan 1
                </button>
              )}
            </div>
          </div>

          {/* KARTU RINGKASAN STATISTIK KOLEKSI PEMAIN (Di Atas Inventaris) */}
          <section
            aria-label="Ringkasan Statistik Koleksi"
            className="mx-3.5 mb-3 p-3.5 rounded-2xl bg-[#0B0F19]/85 border border-white/[0.08] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Statistik Koleksi &amp; Sintesis</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 tabular-nums">
                {collectionStats.totalSyntheses} Total Reaksi
              </div>
            </div>

            {/* Top 2 Summary Metric Cards: Total Material Ditemukan & Tier Tertinggi Dicapai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Metric 1: Total Material Ditemukan + SVG Ring + Mini Tier Bar Chart */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/[0.06] flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Total Material Ditemukan
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1.5 font-mono tabular-nums">
                      <span className="text-xl font-bold text-white">{unlockedCount}</span>
                      <span className="text-xs text-slate-400">/ {totalElements}</span>
                    </div>
                  </div>

                  {/* SVG Progress Ring */}
                  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                      <circle
                        cx="22"
                        cy="22"
                        r={ringRadius}
                        fill="none"
                        stroke="rgba(51, 65, 85, 0.6)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r={ringRadius}
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringStrokeDashoffset}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-mono font-semibold text-cyan-300 tabular-nums">
                      {progressPercentage}%
                    </span>
                  </div>
                </div>

                {/* Mini 5-Bar Tier Distribution Sparkline */}
                <div className="space-y-1">
                  <div className="grid grid-cols-5 gap-1.5 items-end h-7 pt-1">
                    {collectionStats.tierBreakdown.map((item) => (
                      <div
                        key={item.tier}
                        className="h-full flex flex-col justify-end bg-slate-800/70 rounded overflow-hidden"
                        title={`Tier ${item.tier}: ${item.unlockedInTier}/${item.totalInTier}`}
                      >
                        <div
                          className="w-full bg-cyan-400/90 transition-all duration-300 rounded-t"
                          style={{ height: `${Math.max(12, item.pct)}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 text-[9px] font-mono text-slate-400 text-center tabular-nums">
                    {collectionStats.tierBreakdown.map((item) => (
                      <span key={item.tier}>
                        T{item.tier}:{item.unlockedInTier}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metric 2: Tier Tertinggi Dicapai + 5-Step Tier Progression Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/[0.06] flex flex-col justify-between gap-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Tier Tertinggi Dicapai
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1.5">
                      <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                        Tier {collectionStats.highestTier}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        · {TIER_LABELS[collectionStats.highestTier].shortName}
                      </span>
                    </div>
                  </div>
                  <Layers className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                </div>

                {/* Segmented 5-Tier Ladder Bar */}
                <div className="space-y-1.5">
                  <div className="grid grid-cols-5 gap-1">
                    {([0, 1, 2, 3, 4] as ElementTier[]).map((t) => {
                      const reached = t <= collectionStats.highestTier;
                      const isCurrentPeak = t === collectionStats.highestTier;
                      return (
                        <div
                          key={t}
                          className={`h-2 rounded-sm transition-colors ${
                            isCurrentPeak
                              ? 'bg-amber-400'
                              : reached
                              ? 'bg-emerald-400/80'
                              : 'bg-slate-800'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tabular-nums">
                    <span>
                      Koleksi T{collectionStats.highestTier}:{' '}
                      {collectionStats.highestTierData.unlockedInTier}/
                      {collectionStats.highestTierData.totalInTier}
                    </span>
                    <span className="text-amber-300">
                      {collectionStats.highestTierData.pct}% Tier Ini
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metric 3: Resep Paling Sering Digunakan (Full-Width Bar with Quick Load) */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-white/[0.06]">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resep Paling Sering Digunakan</span>
                </div>
                {collectionStats.topRecipeInfo && (
                  <span className="text-[11px] font-mono font-semibold text-cyan-300 tabular-nums">
                    {collectionStats.topRecipeInfo.count}× disintesis
                  </span>
                )}
              </div>

              {collectionStats.topRecipeInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-slate-200">
                      <span>
                        {collectionStats.topRecipeInfo.elA.emoji}{' '}
                        {collectionStats.topRecipeInfo.elA.name}
                      </span>
                      <span className="font-mono text-slate-500">+</span>
                      <span>
                        {collectionStats.topRecipeInfo.elB.emoji}{' '}
                        {collectionStats.topRecipeInfo.elB.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-bold text-white">
                        {collectionStats.topRecipeInfo.result.emoji}{' '}
                        {collectionStats.topRecipeInfo.result.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const info = collectionStats.topRecipeInfo!;
                        soundEngine.playSelect();
                        setSlotA(info.elA.id);
                        setSlotB(info.elB.id);
                        evaluateCombination(info.elA.id, info.elB.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Ulangi Resep
                    </button>
                  </div>

                  {/* Frequency Indicator Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-300"
                      style={{ width: `${collectionStats.topRecipeInfo.sharePct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono">
                  Belum ada riwayat sintesis · Gabungkan 2 elemen di meja sintesis untuk mencatat statistik.
                </div>
              )}
            </div>
          </section>

          {/* Recently Unlocked Quick Bar */}
          {recentlyUnlockedIds.length > 0 && (
            <div className="px-4 pb-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                Baru Ditemukan:
              </span>
              {recentlyUnlockedIds.map((id) => {
                const el = ELEMENT_MAP[id];
                if (!el) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectElement(id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-amber-400/30 text-xs font-medium text-amber-200 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{el.emoji}</span>
                    <span>{el.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Inventory Search & Tier Filter */}
          <div className="px-3.5 pt-1 pb-3 space-y-2.5 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari elemen, mineral, atau mesin..."
                className="w-full pl-9 pr-8 py-2.5 bg-slate-800/90 border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Interactive Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {(
                [
                  { id: 'all', label: `Semua (${unlockedIds.length})` },
                  { id: 0, label: 'T0 Primordial' },
                  { id: 1, label: 'T1 Alam' },
                  { id: 2, label: 'T2 Material' },
                  { id: 3, label: 'T3 Mesin' },
                  { id: 4, label: 'T4 Teknologi' },
                ] as const
              ).map((tab) => (
                <button
                  key={String(tab.id)}
                  onClick={() => setTierFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    tierFilter === tab.id
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Element Inventory Grid (Thumb-Friendly Hitboxes >= 48px) */}
          <div className="p-3.5 max-h-[430px] lg:max-h-[460px] overflow-y-auto">
            {unlockedElements.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                Tidak ada elemen yang cocok dengan filter pencarian.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {unlockedElements.map((el) => {
                  const isSelected = slotA === el.id || slotB === el.id;
                  const isRecent = recentlyUnlockedIds.includes(el.id);
                  return (
                    <button
                      key={el.id}
                      type="button"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', el.id);
                      }}
                      onClick={() => handleSelectElement(el.id)}
                      className={`group relative min-h-[82px] p-2.5 rounded-xl border text-center flex flex-col items-center justify-center transition-all select-none cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-400 shadow-sm'
                          : 'bg-[#1E293B]/90 hover:bg-[#26354D] border-white/[0.07]'
                      }`}
                    >
                      {isRecent && (
                        <span className="absolute top-1.5 right-1.5 text-[10px] font-mono font-semibold text-amber-300">
                          BARU
                        </span>
                      )}
                      <span className="text-2xl sm:text-3xl leading-none group-hover:scale-105 transition-transform">
                        {el.emoji}
                      </span>
                      <span className="mt-1.5 text-xs font-semibold text-slate-100 leading-tight line-clamp-1">
                        {el.name}
                      </span>
                      <span className="mt-0.5 text-[10px] text-slate-400 font-mono">
                        T{el.tier} · {el.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Buku Petunjuk Resep, Ensiklopedia & Generator 1-File HTML */}
        <div
          className={`lg:col-span-5 xl:col-span-6 w-full max-w-[440px] lg:max-w-none mx-auto bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl ${
            activeTab === 'play' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Companion Panel Switcher */}
          <div className="p-2 bg-slate-900/90 border-b border-white/[0.07] grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                setDesktopSideTab('hints');
                if (activeTab !== 'play') setActiveTab('hints');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                (activeTab === 'hints' || (activeTab === 'play' && desktopSideTab === 'hints'))
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Buku Petunjuk ({totalElements - unlockedCount})</span>
            </button>
            <button
              onClick={() => {
                setDesktopSideTab('codex');
                if (activeTab !== 'play') setActiveTab('codex');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                (activeTab === 'codex' || (activeTab === 'play' && desktopSideTab === 'codex'))
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ensiklopedia ({unlockedCount})</span>
            </button>
            <button
              onClick={() => {
                setDesktopSideTab('export');
                if (activeTab !== 'play') setActiveTab('export');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                (activeTab === 'export' || (activeTab === 'play' && desktopSideTab === 'export'))
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>1-File HTML</span>
            </button>
          </div>

          {/* TAB 1: BUKU PETUNJUK RESEP TERKUNCI */}
          {(activeTab === 'hints' || (activeTab === 'play' && desktopSideTab === 'hints')) && (
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Buku Petunjuk Resep Belum Ditemukan
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Menampilkan 1 bahan pembentuk untuk setiap elemen yang masih terkunci.
                  </p>
                </div>
                <button
                  onClick={() => setOnlyReadyHints(!onlyReadyHints)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    onlyReadyHints
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                      : 'bg-slate-800 border-white/[0.08] text-slate-300'
                  }`}
                >
                  {onlyReadyHints ? '✓ Hanya Bahan Tersedia' : 'Filter Bahan Tersedia'}
                </button>
              </div>

              {/* Tier Filter for Hints */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {(
                  [
                    { id: 'all', label: 'Semua Tier' },
                    { id: 1, label: 'Tier 1 · Alam' },
                    { id: 2, label: 'Tier 2 · Material' },
                    { id: 3, label: 'Tier 3 · Mesin' },
                    { id: 4, label: 'Tier 4 · Teknologi' },
                  ] as const
                ).map((t) => (
                  <button
                    key={String(t.id)}
                    onClick={() => setHintTierFilter(t.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                      hintTierFilter === t.id
                        ? 'bg-slate-200 text-slate-950 font-semibold'
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Hints List */}
              <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
                {lockedHints.length === 0 ? (
                  <div className="p-8 rounded-xl bg-slate-900/70 border border-white/[0.06] text-center space-y-2">
                    <Sparkles className="w-7 h-7 text-emerald-400 mx-auto" />
                    <div className="text-sm font-bold text-white">
                      Semua Resep pada Kategori Ini Telah Ditemukan!
                    </div>
                    <p className="text-xs text-slate-400">
                      Anda telah membuka seluruh elemen benda mati &amp; teknologi di tingkatan ini.
                    </p>
                  </div>
                ) : (
                  lockedHints.map(({ target, knownIngredient, isCraftableNow }) => (
                    <div
                      key={target.id}
                      className="p-3.5 rounded-xl bg-[#1E293B]/85 border border-white/[0.07] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        {/* Clean unboxed metadata */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                          <span className={TIER_LABELS[target.tier].badgeClass}>
                            Tier {target.tier}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{target.category}</span>
                          {isCraftableNow && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-400 font-semibold">
                                Kedua Bahan Sudah Ada
                              </span>
                            </>
                          )}
                        </div>

                        {/* Formula with 1 revealed ingredient */}
                        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
                          {knownIngredient ? (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                              <span>{knownIngredient.emoji}</span>
                              <span>{knownIngredient.name}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Lock className="w-3.5 h-3.5" />
                              <span>Bahan Belum Terbuka</span>
                            </span>
                          )}
                          <span className="text-slate-500 font-mono font-bold">+</span>
                          <span className="font-mono text-amber-300 font-semibold">[ ? ]</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-slate-300 font-mono">
                            ❓ Target {target.category}
                          </span>
                        </div>
                      </div>

                      {knownIngredient && (
                        <button
                          onClick={() => handleLoadHintIngredient(knownIngredient.id)}
                          className="min-h-[40px] px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Pakai Bahan
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENSIKLOPEDIA & RIWAYAT RESEP */}
          {(activeTab === 'codex' || (activeTab === 'play' && desktopSideTab === 'codex')) && (
            <div className="p-4 space-y-4">
              <div className="pb-3 border-b border-white/[0.06]">
                <h2 className="text-base font-bold text-white">
                  Ensiklopedia Material &amp; Rekayasa Teknologi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ketuk elemen untuk melihat deskripsi ilmiah dan rumus pembentuknya.
                </p>
              </div>

              {selectedCodexElement && (
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-400/40 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{selectedCodexElement.emoji}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {selectedCodexElement.name}
                        </h3>
                        <div className="text-xs text-slate-400 font-mono">
                          {TIER_LABELS[selectedCodexElement.tier].name} ·{' '}
                          {selectedCodexElement.category}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCodexElement(null)}
                      className="text-slate-400 hover:text-white p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCodexElement.description}
                  </p>
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-mono">
                      {RECIPES.filter((r) => r.result === selectedCodexElement.id)
                        .slice(0, 2)
                        .map((r) => {
                          const a = ELEMENT_MAP[r.a];
                          const b = ELEMENT_MAP[r.b];
                          return `${a?.emoji} ${a?.name} + ${b?.emoji} ${b?.name}`;
                        })
                        .join('  |  ') || 'Elemen Primordial Dasar'}
                    </div>
                    <button
                      onClick={() => {
                        handleSelectElement(selectedCodexElement.id);
                        setActiveTab('play');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Masukkan ke Meja
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {ELEMENTS.filter((el) => unlockedIds.includes(el.id)).map((el) => {
                  const recipeMatches = RECIPES.filter((r) => r.result === el.id);
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedCodexElement(el)}
                      className="p-3 rounded-xl bg-[#1E293B]/80 hover:bg-[#26354D] border border-white/[0.07] flex items-start justify-between gap-3 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl leading-none mt-0.5">{el.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{el.name}</span>
                            <span className="text-[11px] font-mono text-cyan-400">
                              Tier {el.tier} · {el.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {el.description}
                          </p>
                          {recipeMatches.length > 0 && (
                            <div className="mt-1.5 text-[11px] font-mono text-slate-400">
                              Resep:{' '}
                              {recipeMatches
                                .slice(0, 2)
                                .map(
                                  (r) =>
                                    `${ELEMENT_MAP[r.a]?.emoji} ${ELEMENT_MAP[r.a]?.name} + ${
                                      ELEMENT_MAP[r.b]?.emoji
                                    } ${ELEMENT_MAP[r.b]?.name}`
                                )
                                .join(' atau ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: EKSPOR 1-FILE HTML MANDIRI */}
          {(activeTab === 'export' || (activeTab === 'play' && desktopSideTab === 'export')) && (
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Kode Lengkap 1-File HTML Mandiri
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Seluruh HTML, CSS, dan JavaScript (50 elemen &amp; 64 resep) tergabung dalam 1 file.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyStandaloneHtml}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/[0.1] text-xs font-semibold text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedHtml ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadStandaloneHtml}
                    className="min-h-[40px] px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-xs font-semibold text-slate-950 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .HTML</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-[#0B0F19] border border-white/[0.08] p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                  <span>alkimia-benda-mati-teknologi.html</span>
                  <span>Single-File Bundle · LocalStorage Enabled</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[440px] overflow-y-auto leading-relaxed select-all">
                  {standaloneHtmlCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (<= 15% viewport height, >= 44px hitboxes) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#111827]/95 backdrop-blur-md border-t border-white/[0.08] grid grid-cols-4 items-center">
        <button
          onClick={() => setActiveTab('play')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'play' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-[11px] font-semibold whitespace-nowrap">Sintesis</span>
        </button>

        <button
          onClick={() => setActiveTab('hints')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'hints' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-[11px] font-semibold whitespace-nowrap">
            Petunjuk ({totalElements - unlockedCount})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('codex')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'codex' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[11px] font-semibold whitespace-nowrap">Ensiklopedia</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'export' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[11px] font-semibold whitespace-nowrap">File HTML</span>
        </button>
      </nav>
    </div>
  );
}
