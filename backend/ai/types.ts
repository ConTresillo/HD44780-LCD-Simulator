export type AllowedCommand =
  | 'cmd'
  | 'data'
  | 'reset'
  | 'pulse'
  | 'set'
  | 'gpio'
  | 'state'
  | 'trace'
  | 'ddram'
  | 'print'
  | 'writec'
  | 'cursor'
  | 'clear'
  | 'home'
  | 'display'
  | 'cursor_mode'
  | 'blink'
  | 'shift'
  | 'undo';

export interface AICommand {
  cmd: AllowedCommand;
  args?: any[];
}

export interface AIActionPayload {
  type: 'action';
  commands: AICommand[];
  reason: string;
}

export interface AIResponsePayload {
  type: 'response';
  message: string;
}

export type AIPayload = AIActionPayload | AIResponsePayload;
