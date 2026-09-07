# testy-colorfy

> 🎨 Fast, ultra-simple, colorful Node.js & TypeScript logger with automatic file path & line number caller tracing. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/testy-colorfy)](https://www.npmjs.com/package/testy-colorfy)
[![license](https://img.shields.io/npm/l/testy-colorfy)](./LICENSE)

---

## ⚡ Key Features

- 📍 **Auto File Path & Line Tracing**: Automatically detects and prints where the log was called from (`[src/index.ts:15:8]`).
- 🚀 **Zero Setup Required**: Import `logger` or `log` and start logging immediately.
- 🎨 **Vibrant Colors & Emojis**: Clean ANSI colored outputs with level badges.
- 📦 **Dual ESM & CommonJS**: Works seamlessly in modern TypeScript ESM (`import`) & Node.js CommonJS (`require`).
- ⚡ **Ultra-Fast & Zero Dependencies**: Lightweight, high performance formatting.

---

## 📦 Install

```sh
npm install testy-colorfy
```

---

## 🚀 Quick Start

### ESM (TypeScript / Modern Node.js)
```ts
import { log } from "testy-colorfy";

log.info("Server running on port 3000");
log.success("User authenticated successfully");
log.warn("High memory consumption detected");
log.error("Failed to connect to database", new Error("Timeout"));
log.debug("User payload", { id: 101, role: "admin" });
```

### CommonJS (Node.js)
```js
const { logger } = require("testy-colorfy");

logger.info("Application starting...");
logger.success("Payment processed successfully");
```

---

## 📍 Automatic File Path Caller Tracing

By default, `testy-colorfy` automatically inspects the call stack and prints the caller file path and line number:

```ts
// src/services/auth.ts (line 24)
log.info("Generating token");
// Output: [src/services/auth.ts:24:5] ℹ Generating token
```

### File Path Modes
You can customize or turn off file path tracing via `Logger.configure`:

```ts
import { Logger } from "testy-colorfy";

// Relative path (Default): [src/controllers/user.ts:42:10]
Logger.configure({ showFilePath: true, filePathMode: "relative" });

// Basename only: [user.ts:42:10]
Logger.configure({ showFilePath: true, filePathMode: "basename" });

// Full absolute path: [/Users/dev/app/src/controllers/user.ts:42:10]
Logger.configure({ showFilePath: true, filePathMode: "absolute" });

// Disable file path tracing
Logger.configure({ showFilePath: false });
```

---

## ⚙️ Configuration Options

Global configuration applies to default exports (`log` and `logger`) and `Logger` static methods.

```ts
import { Logger, log } from "testy-colorfy";

Logger.configure({
  showFilePath: true,           // Auto show file path & line caller
  filePathMode: "relative",     // "relative" | "basename" | "absolute"
  timestamp: true,              // Show timestamp
  timestampFormat: "time",      // "time" | "datetime" | "iso"
  prefix: "API",                // Custom label: [API]
  emoji: true,                  // Show level emoji
  noColor: false,               // Disable ANSI color (useful for CI / file logs)
});

log.success("User created");
// → [10:30:45 AM] [API] [src/routes/user.ts:15:3] ✔ User created
```

---

## 🎨 Custom Emojis & Per-Module Loggers

### Custom Emojis
```ts
Logger.configure({
  emoji: {
    success: "🚀",
    error: "💥",
    warning: "🔔",
    info: "📢",
    debug: "🐛",
  },
});
```

### Scoped Logger Instances
Create per-module instances with independent configurations:

```ts
import { Logger } from "testy-colorfy";

const dbLogger = new Logger({ prefix: "DB", timestamp: true });
const authLogger = new Logger({ prefix: "AUTH" });

dbLogger.success("Connected to Postgres"); 
// → [10:30:45 AM] [DB] [src/db.ts:12:4] ✔ Connected to Postgres

authLogger.info("JWT token generated"); 
// → [AUTH] [src/auth.ts:30:2] ℹ JWT token generated
```

---

## 📋 Level Reference

| Method | Level Color | Default Emoji |
|---|---|---|
| `log.success(...)` | 🟢 Green | `✔` |
| `log.error(...)` | 🔴 Red | `✖` |
| `log.warn(...)` / `log.warning(...)` | 🟡 Yellow | `⚠` |
| `log.info(...)` | 🔵 Blue | `ℹ` |
| `log.debug(...)` | ⚫ Gray | `⚙` |

---

## 📄 License

[ISC](./LICENSE) © Darshan Panchal
