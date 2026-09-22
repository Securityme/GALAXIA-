'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { useConfigStore } from '@/features/config/store/configStore';
import { useGameStore } from '@/features/game/store/gameStore';
import { 
  ERAS_CATALOG, 
  AVAILABLE_LEADER_TRAITS 
} from '@/features/config/logic/configEngine';
import { LEADER_AVATARS } from '@/features/lore/leaderAvatars';
import { COUNCIL_MINISTERS_CATALOG } from '@/features/lore/councilMinisters';
import { TECH_TREE_CATALOG } from '@/features/tech/logic/techTreeData';
import { AvatarPortrait } from '@/components/ui/AvatarPortrait';
import { CouncilDossierModal } from '@/components/ui/CouncilDossierModal';
import { soundFx } from '@/lib/audio';
import { 
  Sliders, 
  Sparkles, 
  Dices, 
  User, 
  Shield, 
  Globe, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Cpu, 
  Radio, 
  Zap, 
  Anchor, 
  Users, 
  Compass,
  AlertTriangle,
  FileText,
  FlaskConical
} from 'lucide-react';
import { EraId, DifficultyLevel, ThreatLevel, InitMode, CouncilPoleId } from '@/types/config';

export default function ConfigPage() {
  const router = useRouter();
  const [inspectingDossier, setInspectingDossier] = useState<{
    isOpen: boolean;
    poleId?: CouncilPoleId;
    isLeader?: boolean;
  }>({ isOpen: false });

  const {
    config,
    setMode,
    setSuperphase,
    setEra,
    setUnionName,
    setLoreNotes,
    setLeaderName,
    setLeaderTitle,
    setLeaderAvatar,
    setStarterTech,
    toggleLeaderTrait,
    updateAstra,
    updateCouncilLoyalty,
    setDifficulty,
    setThreatLevel,
    setMacroAnchor,
    setMicroAnchor,
    applyRandomSetup,
    applyAiAssistedSetup,
    isAiLoading,
    setIsAiLoading,
    aiSuggestion,
    setAiSuggestion
  } = useConfigStore();

  const { initFromConfig } = useGameStore();

  const handleLaunchGame = () => {
    initFromConfig(config);
    router.push('/game');
  };

  const handleRequestAiAssistance = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/game/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: "Optimisation de l'amorce T_0 pour le Secteur Zéro",
          eraId: config.eraId,
          currentConfig: config
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setAiSuggestion(data.analysis);
        applyAiAssistedSetup(data.analysis);
      }
    } catch (err) {
      console.warn("AI assist failed, applying default recommendations:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 lg:py-8 space-y-6 font-mono text-xs">
        
        {/* Top Header & Mode Selection Bar */}
        <div className="p-4 rounded-md bg-[#050b1a] border border-cyan-500/25 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              CONFIGURATION INITIALE DE SIMULATION (AMORCE T_0)
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Établissez l&apos;ADN narratif, les équilibres systémiques et l&apos;ancrage planétaire de l&apos;Union.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#030612] p-1 rounded border border-slate-700">
            <button
              onClick={() => setMode('manual')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                config.mode === 'manual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mode Manuel
            </button>

            <button
              onClick={() => {
                setMode('ai_assisted');
                handleRequestAiAssistance();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                config.mode === 'ai_assisted'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Assisté par IA
            </button>

            <button
              onClick={() => {
                setMode('random');
                applyRandomSetup();
              }}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                config.mode === 'random'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Dices className="w-3.5 h-3.5 text-emerald-400" />
              Aléatoire
            </button>
          </div>
        </div>

        {/* AI Suggestion Banner if present */}
        {config.mode === 'ai_assisted' && aiSuggestion && (
          <div className="p-3.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold mb-1 text-amber-300">
              <Sparkles className="w-4 h-4" />
              RECOMMANDATION TACTIQUE GEMINI 3.8 FLASH :
            </div>
            <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
              {aiSuggestion.summary}
            </p>
            <div className="text-[10px] text-amber-300/90 font-mono">
              Conseil Leader : {aiSuggestion.leaderAdvice}
            </div>
          </div>
        )}

        {/* 4 Superphases Navigation Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setSuperphase(1)}
            className={`p-3 rounded border text-left transition-all ${
              config.superphase === 1
                ? 'bg-[#0a1636] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                : 'bg-[#050a18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-400 mb-0.5">SUPERPHASE 1</div>
            <div className="text-xs font-bold text-slate-200">Lore &amp; ADN Narratif</div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Époque, Union &amp; Antécédents</div>
          </button>

          <button
            onClick={() => setSuperphase(2)}
            className={`p-3 rounded border text-left transition-all ${
              config.superphase === 2
                ? 'bg-[#0a1636] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                : 'bg-[#050a18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-400 mb-0.5">SUPERPHASE 2</div>
            <div className="text-xs font-bold text-slate-200">Équilibres Systémiques</div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Leader, ASTRA &amp; Conseil à 6 pôles</div>
          </button>

          <button
            onClick={() => setSuperphase(3)}
            className={`p-3 rounded border text-left transition-all ${
              config.superphase === 3
                ? 'bg-[#0a1636] border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,243,255,0.15)]'
                : 'bg-[#050a18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-bold text-slate-400 mb-0.5">SUPERPHASE 3</div>
            <div className="text-xs font-bold text-slate-200">Implantation Géographique</div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Secteur Zéro, Orbite &amp; Colonies</div>
          </button>

          <button
            onClick={() => setSuperphase(4)}
            className={`p-3 rounded border text-left transition-all ${
              config.superphase === 4
                ? 'bg-[#0a1636] border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,183,0,0.2)]'
                : 'bg-[#050a18] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-bold text-amber-400/80 mb-0.5">SUPERPHASE 4</div>
            <div className="text-xs font-bold text-slate-200">Compte-Rendu d&apos;État-Major</div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">Synthèse &amp; Validation Lancement</div>
          </button>
        </div>

        {/* ================= SUPERPHASE 1: LORE & ADN ================= */}
        {config.superphase === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-4">
              <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                CHOIX DE L&apos;ÉPOQUE HISTORIQUE
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {ERAS_CATALOG.map((era) => {
                  const isSelected = config.eraId === era.id;
                  return (
                    <button
                      key={era.id}
                      onClick={() => setEra(era.id)}
                      className={`p-3 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-[#0a1b42] border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                          : 'bg-[#040816] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-200">{era.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <p className="text-[10px] text-cyan-400 mb-2">{era.subtitle}</p>
                      <p className="text-[11px] text-slate-300 leading-snug mb-3">{era.description}</p>
                      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                        {era.loreModifier}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Union Name & Lore Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    NOM DE L’UNION OU DE LA CONFÉDÉRATION
                  </label>
                  <input
                    type="text"
                    value={config.unionName}
                    onChange={(e) => setUnionName(e.target.value)}
                    className="w-full bg-[#030612] border border-cyan-500/30 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                    ANTÉCÉDENTS NARRATIFS &amp; PROTOCOLE DE DÉPART
                  </label>
                  <textarea
                    rows={2}
                    value={config.loreCustomNotes}
                    onChange={(e) => setLoreNotes(e.target.value)}
                    className="w-full bg-[#030612] border border-cyan-500/30 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setSuperphase(2)}>
                Continuer vers la Superphase 2
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= SUPERPHASE 2: ÉQUILIBRES SYSTÉMIQUES ================= */}
        {config.superphase === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            
            {/* 1. Leader Archetype & Visual Avatar */}
            <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  AVATAR SCI-FI &amp; IDENTITÉ DU COMMANDANT (LEADER)
                </h2>
                <span className="text-[10px] text-slate-400">
                  Archetype sélectionné : <strong className="text-cyan-300">{config.leader.name}</strong>
                </span>
              </div>

              {/* Leader Avatar Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {LEADER_AVATARS.map((avatar) => {
                  const isSelected = config.leader.avatarId === avatar.id || (!config.leader.avatarId && avatar.id === 'leader_vance');
                  return (
                    <div
                      key={avatar.id}
                      onClick={() => {
                        soundFx.playClick();
                        setLeaderAvatar(avatar.id);
                        setLeaderName(avatar.name);
                        setLeaderTitle(avatar.defaultTitle);
                      }}
                      style={{
                        borderColor: isSelected ? avatar.neonColor : undefined,
                        boxShadow: isSelected ? `0 0 14px ${avatar.neonColor}44` : undefined
                      }}
                      className={`p-3 rounded border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#08122d] border-cyan-400'
                          : 'bg-[#030612] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <AvatarPortrait
                            id={avatar.id}
                            name={avatar.name}
                            neonColor={avatar.neonColor}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{avatar.name}</h4>
                            <p className="text-[10px] text-slate-400 truncate">{avatar.archetype}</p>
                            <span 
                              className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold border"
                              style={{ color: avatar.neonColor, borderColor: `${avatar.neonColor}50` }}
                            >
                              {avatar.eraAffinity}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug line-clamp-2 italic mb-2">
                          &ldquo;{avatar.quote}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-bold">{avatar.statsBonus}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playClick();
                            setInspectingDossier({ isOpen: true, isLeader: true });
                          }}
                          className="text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          Dossier
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Name & Title Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">
                    NOM PERSONNALISÉ DE L&apos;AMIRAL
                  </label>
                  <input
                    type="text"
                    value={config.leader.name}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="w-full bg-[#030612] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 font-semibold">
                    TITRE PROTOCOLAIRE OFFICIEL
                  </label>
                  <input
                    type="text"
                    value={config.leader.title}
                    onChange={(e) => setLeaderTitle(e.target.value)}
                    className="w-full bg-[#030612] border border-cyan-500/30 rounded px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Traits Selection */}
              <div>
                <span className="block text-[10px] text-slate-400 mb-1.5 font-semibold">
                  TRAITS PSYCHOLOGIQUES &amp; POLITIQUES (Jusqu&apos;à 3 sélections) :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {AVAILABLE_LEADER_TRAITS.map((trait) => {
                    const isSelected = config.leader.traits.some((t) => t.id === trait.id);
                    return (
                      <button
                        key={trait.id}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          toggleLeaderTrait(trait);
                        }}
                        className={`p-2.5 rounded border text-left transition-all ${
                          isSelected
                            ? 'bg-[#0a1c44] border-cyan-400 text-cyan-200'
                            : 'bg-[#030612] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-200 text-xs">{trait.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <p className="text-[10px] text-slate-300 leading-snug">{trait.description}</p>
                        <p className="text-[10px] text-emerald-400 mt-1 font-bold">{trait.passiveBonus}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Conseil Exécutif (6 Pôles) & Portraits */}
            <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  CONSEIL EXÉCUTIF DE L’UNION (LES 6 PÔLES GOUVERNEMENTAUX)
                </h2>
                <span className="text-[10px] text-slate-400">Cliquez pour consulter le dossier ministériel</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(['military', 'scientific', 'civilization', 'economic', 'diplomatic', 'logistics'] as CouncilPoleId[]).map((pole) => {
                  const minister = COUNCIL_MINISTERS_CATALOG[pole];
                  const member = (config.council as any)[pole];
                  const neon = minister.signatureNeon;

                  return (
                    <div
                      key={pole}
                      onClick={() => {
                        soundFx.playClick();
                        setInspectingDossier({ isOpen: true, poleId: pole });
                      }}
                      className="p-3 rounded bg-[#030612] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
                      style={{ borderLeftColor: neon, borderLeftWidth: '3px' }}
                    >
                      <div>
                        <div className="flex items-center gap-2.5 mb-2">
                          <AvatarPortrait
                            id={pole}
                            name={member?.name || minister.name}
                            neonColor={neon}
                            size="md"
                            poleId={pole}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {member?.name || minister.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">
                              Pôle {pole}
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-300 italic line-clamp-2 mb-2">
                          &ldquo;{minister.quote}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Fidélité Initiale :</span>
                          <span className="font-bold" style={{ color: neon }}>
                            {member?.loyalty || minister.defaultLoyalty}%
                          </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Bonus Actif :</span>
                          <span className="text-emerald-400 font-medium truncate ml-1">
                            {minister.bonusSummary}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Starter Technology Selection (Tier 1 R&D) */}
            <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-400" />
                  DOCTRINE TECHNOLOGIQUE DE DÉPART (PALIER 1)
                </h2>
                <span className="text-[10px] text-slate-400">Débloquée dès le Tour 1</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">
                Sélectionnez la percée scientifique fondamentale emportée par votre Vaisseau-Monde avant le départ :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TECH_TREE_CATALOG.filter((t) => t.superphaseEligible).map((tech) => {
                  const isSelected = config.starterTechId === tech.id || (!config.starterTechId && tech.id === 'mil_gauss_cannons');
                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => {
                        soundFx.playTechUnlock();
                        setStarterTech(tech.id);
                      }}
                      className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#081838] border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                          : 'bg-[#030612] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white">{tech.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </div>
                        <span className="text-[9px] uppercase font-bold text-cyan-400 block mb-1">
                          Pôle {tech.poleId}
                        </span>
                        <p className="text-[10px] text-slate-300 leading-snug mb-2">
                          {tech.description}
                        </p>
                      </div>

                      {tech.effects.specialPerk && (
                        <div className="p-1.5 rounded bg-black/40 text-[9px] text-amber-300 font-semibold border border-slate-800/80 mt-1">
                          ★ {tech.effects.specialPerk}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. ASTRA World-Ship Specs & Difficulty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-cyan-400" />
                  CALIBRATION DU VAISSEAU-MONDE ASTRA
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Intégrité Coque Initiale</span>
                    <span className="font-bold text-cyan-300">{config.astra.hullCurrent} HP</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Boucliers Structurels</span>
                    <span className="font-bold text-amber-300">{config.astra.structuralShields}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Réacteurs à Plasma / Fusion</span>
                    <span className="font-bold text-emerald-300">{config.astra.fusionReactors} MW</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Escadres de Combat Embarquées</span>
                    <span className="font-bold text-slate-200">{config.astra.combatSquadrons}</span>
                  </div>
                </div>
              </div>

              {/* Difficulty & Sector Threat */}
              <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-3">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  DIFFICULTÉ &amp; AGRESSIVITÉ SECTEUR ZÉRO
                </h3>

                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">NIVEAU DE DIFFICULTÉ</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['normal', 'tactical', 'hardcore'] as DifficultyLevel[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setDifficulty(d);
                        }}
                        className={`py-1.5 rounded uppercase font-bold text-[10px] border transition-all ${
                          config.difficulty === d
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                            : 'bg-[#030612] border-slate-800 text-slate-400'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 mb-1">MENACE SECTEUR ZÉRO</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['low', 'moderate', 'hostile'] as ThreatLevel[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setThreatLevel(t);
                        }}
                        className={`py-1.5 rounded uppercase font-bold text-[10px] border transition-all ${
                          config.sectorZeroThreat === t
                            ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-[#030612] border-slate-800 text-slate-400'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setSuperphase(1)}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Retour Superphase 1
              </Button>
              <Button variant="primary" onClick={() => setSuperphase(3)}>
                Continuer vers la Superphase 3
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= SUPERPHASE 3: IMPLANTATION GÉOGRAPHIQUE ================= */}
        {config.superphase === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded bg-[#070e24] border border-cyan-500/20 space-y-4">
              <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                ANCRAGE MACRO &amp; MICRO DANS LE SECTEUR ZÉRO
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded bg-[#040816] border border-slate-800">
                  <h3 className="font-bold text-xs text-cyan-300 mb-2">ANCRAGE MACROSCOPIQUE</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Secteur Cible :</span>
                      <span className="text-slate-200 font-semibold">{config.macroAnchor.sectorLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Quadrant Spatial :</span>
                      <span className="text-slate-200">{config.macroAnchor.quadrant}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Affinité Nébuleuse :</span>
                      <span className="text-cyan-300">{config.macroAnchor.nebulaAffinity}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#040816] border border-slate-800">
                  <h3 className="font-bold text-xs text-amber-300 mb-2">ANCRAGE MICROSCOPIQUE</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Étoile Hôte :</span>
                      <span className="text-slate-200 font-semibold">{config.microAnchor.hostStarClass}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Orbite d&apos;Arrivée :</span>
                      <span className="text-emerald-300">{config.microAnchor.arrivalOrbit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Initial Colony: Nova Paris */}
              <div>
                <h3 className="font-bold text-xs text-slate-200 mb-2">
                  COLONIE PLANÉTAIRE INITIALE : {config.initialColonies[0]?.name || 'Nova Paris'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-3 rounded bg-[#030612] border border-slate-800">
                    <span className="text-[10px] text-slate-400">COMPLEXE MINIER</span>
                    <div className="text-emerald-400 font-bold mt-1">+45 Minéraux / cycle</div>
                  </div>
                  <div className="p-3 rounded bg-[#030612] border border-slate-800">
                    <span className="text-[10px] text-slate-400">BIO-DÔME AGRO</span>
                    <div className="text-emerald-400 font-bold mt-1">+60 Rations / cycle</div>
                  </div>
                  <div className="p-3 rounded bg-[#030612] border border-slate-800">
                    <span className="text-[10px] text-slate-400">DÉFENSE GAUSS</span>
                    <div className="text-indigo-400 font-bold mt-1">+15 Sécurité Locale</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action to Superphase 4 */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" onClick={() => setSuperphase(2)}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Retour Superphase 2
              </Button>

              <Button
                variant="primary"
                size="lg"
                glow
                onClick={() => {
                  soundFx.playClick();
                  setSuperphase(4);
                }}
                className="font-bold text-sm"
              >
                Continuer vers la Superphase 4 (Compte-Rendu d&apos;État-Major)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= SUPERPHASE 4: COMPTE-RENDU D'ÉTAT-MAJOR & VALIDATION PRÉ-LANCEMENT ================= */}
        {config.superphase === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Executive Readiness Banner */}
            <div className="p-4 rounded bg-[#070e24] border border-amber-500/30 space-y-4 shadow-[0_0_20px_rgba(255,183,0,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.8)]" />
                  <div>
                    <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      COMPTE-RENDU D&apos;ÉTAT-MAJOR &amp; AUDIT PRÉ-LANCEMENT T_0
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      Revue globale des choix décisionnels des Superphases 1, 2 et 3 avant scellement du vecteur FTL.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                    FEUX VERTS GÉNÉRAUX ACCORDÉS
                  </span>
                </div>
              </div>

              {/* Pre-Flight Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded bg-[#040816] border border-slate-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-[10px]">
                    <div className="text-slate-200 font-bold">Arche ASTRA &amp; Réacteurs</div>
                    <div className="text-emerald-400 font-mono">{config.astra.hullCurrent} HP • {config.astra.fusionReactors} MW</div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#040816] border border-slate-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-[10px]">
                    <div className="text-slate-200 font-bold">Conseil Exécutif (6 Pôles)</div>
                    <div className="text-emerald-400 font-mono">Loyauté moyenne : 80%</div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#040816] border border-slate-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-[10px]">
                    <div className="text-slate-200 font-bold">Vecteur Orbital &amp; Colonie</div>
                    <div className="text-emerald-400 font-mono">{config.macroAnchor.sectorLabel}</div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#040816] border border-slate-800 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="text-[10px]">
                    <div className="text-slate-200 font-bold">Algorithme Invariant L₀</div>
                    <div className="text-cyan-400 font-mono">L₀ ≥ 0.0 Certifié</div>
                  </div>
                </div>
              </div>

              {/* 4 Summary Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                
                {/* Module 1: Superphase 1 Recap (Lore & Union) */}
                <div className="p-3.5 rounded bg-[#040816] border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      1. IDENTITÉ, HISTORIQUE &amp; MENACE (SUPERPHASE 1)
                    </span>
                    <button
                      onClick={() => setSuperphase(1)}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      Modifier &gt;
                    </button>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-400">Union Civique : </span>
                      <strong className="text-slate-100 font-bold">{config.unionName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Époque Historique : </span>
                      <strong className="text-cyan-300">{ERAS_CATALOG.find(e => e.id === config.eraId)?.title}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Menace &amp; Difficulté : </span>
                      <span className="text-amber-300 font-semibold">{config.sectorZeroThreat.toUpperCase()}</span>
                      <span className="text-slate-500"> • </span>
                      <span className="text-indigo-300 font-semibold">{config.difficulty.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Doctrine &amp; Antécédents : </span>
                      <p className="text-slate-300 text-[10px] italic mt-0.5 bg-[#02050f] p-2 rounded border border-slate-900">
                        &quot;{config.loreCustomNotes}&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* Module 2: Superphase 2 Leader Recap */}
                <div className="p-3.5 rounded bg-[#040816] border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      2. COMMANDEMENT SUPRÊME (SUPERPHASE 2)
                    </span>
                    <button
                      onClick={() => setSuperphase(2)}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      Modifier &gt;
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <AvatarPortrait
                      id={config.leader.avatarId || 'leader_vance'}
                      name={config.leader.name}
                      neonColor="#00f3ff"
                      size="md"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-100 text-xs">{config.leader.name}</div>
                      <div className="text-[10px] text-slate-400">{config.leader.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {config.leader.traits.map(t => (
                          <span key={t.id} className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-400 bg-[#02050f] p-2 rounded border border-slate-900">
                    Bonus combinés : {config.leader.traits.map(t => t.passiveBonus).join(' • ')}
                  </div>
                </div>

                {/* Module 3: Superphase 2 Fleet & Council Recap */}
                <div className="p-3.5 rounded bg-[#040816] border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      3. FLOTTE ASTRA &amp; CONSEIL EXÉCUTIF (SUPERPHASE 2)
                    </span>
                    <button
                      onClick={() => setSuperphase(2)}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      Modifier &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded bg-[#02050f] border border-slate-900">
                      <span className="text-slate-400 block">Arche Principale :</span>
                      <strong className="text-cyan-300">{config.astra.name}</strong>
                      <div className="text-slate-400 mt-1">
                        Coque: <span className="text-slate-200">{config.astra.hullCurrent}/{config.astra.hullMax}</span>
                        <br />Boucliers: <span className="text-amber-300">{config.astra.structuralShields}%</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-[#02050f] border border-slate-900">
                      <span className="text-slate-400 block">Dotation Escadres :</span>
                      <div className="text-slate-300 mt-0.5">
                        <strong className="text-cyan-300">{config.astra.combatSquadrons}</strong> escadrons de combat
                      </div>
                      <div className="text-slate-300 mt-0.5">
                        <strong className="text-emerald-300">{config.astra.miningDrones}</strong> essaims de drones
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-300 pt-1">
                    <span>Pôles Ministériels : <strong className="text-slate-100">Militaire, Science, Civ, Éco, Diplo, Logistique</strong></span>
                    <span className="text-emerald-400 font-bold">Actifs</span>
                  </div>
                </div>

                {/* Module 4: Superphase 3 Geography & Colony */}
                <div className="p-3.5 rounded bg-[#040816] border border-cyan-500/20 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      4. GÉOGRAPHIE DU SECTEUR &amp; MONDE INITIAL (SUPERPHASE 3)
                    </span>
                    <button
                      onClick={() => setSuperphase(3)}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      Modifier &gt;
                    </button>
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div>
                      <span className="text-slate-400">Ancrage Macroscopique : </span>
                      <strong className="text-slate-200">{config.macroAnchor.sectorLabel}</strong>
                      <span className="text-slate-400"> ({config.macroAnchor.quadrant})</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Étoile &amp; Orbite : </span>
                      <span className="text-cyan-300">{config.microAnchor.hostStarClass}</span>
                      <span className="text-slate-500"> • </span>
                      <span className="text-emerald-300">{config.microAnchor.arrivalOrbit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Colonie Initiale : </span>
                      <strong className="text-emerald-300">{config.initialColonies[0]?.name || 'Nova Paris'}</strong>
                      <span className="text-slate-400"> (+45 Minéraux, +60 Rations, +15 Sécurité)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cryptographic Seal & Mission Clearance */}
              <div className="p-3 rounded bg-[#02050f] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">ORDRE DE MISSION :</span>
                  <span className="text-cyan-400 font-bold">PROTOCOLE-T0-{config.eraId.toUpperCase()}-SECTEUR-ZERO</span>
                </div>
                <div className="text-slate-500">
                  INVARIANT L₀ CONFORME • PRÊT POUR LE CYCLE 1
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="flex items-center justify-between pt-2">
              <Button variant="secondary" onClick={() => setSuperphase(3)}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Retour Superphase 3
              </Button>

              <Button
                variant="primary"
                size="lg"
                glow
                onClick={() => {
                  soundFx.playWarpJump();
                  handleLaunchGame();
                }}
                className="font-bold text-sm bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 shadow-[0_0_25px_rgba(0,243,255,0.4)]"
              >
                VALIDER LE COMPTE-RENDU &amp; SAUT FTL VERS LE SECTEUR ZÉRO (CYCLE 1)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Council and Leader Dossier Modal */}
        <CouncilDossierModal
          isOpen={inspectingDossier.isOpen}
          onClose={() => setInspectingDossier({ isOpen: false })}
          poleId={inspectingDossier.poleId}
          isLeader={inspectingDossier.isLeader}
          leaderAvatarId={config.leader.avatarId || 'leader_vance'}
        />
      </div>
    </AppShell>
  );
}

