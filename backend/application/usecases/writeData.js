import { writeData } from '../../domain/lcd/writeEngine.js';
export function executeWriteData(service, byte) {
    // 1. Call domain logic
    writeData(byte, service.state);
}
//# sourceMappingURL=writeData.js.map