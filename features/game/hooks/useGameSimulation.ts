'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameSimulation() {
  const {
    currentPhase,
    phase1Event,
    phase2Event,
    phase3Event,
    isPhase1Completed,
    isPhase2Completed,
    isPhase3Completed,
    isGeneratingEvent,
    resources,
    astra,
    council,
    eraId,
    difficulty,
    setEvent,
    setIsGeneratingEvent,
    resolveChoice,
    advanceToNextPhase,
    isGameOver
  } = useGameStore();

  const fetchPhaseEvent = useCallback(async (phase: 1 | 2 | 3) => {
    // If event already exists for this phase, do not refetch
    if (phase === 1 && phase1Event) return;
    if (phase === 2 && phase2Event) return;
    if (phase === 3 && phase3Event) return;

    try {
      setIsGeneratingEvent(true);
      const res = await fetch('/api/game/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          turn: resources.turn,
          eraId,
          difficulty,
          resources,
          astra,
          council
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.event) {
        setEvent(phase, data.event);
      }
    } catch (err) {
      console.warn('Failed to fetch AI scenario event, using local fallback:', err);
    } finally {
      setIsGeneratingEvent(false);
    }
  }, [
    phase1Event, 
    phase2Event, 
    phase3Event, 
    resources, 
    astra, 
    council, 
    eraId, 
    difficulty, 
    setEvent, 
    setIsGeneratingEvent
  ]);

  // Trigger event generation when entering a phase
  useEffect(() => {
    if (isGameOver) return;
    if (currentPhase === 1 && !phase1Event && !isPhase1Completed) {
      fetchPhaseEvent(1);
    } else if (currentPhase === 2 && !phase2Event && !isPhase2Completed) {
      fetchPhaseEvent(2);
    } else if (currentPhase === 3 && !phase3Event && !isPhase3Completed) {
      fetchPhaseEvent(3);
    }
  }, [
    currentPhase, 
    phase1Event, 
    phase2Event, 
    phase3Event, 
    isPhase1Completed, 
    isPhase2Completed, 
    isPhase3Completed, 
    isGameOver, 
    fetchPhaseEvent
  ]);

  return {
    currentPhase,
    activeEvent: currentPhase === 1 ? phase1Event : currentPhase === 2 ? phase2Event : phase3Event,
    isPhaseResolved: currentPhase === 1 ? isPhase1Completed : currentPhase === 2 ? isPhase2Completed : isPhase3Completed,
    isGeneratingEvent,
    resolveChoice,
    advanceToNextPhase,
    refreshCurrentEvent: () => fetchPhaseEvent(currentPhase)
  };
}
