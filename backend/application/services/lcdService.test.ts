import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LCDService } from './lcdService';
import { EventType, LCDEvent } from '../events/eventBus';

describe('LCD Application Layer (Phase 2)', () => {
  let service: LCDService;

  beforeEach(() => {
    service = new LCDService();
  });

  it('should initialize successfully', () => {
    expect(service.state).toBeDefined();
    expect(service.configService.getConfig().displayCols).toBe(16);
  });

  it('should emit events on state updates during command execution', () => {
    const listener = vi.fn();
    service.eventBus.subscribe(listener);

    service.sendCommand(0x01); // Clear display

    expect(listener).toHaveBeenCalled();
    // At least COMMAND_EXECUTED and STATE_UPDATED Should be emitted
    const emittedTypes = listener.mock.calls.map(call => (call[0] as LCDEvent).type);
    expect(emittedTypes).toContain('STATE_UPDATED');
    expect(emittedTypes).toContain('COMMAND_EXECUTED');
  });

  it('should record logs during operations', () => {
    service.writeData(0x41); // 'A'
    service.sendCommand(0x01); // Clear
    
    // Write generates LOG, Command generates LOG
    const logs = service.logService.getLogs();
    
    expect(logs.length).toBe(2);
    expect(logs[0].type).toBe('DATA');
    expect(logs[0].message).toContain('A');
    
    expect(logs[1].type).toBe('COMMAND');
    expect(logs[1].message).toContain('01');
  });

  it('should prevent external direct state mutation by using clone', () => {
    const state = service.getState();
    state.addressPointer = 99; // Mutate clone
    
    expect(service.getState().addressPointer).toBe(0); // Original must remain unchanged
  });

  it('should pass the specific end-to-end integration flow from Phase 2', () => {
    const listener = vi.fn();
    service.eventBus.subscribe(listener);

    service.clearDisplay(); // 1 command
    service.writeData('H'); // 1 write
    service.writeData('i'); // 1 write

    // Check DOMAIN rules hold
    const state = service.getState();
    expect(state.ddram[0]).toBe(0x48); // H
    expect(state.ddram[1]).toBe(0x69); // i
    expect(state.addressPointer).toBe(2);

    // Check APP RULES hold
    const logs = service.logService.getLogs();
    expect(logs.length).toBe(3); // 3 actions performed

    // 3 STATE_UPDATED events must be emitted (one for each action)
    const stateUpdateEvents = listener.mock.calls.filter(call => (call[0] as LCDEvent).type === 'STATE_UPDATED');
    expect(stateUpdateEvents.length).toBe(3);
  });
});
