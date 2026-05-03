export interface BusTrace {
  timestamp: number;
  rs: boolean;
  rw: boolean;
  en: boolean;
  data: number;
  mode: '4bit' | '8bit';
  nibblePhase: 'HIGH' | 'LOW' | null;
  pendingNibble: number | null;
  assembledByte: number | null;
  readByte: number | null;
  executed: boolean;
  instruction?: string;
}
