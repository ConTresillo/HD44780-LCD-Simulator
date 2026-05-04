import * as readline from 'readline';
import WebSocket from 'ws';
import type { ServerMessage, ClientMessage } from '../ws/types.js';

// 1. Priority: Command Line Arg > ENV > Default
const argUrl = process.argv.find(arg => arg.startsWith('--url='))?.split('=')[1];
const envUrl = process.env.LCD_SERVER_URL;
const envPort = process.env.PORT || '3000';

const URL = argUrl || envUrl || `ws://localhost:${envPort}`;

let lastState: any = null;
let lastView: any = null;
let currentData = 0;
let rs = false;
let rw = false;
const logs: string[] = [];
const MAX_LOGS = 10;

const ws = new WebSocket(URL);

function toChar(byte: number): string {
    if (byte >= 0x20 && byte <= 0x7E) return String.fromCharCode(byte);
    if (byte >= 0x00 && byte <= 0x07) return '■';
    return '.';
}

function render() {
    if (!lastState || !lastView) {
        process.stdout.write('\x1B[2J\x1B[H');
        console.log('Connecting to LCD Server...');
        return;
    }

    process.stdout.write('\x1B[2J\x1B[H');
    
    console.log('=== HD44780 REMOTE CLI DEBUGGER ===');
    console.log(`Connected to: ${URL}\n`);

    // A. LCD Display View
    console.log('--- LCD Display ---');
    const display = lastView.display;
    const cursor = lastView.cursor;
    const cols = lastView.cols || 16;
    
    console.log('+' + '-'.repeat(cols) + '+');
    for (let r = 0; r < display.length; r++) {
        let rowStr = '|';
        for (let c = 0; c < display[r].length; c++) {
            let char = toChar(display[r][c]);
            if (cursor.row === r && cursor.col === c && lastView.cursorVisible) {
                if (lastState.blinkOn) {
                    rowStr += `\x1b[7m${char}\x1b[0m`;
                } else {
                    rowStr += `\x1b[4m${char}\x1b[0m`;
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
    console.log(`Address Pointer : 0x${lastState.addressPointer.toString(16).padStart(2, '0').toUpperCase()} (${lastState.addressPointer})`);
    console.log(`RAM Mode        : ${lastState.ramType}`);
    console.log(`Entry Mode      : ${lastState.entryModeIncrement ? 'Inc' : 'Dec'}, Shift: ${lastState.entryModeShift}`);
    console.log(`Display Flags   : ON=${lastState.displayOn}, Cursor=${lastState.cursorOn}, Blink=${lastState.blinkOn}`);
    console.log(`Data Mode       : ${lastState.dataLength}-bit, ${lastState.numLines}-Line, ${lastState.font}`);
    console.log(`Initialized     : ${lastState.initialized}\n`);

    // C. GPIO / Bus Status
    console.log('--- GPIO Status (Local) ---');
    console.log(`Target Pins : RS=${rs ? 1 : 0} RW=${rw ? 1 : 0} Data=0x${currentData.toString(16).padStart(2, '0').toUpperCase()}`);
    console.log(`Busy Flag   : ${lastState.busyFlag}\n`);

    if (logs.length > 0) {
        console.log('--- Server Logs ---');
        logs.slice(-MAX_LOGS).forEach(l => console.log(l));
        console.log();
    }

    rl.prompt(true);
}

ws.on('open', () => {
    logs.push('Connected to server.');
    render();
});

ws.on('message', (data) => {
    try {
        const msg: any = JSON.parse(data.toString());
        if (msg.type === 'STATE_UPDATE') {
            lastState = msg.state;
            lastView = msg.view;
            render();
        } else if (msg.type === 'LOG_EVENT') {
            logs.push(`LOG: ${msg.log.message}`);
            render();
        } else if (msg.type === 'ERROR') {
            logs.push(`ERROR: ${msg.message}`);
            render();
        } else if (msg.type === 'GPIO_TRACE') {
            logs.push(`TRACE: ${msg.trace.mode} ${msg.trace.nibblePhase || ''} Executed=${msg.trace.executed}`);
            render();
        }
    } catch (e) {
        // Ignore parse errors
    }
});

ws.on('close', () => {
    console.log('\nDisconnected from server.');
    process.exit(0);
});

ws.on('error', (err) => {
    console.error('\nSocket Error:', err.message);
    process.exit(1);
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'REMOTE> '
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
                    logs.push('Usage: set <data|rs|rw> <value>');
                    break;
                }
                const sub = parts[1].toLowerCase();
                const val = parts[2];
                if (sub === 'data') {
                    currentData = parseInt(val, val.startsWith('0x') ? 16 : 10);
                    logs.push(`Local Data set to 0x${currentData.toString(16).toUpperCase()}`);
                } else if (sub === 'rs') {
                    rs = val === '1' || val === 'true';
                    logs.push(`Local RS set to ${rs}`);
                } else if (sub === 'rw') {
                    rw = val === '1' || val === 'true';
                    logs.push(`Local RW set to ${rw}`);
                }
                break;
            case 'pulse':
                if (parts[1]?.toLowerCase() === 'en') {
                    const msg: ClientMessage = {
                        type: 'PULSE_GPIO',
                        data: currentData,
                        rs: rs,
                        rw: rw
                    };
                    ws.send(JSON.stringify(msg));
                    logs.push('Sent PULSE_GPIO to server');
                }
                break;
            case 'cmd':
            case 'command':
                if (parts.length > 1) {
                    const byte = parseInt(parts[1], parts[1].startsWith('0x') ? 16 : 10);
                    ws.send(JSON.stringify({ type: 'COMMAND', byte }));
                }
                break;
            case 'write':
                if (parts.length > 1) {
                    let byte = 0;
                    if (parts[1].startsWith('0x')) {
                        byte = parseInt(parts[1], 16);
                    } else if (parts[1].length === 1 && !/\d/.test(parts[1])) {
                        byte = parts[1].charCodeAt(0);
                    } else {
                        byte = parseInt(parts[1], 10);
                    }
                    ws.send(JSON.stringify({ type: 'WRITE', byte }));
                }
                break;
            case 'reset':
                ws.send(JSON.stringify({ type: 'RESET' }));
                break;
            case 'exit':
            case 'quit':
                ws.close();
                break;
            case 'ai':
                if (parts.length > 2) {
                    const password = parts[1];
                    const prompt = parts.slice(2).join(' ');
                    ws.send(JSON.stringify({ type: 'AI_REQUEST', prompt, password }));
                    logs.push(`🤖 Sent Authenticated AI prompt to server: "${prompt}"`);
                } else {
                    logs.push('Usage: ai <password> <your instruction>');
                }
                break;
            default:
                logs.push(`Unknown remote command: ${cmd}`);
                break;
        }
    } catch (e: any) {
        logs.push('Error: ' + e.message);
    }
    
    render();
});

render();
