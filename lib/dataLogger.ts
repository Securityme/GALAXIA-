'use client';

import { create } from 'zustand';

export type LogLevel = 'INFO' | 'TACTICAL' | 'RESOURCE_DELTA' | 'INVARIANT_AUDIT' | 'AI_TELEMETRY' | 'CRITICAL';

export interface DataLogEntry {
  id: string;
  timestamp: string;
  cycle: number;
  phase: number;
  level: LogLevel;
  source: string; // e.g. "DecisionEngine", "TechMatrix", "ColonyManager", "GeminiAI", "L0_Audit"
  message: string;
  details?: Record<string, any>;
  invariantPassed?: boolean;
}

interface DataLoggerStore {
  logs: DataLogEntry[];
  activeFilter: LogLevel | 'ALL';
  logEvent: (level: LogLevel, source: string, message: string, details?: Record<string, any>, cycle?: number, phase?: number) => void;
  setFilter: (filter: LogLevel | 'ALL') => void;
  clearLogs: () => void;
  exportJSON: () => string;
  exportCSV: () => string;
}

const MAX_LOGS = 500;

export const useDataLogger = create<DataLoggerStore>((set, get) => ({
  logs: [],
  activeFilter: 'ALL',

  logEvent: (level, source, message, details = {}, cycle = 1, phase = 1) => {
    const entry: DataLogEntry = {
      id: `LOG_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      cycle,
      phase,
      level,
      source,
      message,
      details,
      invariantPassed: details?.invariantPassed ?? true,
    };

    set((state) => {
      const updated = [entry, ...state.logs].slice(0, MAX_LOGS);
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('galaxia_latest_logs', JSON.stringify(updated.slice(0, 50)));
        } catch {}
      }
      return { logs: updated };
    });
  },

  setFilter: (filter) => set({ activeFilter: filter }),

  clearLogs: () => {
    set({ logs: [] });
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('galaxia_latest_logs');
    }
  },

  exportJSON: () => {
    return JSON.stringify(get().logs, null, 2);
  },

  exportCSV: () => {
    const logs = get().logs;
    if (logs.length === 0) return 'timestamp,cycle,phase,level,source,message\n';
    const header = 'timestamp,cycle,phase,level,source,message\n';
    const rows = logs.map(l => 
      `"${l.timestamp}",${l.cycle},${l.phase},"${l.level}","${l.source}","${l.message.replace(/"/g, '""')}"`
    ).join('\n');
    return header + rows;
  }
}));

// Global convenient helper function
export const logger = {
  info: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('INFO', source, msg, details),
  warn: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('TACTICAL', source, msg, details),
  error: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('CRITICAL', source, msg, details),
  tactical: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('TACTICAL', source, msg, details),
  resourceDelta: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('RESOURCE_DELTA', source, msg, details),
  invariantAudit: (source: string, msg: string, passed: boolean, details?: any) => 
    useDataLogger.getState().logEvent('INVARIANT_AUDIT', source, msg, { ...details, invariantPassed: passed }),
  aiTelemetry: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('AI_TELEMETRY', source, msg, details),
  critical: (source: string, msg: string, details?: any) => 
    useDataLogger.getState().logEvent('CRITICAL', source, msg, details),
};
