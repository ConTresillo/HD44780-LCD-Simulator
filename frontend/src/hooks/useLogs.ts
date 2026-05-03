/**
 * useLogs.ts — Log stream hook.
 */
import { useLogsStore } from '../store/store';
import type { LogEntry } from '../services/api.types';

export function useLogs(): LogEntry[] {
  return useLogsStore();
}
