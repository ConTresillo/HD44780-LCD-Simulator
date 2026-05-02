Below is a **clean, implementation-grade architecture document** derived from your original spec , but reorganized into a **strict, scalable system design** suitable for a separated frontend–backend deployment.

---

# LCDsim — Full System Architecture

---

# 1. System Definition

LCDsim is a **stateful simulation system** that models an HD44780-style LCD controller and exposes it through a network interface to a frontend client.

The system must replicate:

* Byte-level command/data interaction
* Internal memory behavior (DDRAM, CGRAM)
* Cursor and addressing logic
* Display control flags and modes
* Non-linear memory-to-display mapping
* Optional timing and hardware realism

The system is not a renderer. It is a **controller simulation with a visual interface**.

---

# 2. High-Level Architecture

The system is divided into two deployable units:

```
Frontend (React UI)
        ↓
WebSocket API
        ↓
Backend (Simulation Engine)
```

Internally, the backend is layered:

```
Interface Layer (WebSocket)
        ↓
Application Layer (Use Cases)
        ↓
Domain Core (LCD Engine)
```

---

# 3. Backend Architecture

---

## 3.1 Domain Core (LCD Engine)

This is the most critical layer. It defines the behavior of the LCD.

### Responsibilities

* Maintain full LCD state
* Interpret command/data bytes
* Perform memory operations
* Control cursor and addressing
* Enforce LCD rules and constraints

### Core Principle

The domain must behave exactly like hardware:

* No UI assumptions
* No network logic
* No side effects outside state mutation

---

### 3.1.1 LCD State Model

The LCD state is a single structured object containing:

* DDRAM (display memory)
* CGRAM (custom characters)
* Cursor position
* Address pointer
* Entry mode configuration
* Display flags (display, cursor, blink)
* Shift offset
* Function set (bus width, lines, font)
* Busy flag (future)
* GPIO state (for advanced modes)

This state is the **single source of truth**.

---

### 3.1.2 Byte Input Model

The domain accepts inputs defined by control signals:

* RS (Register Select)

  * 0 → command
  * 1 → data
* RW (Read/Write)
* EN (Enable pulse)

Each input cycle results in a **byte interpretation step**.

---

### 3.1.3 Byte Dispatcher

The dispatcher routes incoming bytes:

* If RS = 0 → command handler
* If RS = 1 → data write

Responsibilities:

* Decode instruction category
* Route to appropriate handler
* Maintain no business logic itself

---

### 3.1.4 Command Handlers

Each command is implemented independently:

* Clear display
* Return home
* Entry mode set
* Display control
* Cursor/display shift
* Function set
* Set DDRAM/CGRAM address

Handlers must:

* Modify only relevant parts of state
* Be deterministic
* Be testable in isolation

---

### 3.1.5 Memory Subsystem

#### DDRAM

* Stores display characters
* Addressed non-linearly
* Acts as backing memory, not direct screen

#### CGRAM

* Stores custom character patterns
* Indexed and referenced like normal characters

---

### 3.1.6 Address Mapper

Converts:

* (row, column) → DDRAM address
* DDRAM address → visible cell

Must support:

* Non-linear layout
* Hidden address ranges
* Wrapping behavior

---

### 3.1.7 Write Engine

Handles:

* Writing data into DDRAM/CGRAM
* Cursor movement
* Entry mode rules (increment/decrement)
* Auto shift behavior

---

### 3.1.8 Display Window Logic

The visible screen is derived from:

* DDRAM
* Current shift offset
* LCD dimensions

This logic determines what the frontend receives.

---

## 3.2 Application Layer

This layer controls how the domain is used.

### Responsibilities

* Expose use cases
* Manage simulation lifecycle
* Emit events
* Maintain logs
* Apply configuration

---

### 3.2.1 LCD Service

Core service that provides:

* sendCommand(byte)
* writeData(byte)
* setAddress(address)
* clear()
* reset()

Internally:

* Calls dispatcher
* Updates state
* Emits events

---

### 3.2.2 Event System

The system is event-driven.

Events include:

* STATE_UPDATED
* COMMAND_EXECUTED
* DATA_WRITTEN
* ERROR
* MODE_CHANGED

Events are consumed by:

* WebSocket layer
* Logging system

---

### 3.2.3 Log Service

Captures:

* Commands received
* Data writes
* Cursor movements
* Errors
* Mode transitions

Logs are structured and streamable.

---

### 3.2.4 Configuration Service

Maintains runtime configuration:

* Display size
* Mode (software / VM / hardware)
* Timing behavior
* Feature toggles

Configuration is separate from LCD state.

---

