import type { LCDService } from '../../application/services/lcdService.js';
import type { ClientMessage } from './types.js';

import type { AIAgent } from '../../ai/agent.js';

export function handleMessage(msg: ClientMessage, service: LCDService, aiAgent?: AIAgent, isAIAuth: boolean = false): void {
  try {
    if (!msg || !msg.type) {
      throw new Error("Invalid message format");
    }

    switch (msg.type) {
      case 'COMMAND':
        service.sendCommand(msg.byte);
        break;
      case 'WRITE':
        service.writeData(msg.byte);
        break;
      case 'RESET':
        service.reset();
        break;
      case 'GPIO_SIGNAL':
        service.processGPIO(msg.data, msg.rs, msg.en, msg.rw);
        break;
      case 'UPDATE_CONFIG':
        service.updateConfig(msg.config);
        break;
      case 'PULSE_GPIO':
        service.pulseGPIO(msg.data, msg.rs, msg.rw);
        break;
      case 'UPDATE_GLYPH':
        service.updateGlyph(msg.index, msg.bitmap);
        break;
      case 'AI_REQUEST':
        if (!isAIAuth) {
          service.logService.log('ERROR', 'Blocked unauthenticated AI request via WebSocket.');
          break;
        }
        if (aiAgent) {
          service.logService.log('AI', `Received remote prompt: "${msg.prompt}"`);
          aiAgent.handleUserRequest(msg.prompt, msg.password, isAIAuth).then(response => {
            service.logService.log('AI', `Remote AI response: ${response}`);
          }).catch(err => {
            service.logService.log('ERROR', `AI Pipeline Failed: ${err.message}`);
          });
        } else {
          service.logService.log('ERROR', 'AI Agent not initialized on server');
        }
        break;
      default:
        throw new Error(`Unknown message type: ${(msg as any).type}`);
    }
  } catch (err: any) {
    service.eventBus.emit({ type: 'ERROR', message: err.message });
  }
}
