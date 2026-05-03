// ── ROM character lookup (5x8 bitmaps for printable ASCII) ───────────────────
// Simplified: derive from charCode for demo, real ROM would be a full table
function getCharBitmap(charCode) {
    // 8 rows × 5 cols — simplified block pattern for non-space chars
    if (charCode === 0x20)
        return Array(8).fill(Array(5).fill(0));
    return [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ];
}
// ── Internal mock state ───────────────────────────────────────────────────────
function makeInitialState() {
    return {
        ddram: new Array(80).fill(0x20),
        cgram: new Array(64).fill(0),
        addressPointer: 0,
        ramType: 'DDRAM',
        displayOn: false,
        cursorOn: false,
        blinkOn: false,
        entryModeIncrement: true,
        entryModeShift: false,
        shiftOffset: 0,
        dataLength: 8,
        numLines: 2,
        font: '5x8',
        rs: false,
        rw: false,
        en: false,
        busyFlag: false,
        busyUntil: 0,
        initialized: false,
        initCount: 0,
        powerOnTime: Date.now(),
    };
}
function buildView(state, cols = 16, rows = 2) {
    const ROW_BASES = [0x00, 0x40, 0x14, 0x54];
    const display = [];
    if (!state.displayOn) {
        for (let r = 0; r < rows; r++)
            display.push(new Array(cols).fill(0x20));
        return { display, cursor: { row: -1, col: -1 }, cursorVisible: false, glyphs: [] };
    }
    for (let r = 0; r < rows; r++) {
        const base = ROW_BASES[r] ?? 0;
        const row = [];
        for (let c = 0; c < cols; c++) {
            const addr = base + ((c + state.shiftOffset) % 40);
            row.push(state.ddram[addr] ?? 0x20);
        }
        display.push(row);
    }
    // Cursor position
    let cursorRow = -1, cursorCol = -1, cursorVisible = false;
    if (state.displayOn && state.cursorOn && state.ramType === 'DDRAM') {
        for (let r = 0; r < rows; r++) {
            const base = ROW_BASES[r] ?? 0;
            if (state.addressPointer >= base && state.addressPointer < base + 40) {
                const offsetInLine = state.addressPointer - base;
                const col = (offsetInLine - state.shiftOffset + 40) % 40;
                if (col < cols) {
                    cursorRow = r;
                    cursorCol = col;
                    cursorVisible = true;
                }
            }
        }
    }
    // Glyphs (CGRAM custom chars) — simplified
    const glyphs = [];
    for (let i = 0; i < 8; i++) {
        const glyph = [];
        for (let row = 0; row < 8; row++) {
            const byte = state.cgram[i * 8 + row] ?? 0;
            glyph.push([4, 3, 2, 1, 0].map(bit => (byte >> bit) & 1));
        }
        glyphs.push(glyph);
    }
    return { display, cursor: { row: cursorRow, col: cursorCol }, cursorVisible, glyphs };
}
// ── Mock command processor ────────────────────────────────────────────────────
function processCommand(state, byte) {
    if (!state.initialized) {
        if ((byte & 0xE0) === 0x20) {
            const newCount = state.initCount + ((byte & 0x10) ? 1 : 0);
            return { initCount: newCount, initialized: newCount >= 3, dataLength: 8 };
        }
        return {};
    }
    if (byte === 0x01)
        return { ddram: new Array(80).fill(0x20), addressPointer: 0, shiftOffset: 0 };
    if (byte === 0x02)
        return { addressPointer: 0, shiftOffset: 0 };
    if ((byte & 0xFC) === 0x04)
        return { entryModeIncrement: !!(byte & 0x02), entryModeShift: !!(byte & 0x01) };
    if ((byte & 0xF8) === 0x08)
        return { displayOn: !!(byte & 0x04), cursorOn: !!(byte & 0x02), blinkOn: !!(byte & 0x01) };
    if ((byte & 0xF0) === 0x10) {
        const isDisplay = !!(byte & 0x08), isRight = !!(byte & 0x04);
        if (isDisplay) {
            const delta = isRight ? -1 : 1;
            return { shiftOffset: ((state.shiftOffset + delta) + 40) % 40 };
        }
        const delta = isRight ? 1 : -1;
        return { addressPointer: Math.max(0, state.addressPointer + delta) };
    }
    if ((byte & 0xE0) === 0x20) {
        return { dataLength: (byte & 0x10) ? 8 : 4, numLines: (byte & 0x08) ? 2 : 1, font: (byte & 0x04) ? '5x10' : '5x8' };
    }
    if ((byte & 0xC0) === 0x40)
        return { ramType: 'CGRAM', addressPointer: byte & 0x3F };
    if ((byte & 0x80) === 0x80)
        return { ramType: 'DDRAM', addressPointer: byte & 0x7F };
    return {};
}
export function createMockAPI() {
    let state = makeInitialState();
    let status = 'disconnected';
    const stateCbs = new Set();
    const logCbs = new Set();
    const statusCbs = new Set();
    function emit() {
        const payload = { state: { ...state, ddram: [...state.ddram], cgram: [...state.cgram] }, view: buildView(state) };
        stateCbs.forEach(cb => cb(payload));
    }
    function log(type, message) {
        logCbs.forEach(cb => cb({ timestamp: Date.now(), type, message }));
    }
    function setStatus(s) {
        status = s;
        statusCbs.forEach(cb => cb(s));
    }
    return {
        connect() {
            setStatus('connecting');
            setTimeout(() => {
                setStatus('connected');
                log('CONTROL', 'Mock backend connected');
                emit();
            }, 400);
        },
        sendUpdateConfig() {
            // Mock config
        },
        disconnect() {
            setStatus('disconnected');
            log('CONTROL', 'Disconnected');
        },
        sendCommand(byte) {
            const updates = processCommand(state, byte);
            state = { ...state, ...updates };
            log('COMMAND', `CMD 0x${byte.toString(16).padStart(2, '0').toUpperCase()}`);
            emit();
        },
        writeData(byte) {
            if (!state.initialized) {
                log('ERROR', 'Write rejected: not initialized');
                return;
            }
            const ddram = [...state.ddram];
            const ROW_BASES = [0x00, 0x40];
            let addr = state.addressPointer;
            // Clamp to valid DDRAM range
            const inRow2 = addr >= 0x40;
            const base = inRow2 ? 0x40 : 0x00;
            const clampedAddr = base + ((addr - base) % 40);
            if (clampedAddr < 80)
                ddram[clampedAddr] = byte;
            const nextAddr = state.entryModeIncrement
                ? Math.min(addr + 1, inRow2 ? 0x67 : 0x27)
                : Math.max(addr - 1, base);
            state = { ...state, ddram, addressPointer: nextAddr };
            log('DATA', `WRITE '${byte >= 0x20 && byte <= 0x7e ? String.fromCharCode(byte) : '?'}' (0x${byte.toString(16).padStart(2, '0').toUpperCase()})`);
            emit();
        },
        sendGPIO(data, rs, rw, en) {
            // Simulate falling edge execution
            const fallingEdge = state.en && !en;
            state = { ...state, rs, rw, en, };
            if (fallingEdge) {
                if (!rw) {
                    if (rs)
                        this.writeData(data);
                    else
                        this.sendCommand(data);
                }
            }
            else {
                emit();
            }
        },
        pulseGPIO(data, rs, rw) {
            this.sendGPIO(data, rs, rw, true);
            setTimeout(() => this.sendGPIO(data, rs, rw, false), 50);
        },
        reset() {
            state = makeInitialState();
            log('CONTROL', 'LCD state reset');
            emit();
        },
        onStateUpdate(cb) { stateCbs.add(cb); return () => stateCbs.delete(cb); },
        onLog(cb) { logCbs.add(cb); return () => logCbs.delete(cb); },
        onConnectionChange(cb) { statusCbs.add(cb); return () => statusCbs.delete(cb); },
        getStatus() { return status; },
    };
}
//# sourceMappingURL=mock.api.js.map