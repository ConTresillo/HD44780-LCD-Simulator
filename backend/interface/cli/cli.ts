import * as readline from 'readline';
import { LCDService } from '../../application/services/lcdService.js';
import type { BusTrace } from '../../domain/lcd/types.js';
import { getRowOffsets } from '../../domain/lcd/lcdLayout.js';

const lcdService = new LCDService();

let lastTrace: BusTrace | null = null;
let currentData = 0;
const logs: string[] = [];
const MAX_LOGS = 10;

// Convert byte to readable character
function toChar(byte: number): string {
    if (byte >= 0x20 && byte <= 0x7E) return String.fromCharCode(byte);
    if (byte >= 0x00 && byte <= 0x07) return '■'; // CGRAM custom characters
    return '.';
}

function dumpDDRAM() {
    const state = lcdService.getState();
    let result = 'DDRAM Dump:\n';
    for (let i = 0; i < 80; i += 16) {
        let line = `${i.toString(16).padStart(2, '0').toUpperCase()}: `;
        for (let j = 0; j < 16 && (i + j) < 80; j++) {
            line += state.ddram[i + j].toString(16).padStart(2, '0').toUpperCase() + ' ';
        }
        result += line + '\n';
    }
    logs.push(result.trim());
}

function dumpCGRAM() {
    const state = lcdService.getState();
    let result = 'CGRAM Dump:\n';
    for (let i = 0; i < 64; i += 8) {
        let line = `${i.toString(16).padStart(2, '0').toUpperCase()}: `;
        for (let j = 0; j < 8 && (i + j) < 64; j++) {
            line += state.cgram[i + j].toString(16).padStart(2, '0').toUpperCase() + ' ';
        }
        result += line + '\n';
    }
    logs.push(result.trim());
}

