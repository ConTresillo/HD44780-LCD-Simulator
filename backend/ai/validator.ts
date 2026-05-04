import type { AIPayload, AICommand, AllowedCommand } from './types.js';

const ALLOWED_COMMANDS = new Set<AllowedCommand>([
  'cmd', 'data', 'reset', 'pulse', 'set', 'gpio', 'state', 'trace',
  'ddram', 'print', 'writec', 'cursor', 'clear', 'home', 'display',
  'cursor_mode', 'blink', 'shift', 'undo'
]);

// Security rule: block low level commands unless explicit bypass
const BLOCKED_BY_DEFAULT = new Set(['set', 'gpio', 'pulse']);

export class PayloadValidator {
  
  static validate(json: any, allowLowLevel = false): AIPayload {
    if (!json || typeof json !== 'object') {
      throw new Error("Payload must be a JSON object");
    }

    if (json.type === 'response') {
      if (typeof json.message !== 'string') {
        throw new Error("Response payload must include a 'message' string");
      }
      return json as AIPayload;
    }

    if (json.type === 'action') {
      if (!Array.isArray(json.commands)) {
        throw new Error("Action payload must include a 'commands' array");
      }
      
      if (json.commands.length > 5) {
        throw new Error("Exceeded maximum commands per request (limit: 5)");
      }

      if (typeof json.reason !== 'string') {
        throw new Error("Action payload must include a 'reason' string");
      }

      // Validate each command
      for (const cmdObj of json.commands) {
        if (!cmdObj.cmd || typeof cmdObj.cmd !== 'string') {
          throw new Error("Each command must have a 'cmd' string field");
        }

        const cmdName = cmdObj.cmd as AllowedCommand;

        if (!ALLOWED_COMMANDS.has(cmdName)) {
          throw new Error(`Command not allowed: ${cmdName}`);
        }

        if (!allowLowLevel && BLOCKED_BY_DEFAULT.has(cmdName)) {
          throw new Error(`Low-level command blocked by security policy: ${cmdName}`);
        }

        if (cmdObj.args !== undefined && !Array.isArray(cmdObj.args)) {
          throw new Error(`Args for command '${cmdName}' must be an array`);
        }
      }

      return json as AIPayload;
    }

    throw new Error("Payload type must be 'action' or 'response'");
  }

  static parseAndValidate(rawString: string, allowLowLevel = false): AIPayload {
    let parsed;
    try {
      // Find the first '{' and last '}' to handle LLM markdown wrapping (```json ... ```)
      const start = rawString.indexOf('{');
      const end = rawString.lastIndexOf('}');
      if (start === -1 || end === -1) {
        throw new Error("No JSON object found in output");
      }
      const cleanJsonString = rawString.slice(start, end + 1);
      parsed = JSON.parse(cleanJsonString);
    } catch (e: any) {
      throw new Error(`Your output was invalid JSON. Fix format. Details: ${e.message}`);
    }

    return this.validate(parsed, allowLowLevel);
  }
}