## 3.3 Interface Layer (WebSocket API)

This layer exposes the backend to the frontend.

---

### 3.3.1 Connection Model

* Persistent WebSocket connection
* Server maintains session state
* Each client subscribes to updates

---

### 3.3.2 Message Types

#### Client → Server

* COMMAND (byte)
* DATA (byte)
* CONTROL (clear, reset, etc.)
* CONFIG_UPDATE

---

#### Server → Client

* STATE_UPDATE
* LOG_EVENT
* ERROR

---

### 3.3.3 State Synchronization

Backend pushes updates on:

* Every state change
* Significant events

Frontend does not poll.

---

### 3.3.4 Serialization

State is serialized as:

* Raw memory arrays
* Cursor position
* Flags
* Display window data

No UI formatting is done here.

---

## 3.4 Backend Constraints

* Stateless protocols must not leak into domain
* Domain must remain framework-independent
* Single authoritative state
* No duplication of logic in interface layer

---

# 4. Frontend Architecture

---

## 4.1 Responsibilities

* Render LCD state
* Capture user input
* Send commands via API
* Display logs and system info

---

## 4.2 State Model

Frontend maintains:

* Latest server state snapshot
* UI-specific state (selected cell, panels, theme)

It does NOT:

* Compute LCD logic
* Modify domain state

---

## 4.3 API Client

A WebSocket client wrapper that:

* Sends messages
* Receives updates
* Exposes subscription hooks

---

## 4.4 UI Components

---

### LCD Display

* Grid-based rendering
* Uses mapped display data
* Supports cursor overlay
* Supports custom characters

---

### Control Panel

* Command buttons
* Byte input
* Mode switches

---

### GPIO Panel

* Displays RS, RW, EN states
* Allows manual toggling (advanced)

---

### State Inspector

* Shows:

  * DDRAM
  * CGRAM
  * Cursor
  * Flags

---

### Log Panel

* Displays event stream
* Filterable and scrollable

---

### CGRAM Editor

* Pixel editor for custom characters
* Sends updates to backend

---

## 4.5 Rendering Model

Rendering is purely derived:

```
Server State → UI Components → Render
```

No mutation happens in UI.

---

# 5. Data Flow

---

## 5.1 Write Flow

```
User Input
 → UI Event
   → WebSocket Send
     → Interface Handler
       → Application Service
         → Domain Dispatcher
           → State Mutation
             → Event Emit
               → WebSocket Broadcast
                 → UI Update
```

---

## 5.2 Read Flow

```
Domain State
 → Application Layer
   → Interface Serialization
     → WebSocket Push
       → UI Store
         → Render
```

---

# 6. Modes of Operation

---

## 6.1 Software Mode

* Direct command execution
* No timing simulation

---

## 6.2 VM Mode

* Simulated microcontroller behavior
* Includes:

  * EN pulse handling
  * Byte assembly (4-bit mode)
  * Timing delays

---

## 6.3 Hardware Mode

* External device interaction
* Backend acts as bridge
* Uses serial/GPIO adapters

---

# 7. Infrastructure Layer

---

## 7.1 Theme System (Frontend)

* CSS variable-based
* Runtime switching
* No hardcoded styles in components

---

## 7.2 Character Maps

* ROM character definitions
* Glyph lookup tables

---

## 7.3 Storage

* Save/load configurations
* Persist themes and settings

---

## 7.4 Hardware Adapters (Backend)

* Serial communication
* GPIO interfaces
* Pluggable adapters

---

# 8. File Structure

---

## Backend

```
backend/
├── domain/
├── application/
├── interface/ws/
├── infrastructure/
└── server.ts
```

---

## Frontend

```
frontend/
├── presentation/
├── api/
├── hooks/
├── state/
└── main.tsx
```

---

# 9. System Constraints

---

* Domain logic is isolated and pure
* Backend owns all simulation state
* Frontend is a passive consumer
* Communication is event-driven
* No duplicated logic across layers
* Renderer does not mutate state

---

# 10. Execution Strategy

---

## Phase 1

* Domain core (minimal LCD behavior)

## Phase 2

* Application services + logging

## Phase 3

* WebSocket interface

## Phase 4

* Basic frontend rendering

## Phase 5

* Full command support + mapping

## Phase 6

* Advanced features (CGRAM, timing, modes)

---

# Final System Model

* Backend = LCD controller simulation
* Frontend = visualization + control interface
* Communication = real-time event stream
* Domain = hardware-accurate behavior core

---

This structure ensures:

* correctness of simulation
* strict separation of concerns
* extensibility toward VM and hardware modes
* deployable frontend/backend architecture without redesign

---
