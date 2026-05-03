import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('./node_modules/ws/index.js');
const { z } = require('./frontend/node_modules/zod/lib/index.js');

const HardwareStateSchema = z.object({
  ddram: z.array(z.number()),
  cgram: z.array(z.number()),
  addressPointer: z.number(),
  ramType: z.enum(['DDRAM', 'CGRAM']),
  displayOn: z.boolean(),
  cursorOn: z.boolean(),
  blinkOn: z.boolean(),
  entryModeIncrement: z.boolean(),
  entryModeShift: z.boolean(),
  shiftOffset: z.number(),
  dataLength: z.union([z.literal(8), z.literal(4)]),
  numLines: z.union([z.literal(1), z.literal(2), z.literal(4)]),
  font: z.enum(['5x8', '5x10']),
  rs: z.boolean(),
  rw: z.boolean(),
  en: z.boolean(),
  busyFlag: z.boolean(),
  busyUntil: z.number(),
  initialized: z.boolean(),
  initCount: z.number(),
  powerOnTime: z.number(),
});

const ViewSchema = z.object({
  rows: z.number(),
  cols: z.number(),
  display: z.array(z.array(z.number())),
  cursor: z.object({ row: z.number(), col: z.number() }),
  cursorVisible: z.boolean(),
  glyphs: z.array(z.array(z.array(z.number()))),
});

const StateUpdateSchema = z.object({
  type: z.literal('STATE_UPDATE'),
  state: HardwareStateSchema,
  view: ViewSchema,
});

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.type === 'STATE_UPDATE') {
    const result = StateUpdateSchema.safeParse(msg);
    if (!result.success) {
      console.error('Zod Error:', JSON.stringify(result.error.format(), null, 2));
      process.exit(1);
    } else {
      console.log('Valid STATE_UPDATE');
      process.exit(0);
    }
  }
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
  process.exit(1);
});
