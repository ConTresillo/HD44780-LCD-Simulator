import { dispatchCommand } from './dispatcher.js';
import { writeData } from './writeEngine.js';
import { updateBusyStatus, setBusy } from './lcdTiming.js';
/**
 * Hardware Bus Interface
 *
 * Simulated logic for handling 8-bit and 4-bit parallel interfaces.
 * Processes data on the falling edge of the Enable (EN) pin.
 */
export function processBusSignal(state, data, rs, en, rw = false) {
    const fallingEdge = state.en && !en;
    state.en = en;
    state.rs = rs;
    state.rw = rw; // Added RW state
    const trace = {
        timestamp: Date.now(),
        rs,
        rw,
        en,
        data,
        mode: state.dataLength === 8 ? '8bit' : '4bit',
        nibblePhase: null,
        pendingNibble: state.pendingNibble,
        assembledByte: null,
        readByte: null,
        executed: false,
    };
    if (!fallingEdge) {
        return { trace, hadFallingEdge: false };
    }
    // Falling edge triggered: Process transaction
    if (state.dataLength === 8) {
        // 8-BIT MODE
        if (rw === false) {
            // WRITE
            trace.assembledByte = data;
            trace.executed = executeBusCycle(state, data, rs, false, trace);
        }
        else {
            // READ
            trace.readByte = performRead(state, rs);
            trace.executed = true;
        }
    }
    else {
        // 4-BIT MODE
        const currentNibble = data & 0xF0;
        if (state.pendingNibble === null) {
            // First nibble (High nibble)
            state.pendingNibble = currentNibble;
            state.pendingRs = rs;
            state.pendingRw = rw;
            trace.nibblePhase = 'HIGH';
        }
        else {
            const currentRs = state.pendingRs ?? rs;
            const currentRw = state.pendingRw ?? rw;
            if (currentRw === false) {
                // WRITE: Assemble full byte from two nibbles
                const fullByte = state.pendingNibble | ((data >> 4) & 0x0F);
                trace.assembledByte = fullByte;
                trace.executed = executeBusCycle(state, fullByte, currentRs, false, trace);
            }
            else {
                // READ: Put data on bus (simulated as readByte in trace)
                trace.readByte = performRead(state, currentRs);
                trace.executed = true;
            }
            trace.nibblePhase = 'LOW';
            state.pendingNibble = null;
            state.pendingRs = null;
            state.pendingRw = null;
        }
    }
    return { trace, hadFallingEdge: true };
}
function performRead(state, rs) {
    updateBusyStatus(state);
    if (rs === false) {
        // RS=0, RW=1: Read Busy Flag and Address Counter
        const bf = state.busyFlag ? 0x80 : 0x00;
        const ac = state.addressPointer & 0x7F;
        return bf | ac;
    }
    else {
        // RS=1, RW=1: Read Data from DDRAM/CGRAM
        if (state.ramType === 'DDRAM') {
            return state.ddram[state.addressPointer] ?? 0x20;
        }
        else {
            return state.cgram[state.addressPointer] ?? 0x00;
        }
    }
}
function getInstructionName(byte, rs) {
    if (rs)
        return `Write Data ('${String.fromCharCode(byte)}')`;
    if (byte === 0x01)
        return 'Clear Display';
    if (byte === 0x02)
        return 'Return Home';
    if ((byte & 0xFC) === 0x04)
        return 'Entry Mode Set';
    if ((byte & 0xF8) === 0x08)
        return 'Display Control';
    if ((byte & 0xF0) === 0x10)
        return 'Cursor/Display Shift';
    if ((byte & 0xE0) === 0x20)
        return 'Function Set';
    if ((byte & 0xC0) === 0x40)
        return 'Set CGRAM Address';
    if ((byte & 0x80) === 0x80)
        return 'Set DDRAM Address';
    return `Unknown (0x${byte.toString(16).toUpperCase()})`;
}
function executeBusCycle(state, byte, rs, rw, trace) {
    updateBusyStatus(state);
    trace.instruction = getInstructionName(byte, rs);
    // Busy check blocks WRITES only (in real hardware, status reads work while busy)
    if (state.busyFlag && rw === false)
        return false;
    if (rs) {
        // Data Write
        writeData(byte, state);
        setBusy(state, 0xFF);
        return true;
    }
    else {
        // Command Write
        const handled = dispatchCommand(byte, state);
        if (handled) {
            setBusy(state, byte);
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=busInterface.js.map