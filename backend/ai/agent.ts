import Groq from "groq-sdk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import type { LCDService } from '../application/services/lcdService.js';
import { PayloadValidator } from './validator.js';
import { AIExecutor } from './executor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

export class AIAgent {
  private executor: AIExecutor;
  private groq: Groq | null = null;
  private systemPrompt: string = "";

  constructor(private service: LCDService) {
    this.executor = new AIExecutor(service);

    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.service.logService.log('AI', `Loaded API Key: ${apiKey.substring(0, 8)}... (Total: ${apiKey.length})`);
      this.groq = new Groq({ apiKey });
    } else {
      this.service.logService.log('ERROR', `GROQ_API_KEY not found. Looked in: ${envPath}`);
    }

    try {
      const promptPath = path.join(__dirname, 'prompt.txt');
      this.systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (err) {
      this.systemPrompt = "You are an LCD controller. Output JSON actions.";
    }
  }

  private memory: { role: "user" | "assistant", content: string }[] = [];

  /**
   * Main entry point for user text -> LCD Action
   * Includes password validation for security.
   */
  public async handleUserRequest(userInput: string, providedPassword?: string, skipAuth: boolean = false): Promise<string> {
    try {
      // 1. Security Check
      const requiredPassword = process.env.AI_PASSWORD;
      if (!skipAuth && requiredPassword && providedPassword !== requiredPassword) {
        this.service.logService.log('ERROR', `Unauthorized AI Access Attempt: Password mismatch.`);
        return "❌ Access Denied: Invalid AI Password.";
      }

      this.service.logService.log('AI', `Processing request: "${userInput}"`);

      if (!this.groq) {
        return this.handleMockRequest(userInput);
      }

      const modelName = process.env.AI_MODEL || "llama3-8b-8192";
      
      // Build State Context Context
      const state = this.service.getState();
      const cursor = this.service.getCursorPosition();
      const stateContext = `
      [CURRENT LCD HARDWARE STATE]
      Display ON: ${state.displayOn}, Cursor ON: ${state.cursorOn}, Blink ON: ${state.blinkOn}
      Cursor Position: Row ${cursor.row}, Col ${cursor.col}
      Shift Offset: ${state.shiftOffset}
      DDRAM Preview (First 8 chars): ${Array.from(state.ddram.slice(0, 8)).map(c => String.fromCharCode(c)).join('')}
      `;

      // Build Messages Array
      const messages: any[] = [
        { role: "system", content: this.systemPrompt + "\n" + stateContext },
        ...this.memory,
        { role: "user", content: userInput }
      ];

      const chatCompletion = await this.groq.chat.completions.create({
        messages: messages,
        model: modelName,
        temperature: 0.1,
        response_format: { type: "json_object" }
      });

      const rawResponse = chatCompletion.choices[0]?.message?.content || "{}";
      const payload = PayloadValidator.parseAndValidate(rawResponse, false);

      // Update Memory
      this.memory.push({ role: "user", content: userInput });
      this.memory.push({ role: "assistant", content: rawResponse });
      if (this.memory.length > 10) this.memory = this.memory.slice(-10); // Keep last 5 turns

      if (payload.type === 'action') {
        this.service.logService.log('AI', `Executing Action Plan: ${payload.reason}`);
        await this.executor.execute(payload.commands);
        return `✅ Action completed: ${payload.reason}`;
      } else {
        return `🤖 AI: ${payload.message}`;
      }

    } catch (error: any) {
      this.service.logService.log('ERROR', `AI Pipeline Failed: ${error.message}`);
      return `❌ Error: ${error.message}`;
    }
  }

  private async handleMockRequest(userInput: string): Promise<string> {
    const p = userInput.toLowerCase();
    await new Promise(r => setTimeout(r, 600));

    let mockResponse = "";
    if (p.includes('hello') && p.includes('second line')) {
      mockResponse = '{"type":"action","commands":[{"cmd":"cursor","args":[1,0]},{"cmd":"print","args":["HELLO"]}],"reason":"Mock: Write HELLO on second line"}';
    } else {
      return `🤖 (Mock Mode) GROQ_API_KEY missing in .env. I understood: "${userInput}"`;
    }

    const payload = PayloadValidator.parseAndValidate(mockResponse, false);
    if (payload.type === 'action') {
      await this.executor.execute(payload.commands);
      return `✅ (Mock) ${payload.reason}`;
    }
    return `🤖 (Mock) ${payload.type}`;
  }
}
