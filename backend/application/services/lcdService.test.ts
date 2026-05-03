import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LCDService } from './lcdService';
import { EventType, LCDEvent } from '../events/eventBus';

describe('LCD Application Layer (Phase 2)', () => {
  let service: LCDService;

  beforeEach(() => {
    service = new LCDService();
    // Initialize hardware
    service.sendCommand(0x30);
    service.sendCommand(0x30);
    service.sendCommand(0x30);
    forceReady();
  });

  const forceReady = () => {
    service.state.busyFlag = false;
    service.state.busyUntil = 0;
  };

  it('should initialize successfully', () => {
    expect(service.state).toBeDefined();
    expect(service.configService.getConfig().displayCols).toBe(16);
  });

  it('should emit events on state updates during command execution', () => {
    const listener = vi.fn();
    service.eventBus.subscribe(listener);

    service.sendCommand(0x01); // Clear display
    forceReady();

    // COMMAND_EXECUTED and STATE_UPDATED Should be emitted
    const emittedTypes = listener.mock.calls.map(call => (call[0] as LCDEvent).type);
    expect(emittedTypes).toContain('STATE_UPDATED');
    expect(emittedTypes).toContain('COMMAND_EXECUTED');
  });

  it('should record logs during operations', () => {
    // Logs from init pulses are not recorded because dispatchCommand returns false for them
    const initialLogCount = service.logService.getLogs().length;

    service.writeData(0x41); // 'A'
    forceReady();
    service.sendCommand(0x01); // Clear
    forceReady();
    
    const logs = service.logService.getLogs();
    
    expect(logs.length).toBe(initialLogCount + 2);
    expect(logs[initialLogCount].type).toBe('DATA');
    expect(logs[initialLogCount].message).toContain('A');
    
    expect(logs[initialLogCount + 1].type).toBe('COMMAND');
    expect(logs[initialLogCount + 1].message).toContain('01');
  });

  it('should prevent external direct state mutation by using clone', () => {
    const state = service.getState();
    state.addressPointer = 99; // Mutate clone
    
    expect(service.getState().addressPointer).toBe(0); // Original must remain unchanged
  });

  it('should pass the specific end-to-end integration flow from Phase 2', () => {
    // We already initialized in beforeEach
    const listener = vi.fn();
    service.eventBus.subscribe(listener);

    service.clearDisplay(); // 1 command
    forceReady();
    service.writeData('H'); // 1 write
    forceReady();
    service.writeData('i'); // 1 write
    forceReady();

    // Check DOMAIN rules hold
    const state = service.getState();
    expect(state.ddram[0]).toBe(0x48); // H
    expect(state.ddram[1]).toBe(0x69); // i
    expect(state.addressPointer).toBe(2);

    // Check APP RULES hold
    const logs = service.logService.getLogs();
    // 3 actions in this test. (Init pulses are NOT logged as they are filtered in dispatcher)
    expect(logs.length).toBe(3); 

    // 3 STATE_UPDATED events must be emitted (one for each action in this test)
    const stateUpdateEvents = listener.mock.calls.filter(call => (call[0] as LCDEvent).type === 'STATE_UPDATED');
    expect(stateUpdateEvents.length).toBe(3);
  });
});
