'use client';

import { useState, useCallback } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { useGameStore } from '../store/gameStore';

export interface CloudSaveMetadata {
  id: string;
  saveName: string;
  turn: number;
  eraId: string;
  difficulty: string;
  leaderName: string;
  stateJson: string;
  updatedAt: string;
}

export function useFirebaseSync() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [cloudSaves, setCloudSaves] = useState<CloudSaveMetadata[]>([]);
  const [loadingSaves, setLoadingSaves] = useState(false);

  const { getSealedStateString, resources, eraId, difficulty, leader } = useGameStore();

  const saveCurrentGame = useCallback(async (customSaveName?: string) => {
    setIsSaving(true);
    setSaveSuccessMessage(null);

    const sealedJson = getSealedStateString();
    const saveId = `save_${Date.now()}`;
    const name = customSaveName || `Galaxia Save - Cycle ${resources.turn}`;
    const user = auth.currentUser;

    // Local mirror always works
    try {
      localStorage.setItem(`galaxia_local_${saveId}`, JSON.stringify({
        id: saveId,
        saveName: name,
        turn: resources.turn,
        eraId,
        difficulty,
        leaderName: leader.name,
        stateJson: sealedJson,
        updatedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    if (!user) {
      setIsSaving(false);
      setSaveSuccessMessage('Sauvegarde locale scellée avec succès (Mode Invité)');
      return { success: true, isLocalOnly: true };
    }

    const path = `savedGames/${saveId}`;
    try {
      await setDoc(doc(db, 'savedGames', saveId), {
        id: saveId,
        userId: user.uid,
        saveName: name,
        turn: resources.turn,
        eraId,
        difficulty,
        leaderName: leader.name,
        stateJson: sealedJson,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setIsSaving(false);
      setSaveSuccessMessage('État scellé synchronisé sur Cloud Firestore !');
      return { success: true, isLocalOnly: false };
    } catch (error) {
      setIsSaving(false);
      try {
        handleFirestoreError(error, OperationType.WRITE, path);
      } catch (handled) {
        console.warn('Firebase save fallback to local:', handled);
      }
      return { success: true, isLocalOnly: true };
    }
  }, [getSealedStateString, resources, eraId, difficulty, leader]);

  const fetchSaves = useCallback(async () => {
    setLoadingSaves(true);
    const user = auth.currentUser;
    const savesList: CloudSaveMetadata[] = [];

    // Check local storage saves first
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('galaxia_local_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            savesList.push(JSON.parse(raw));
          }
        }
      }
    } catch (e) {
      console.warn('Error reading local saves:', e);
    }

    if (user) {
      const path = 'savedGames';
      try {
        const q = query(
          collection(db, path),
          where('userId', '==', user.uid)
        );
        const snap = await getDocs(q);
        snap.forEach((d) => {
          const data = d.data();
          // avoid duplicates if already present from local
          if (!savesList.some((s) => s.id === data.id)) {
            savesList.push(data as CloudSaveMetadata);
          }
        });
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch (e) {
          console.warn('Error listing cloud saves:', e);
        }
      }
    }

    savesList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setCloudSaves(savesList);
    setLoadingSaves(false);
  }, []);

  const deleteSave = useCallback(async (saveId: string) => {
    try {
      localStorage.removeItem(`galaxia_local_${saveId}`);
    } catch (e) {
      // ignore
    }
    const user = auth.currentUser;
    if (user) {
      const path = `savedGames/${saveId}`;
      try {
        await deleteDoc(doc(db, 'savedGames', saveId));
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.DELETE, path);
        } catch (e) {
          console.warn('Cloud delete error:', e);
        }
      }
    }
    setCloudSaves((prev) => prev.filter((s) => s.id !== saveId));
  }, []);

  const submitLeaderboardRecord = useCallback(async (score: number, status: string = 'En cours') => {
    const user = auth.currentUser;
    if (!user) return;
    const entryId = `lead_${Date.now()}`;
    const path = `leaderboard/${entryId}`;
    try {
      await setDoc(doc(db, 'leaderboard', entryId), {
        id: entryId,
        userId: user.uid,
        commanderName: user.displayName || leader.name || 'Amiral de Flotte',
        turnsSurvived: resources.turn,
        eraTitle: eraId,
        score,
        status,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Leaderboard submission warning:', err);
    }
  }, [resources, leader, eraId]);

  return {
    isSaving,
    saveSuccessMessage,
    cloudSaves,
    loadingSaves,
    saveCurrentGame,
    fetchSaves,
    deleteSave,
    submitLeaderboardRecord
  };
}