function render() {
    // Clear screen and set cursor to top-left
    process.stdout.write('\x1B[2J\x1B[H');
    
    const state = lcdService.getState();
    const display = lcdService.getVisibleDisplay();
    const cursor = lcdService.getCursorPosition();

    console.log('=== HD44780 LCD SIMULATOR CLI ===\n');

    // A. LCD Display View
    console.log('--- LCD Display ---');
    const cols = display[0]?.length || 16;
    console.log('+' + '-'.repeat(cols) + '+');
    for (let r = 0; r < display.length; r++) {
        let rowStr = '|';
        for (let c = 0; c < display[r].length; c++) {
            let char = toChar(display[r][c]);
            if (cursor.row === r && cursor.col === c) {
                if (state.blinkOn) {
                    rowStr += `\x1b[7m${char}\x1b[0m`; // Invert for blink
                } else {
                    rowStr += `\x1b[4m${char}\x1b[0m`; // Underline for cursor
                }
            } else {
                rowStr += char;
            }
        }
        rowStr += '|';
        console.log(rowStr);
    }
    console.log('+' + '-'.repeat(cols) + '+\n');

    // B. Internal State
    console.log('--- Internal State ---');
    console.log(`Address Pointer : 0x${state.addressPointer.toString(16).padStart(2, '0').toUpperCase()} (${state.addressPointer})`);
    console.log(`RAM Mode        : ${state.ramType}`);
    console.log(`Entry Mode      : ${state.entryModeIncrement ? 'Inc' : 'Dec'}, Shift: ${state.entryModeShift}`);
    console.log(`Display Flags   : ON=${state.displayOn}, Cursor=${state.cursorOn}, Blink=${state.blinkOn}`);
    console.log(`Data Mode       : ${state.dataLength}-bit, ${state.numLines}-Line, ${state.font}`);
    console.log(`Shift Offset    : ${state.shiftOffset}`);
    console.log(`Initialized     : ${state.initialized} (Init Count: ${state.initCount})\n`);

    if (cursor.row !== -1) {
        console.log(`Cursor Location : Row ${cursor.row + 1}, Col ${cursor.col + 1} (DDRAM: 0x${state.addressPointer.toString(16).padStart(2, '0').toUpperCase()})\n`);
    } else {
        console.log(`Cursor Location : Hidden / Out of Bounds\n`);
    }

    // C. Memory Snapshot (Context-Aware)
    console.log('--- Memory Snapshot ---');
    const offsets = getRowOffsets(state.numLines === 1 ? 1 : 2);
    offsets.forEach((base, idx) => {
        let rowStr = `Row ${idx + 1} (0x${base.toString(16).padStart(2, '0').toUpperCase()}): `;
        for (let i = 0; i < 16; i++) {
            rowStr += state.ddram[base + i].toString(16).padStart(2, '0').toUpperCase() + ' ';
        }
        console.log(rowStr);
    });
    
    let cgramStr = 'CGRAM (00-07): ';
    for (let i = 0; i < 8; i++) {
        cgramStr += state.cgram[i].toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    console.log(cgramStr + '\n');

    // D. GPIO / Bus Status
    console.log('--- GPIO / Bus Status ---');
    console.log(`Pins : RS=${state.rs ? 1 : 0} RW=${state.rw ? 1 : 0} EN=${state.en ? 1 : 0} Data=0x${currentData.toString(16).padStart(2, '0').toUpperCase()}`);
    if (lastTrace) {
        console.log(`Last Trace: ${lastTrace.mode} ${lastTrace.nibblePhase || ''} Executed=${lastTrace.executed}`);
    } else {
        console.log('Last Trace: None');
    }
    console.log();

    // E. Timing
    console.log('--- Timing ---');
    const now = performance.now();
    let remaining = state.busyUntil - now;
    if (remaining < 0) remaining = 0;
    console.log(`Busy Flag  : ${state.busyFlag}`);
    console.log(`Busy Until : ${state.busyUntil} (${remaining}ms remaining)\n`);

    if (logs.length > 0) {
        console.log('--- Logs ---');
        // Filter out empty lines or limit height
        logs.slice(-MAX_LOGS).forEach(l => console.log(l));
        console.log();
    }

    rl.prompt(true);
}

// Event Integration
lcdService.eventBus.subscribe(event => {
    let shouldRender = false;
    
    if (event.type === 'STATE_UPDATED') {
        shouldRender = true;
    } else if (event.type === 'GPIO_TRACE') {
        lastTrace = (event as any).trace;
        shouldRender = true;
    } else if (event.type === 'LOG' || event.type === 'ERROR') {
        const msg = event.type === 'ERROR' ? (event as any).message : (event as any).log;
        logs.push(typeof msg === 'string' ? msg : JSON.stringify(msg));
        if (logs.length > 50) logs.shift(); // Keep more in memory, but render limits slice
        shouldRender = true;
    }

    if (shouldRender) {
        render();
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'LCD> '
});

rl.on('line', (line) => {
    const parts = line.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    
    if (!cmd) {
        render();
        return;
    }

    try {
        switch (cmd) {
            case 'set':
                if (parts.length < 3) {
                    logs.push('Usage: set <data|rs|rw|en> <value>');
                    break;
                }
                const sub = parts[1].toLowerCase();
                const val = parts[2];
                if (sub === 'data') {
                    currentData = parseInt(val, val.startsWith('0x') ? 16 : 10);
                    logs.push(`Data set to 0x${currentData.toString(16).toUpperCase()}`);
                } else if (sub === 'rs') {
                    const rs = val === '1' || val === 'true';
                    lcdService.processGPIO(currentData, rs, lcdService.state.en, lcdService.state.rw);
                } else if (sub === 'rw') {
                    const rw = val === '1' || val === 'true';
                    lcdService.processGPIO(currentData, lcdService.state.rs, lcdService.state.en, rw);
                } else if (sub === 'en') {
                    const en = val === '1' || val === 'true';
                    lcdService.processGPIO(currentData, lcdService.state.rs, en, lcdService.state.rw);
                }
                break;
            case 'pulse':
                if (parts[1]?.toLowerCase() === 'en') {
                    lcdService.processGPIO(currentData, lcdService.state.rs, true, lcdService.state.rw);
                    lcdService.processGPIO(currentData, lcdService.state.rs, false, lcdService.state.rw);
                    logs.push('Pulsed EN (1 -> 0)');
                }
                break;
            case 'state':
                logs.push('LCD State: ' + JSON.stringify(lcdService.getState(), (key, val) => 
                    key === 'ddram' || key === 'cgram' ? `Uint8Array(${val.length})` : val, 2));
                break;
            case 'ddram':
                dumpDDRAM();
                break;
            case 'cgram':
                dumpCGRAM();
                break;
            case 'trace':
                logs.push('Last Trace: ' + JSON.stringify(lastTrace, null, 2));
                break;
            case 'command':
            case 'cmd':
                if (parts.length > 1) {
                    const byte = parseInt(parts[1], parts[1].startsWith('0x') ? 16 : 10);
                    lcdService.sendCommand(byte);
                } else {
                    logs.push('Usage: command <byte>');
                }
                break;
            case 'write':
            case 'data':
                if (parts.length > 1) {
                    let byte = 0;
                    if (parts[1].startsWith('0x')) {
                        byte = parseInt(parts[1], 16);
                    } else if (parts[1].length === 1 && !/\d/.test(parts[1])) {
                        byte = parts[1].charCodeAt(0);
                    } else {
                        byte = parseInt(parts[1], 10);
                    }
                    lcdService.writeData(byte);
                } else {
                    logs.push('Usage: write <byte>');
                }
                break;
            case 'gpio':
                if (parts.length >= 5) {
                    const data = parseInt(parts[1], parts[1].startsWith('0x') ? 16 : 10);
                    const rs = parseInt(parts[2], 10) > 0 || parts[2] === 'true';
                    const rw = parseInt(parts[3], 10) > 0 || parts[3] === 'true';
                    const en = parseInt(parts[4], 10) > 0 || parts[4] === 'true';
                    lcdService.processGPIO(data, rs, en, rw);
                } else {
                    logs.push('Usage: gpio <data> <rs> <rw> <en>');
                }
                break;
            case 'reset':
                lcdService.reset();
                logs.push('LCD Reset triggered');
                break;
            case 'clrscrn':
                process.stdout.write('\x1B[3J'); // Clear scrollback
                logs.length = 0;
                break;
            case 'exit':
            case 'quit':
                process.stdout.write('\x1B[2J\x1B[H');
                console.log('Exiting LCD Simulator CLI.');
                process.exit(0);
                break;
            default:
                logs.push(`Unknown command: ${cmd}`);
                break;
        }
    } catch (e: any) {
        logs.push('Error: ' + e.message);
    }
    
    render();
});

// Initial startup
render();
