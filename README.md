# testy-colorfy

> 🎨 A lightweight, zero-dependency Node.js logger with **colored output**, **timestamps**, **custom emojis**, and **per-instance configuration**.

[![npm version](https://img.shields.io/npm/v/testy-colorfy)](https://www.npmjs.com/package/testy-colorfy)
[![license](https://img.shields.io/npm/l/testy-colorfy)](./LICENSE)

---

## 📦 Installation

```sh
npm install testy-colorfy
```

---

## 🚀 Quick Start

```js
import { Logger } from "testy-colorfy";
// or CommonJS:
const { Logger } = require("testy-colorfy");

Logger.success("User logged in");
Logger.error("Database connection failed");
Logger.warning("Memory usage above 80%");
Logger.info("Server running on port 3000");
Logger.debug("Incoming: GET /api/users");
```

**Output:**

```
✔ User logged in
✖ Database connection failed
⚠ Memory usage above 80%
ℹ Server running on port 3000
⚙ Incoming: GET /api/users
```

Each level prints in its own color:

| Method | Color | Default emoji |
|---|---|---|
| `success` | 🟢 Green | `✔` |
| `error` | 🔴 Red | `✖` |
| `warning` | 🟡 Yellow | `⚠` |
| `info` | 🔵 Blue | `ℹ` |
| `debug` | ⚫ Gray | `⚙` |

---

## ⚙️ Configuration

### `Logger.configure(options)` — Global config

Affects **all** subsequent static calls (`Logger.success(...)` etc.).

```js
Logger.configure({
  timestamp:       true,         // show time before each message
  timestampFormat: "datetime",   // "time" | "datetime" | "iso"
  prefix:          "API",        // label shown in [brackets]
  emoji:           true,         // true | false | custom object
  noColor:         false,        // true = plain text (good for CI)
});

Logger.success("Payment processed");
// → [2026-06-07 10:30:45] [API] ✔ Payment processed
```

### `Logger.resetConfig()` — Back to defaults

```js
Logger.resetConfig();
Logger.info("Clean slate");
// → ℹ Clean slate
```

---

## 🕐 Timestamp Formats

Enable timestamps globally or per instance:

```js
// Time only (default)
Logger.configure({ timestamp: true, timestampFormat: "time" });
Logger.info("Server started");
// → [10:30:45 AM] ℹ Server started

// Date + Time
Logger.configure({ timestamp: true, timestampFormat: "datetime" });
Logger.info("Job triggered");
// → [2026-06-07 10:30:45] ℹ Job triggered

// Full ISO 8601
Logger.configure({ timestamp: true, timestampFormat: "iso" });
Logger.info("Event captured");
// → [2026-06-07T10:30:45.000Z] ℹ Event captured
```

---

## 🏷️ Custom Prefix Label

Add a **module name** in brackets before every message:

```js
Logger.configure({ prefix: "DB" });
Logger.success("Connected to MongoDB");
Logger.error("Query timeout after 5000ms");
// → [DB] ✔ Connected to MongoDB
// → [DB] ✖ Query timeout after 5000ms

Logger.resetConfig();
```

---

## 😀 Custom Emojis

Pass a `CustomEmojis` object to override any emoji — others keep their defaults:

```js
Logger.configure({
  emoji: {
    success: "🚀",
    error:   "💥",
    warning: "🔔",
    info:    "📢",
    debug:   "🐛",
  },
});

Logger.success("Deployed to production");  // → 🚀 Deployed to production
Logger.error("Build failed");              // → 💥 Build failed
Logger.debug("Bundle size: 142kb");        // → 🐛 Bundle size: 142kb
```

Disable emojis entirely:

```js
Logger.configure({ emoji: false });
Logger.success("No emoji here");
// → No emoji here
```

---

## 🔕 noColor Mode (CI / File Logging)

Strip all ANSI color codes — useful in CI pipelines or when writing to a log file:

```js
Logger.configure({ noColor: true });
Logger.success("Tests passed: 42/42");
// → ✔ Tests passed: 42/42  (plain text, no color escape codes)
```

---

## 🧩 Instance Logger — Per-Module Config

Create **separate logger instances** for different parts of your app, each with their own settings:

```js
const dbLogger = new Logger({
  prefix:          "DB",
  timestamp:       true,
  timestampFormat: "time",
});

const authLogger = new Logger({
  prefix: "AUTH",
  emoji:  false,
});

dbLogger.success("Connected to MongoDB");
// → [10:30:45 AM] [DB] ✔ Connected to MongoDB

dbLogger.error("Query timeout");
// → [10:30:45 AM] [DB] ✖ Query timeout

authLogger.info("JWT token generated");
// → [AUTH] JWT token generated

authLogger.warning("Token expires in 5 minutes");
// → [AUTH] Token expires in 5 minutes
```

> **Instance config is merged on top of the global config.**
> If the instance does not specify an option, it inherits the global default.

---

## 📦 Multi-Argument Logging

Works exactly like `console.log` — pass objects, format strings, or multiple values:

```js
Logger.info("User:", { id: 42, name: "Darshan", role: "admin" });
// → ℹ User: { id: 42, name: 'Darshan', role: 'admin' }

Logger.debug("Request took %dms, status: %s", 127, "OK");
// → ⚙ Request took 127ms, status: OK
```

---

## 🔀 All Features Combined

```js
const appLogger = new Logger({
  prefix:          "APP",
  timestamp:       true,
  timestampFormat: "datetime",
  emoji: {
    success: "✅",
    error:   "❌",
    info:    "📌",
  },
});

appLogger.success("Application started");
// → [2026-06-07 10:30:45] [APP] ✅ Application started

appLogger.info("Config loaded from environment");
// → [2026-06-07 10:30:45] [APP] 📌 Config loaded from environment

appLogger.error("Unhandled exception caught");
// → [2026-06-07 10:30:45] [APP] ❌ Unhandled exception caught
```

---

## 🧪 Testing It Locally

```sh
# 1. Build the package first
npm run build

# 2. Run the demo file
node test-demo.js
```

---

## 📖 API Reference

### Static Methods

| Method | Description |
|---|---|
| `Logger.success(...args)` | Green log with ✔ |
| `Logger.error(...args)` | Red log with ✖ |
| `Logger.warning(...args)` | Yellow log with ⚠ |
| `Logger.info(...args)` | Blue log with ℹ |
| `Logger.debug(...args)` | Gray log with ⚙ |
| `Logger.configure(options)` | Update global config |
| `Logger.resetConfig()` | Reset global config to defaults |

### Instance Methods

```js
const log = new Logger(options);
log.success / log.error / log.warning / log.info / log.debug
```

### `LoggerConfig` Options

| Option | Type | Default | Description |
|---|---|---|---|
| `timestamp` | `boolean` | `false` | Show a timestamp prefix |
| `timestampFormat` | `"time" \| "datetime" \| "iso"` | `"time"` | Format of the timestamp |
| `prefix` | `string` | `""` | Custom label in `[brackets]` |
| `emoji` | `boolean \| CustomEmojis` | `true` | Enable/disable/customize emojis |
| `noColor` | `boolean` | `false` | Disable ANSI color codes |

### `CustomEmojis` Shape

```ts
{
  success?: string;
  error?:   string;
  warning?: string;
  info?:    string;
  debug?:   string;
}
```

---

## ⚠️ Legacy API (Deprecated)

The old class name `Loger` (with one `g`) is kept for backward compatibility but will be removed in a future major version.

```js
// ❌ Old (deprecated)
import { Loger } from "testy-colorfy";
Loger.sucess("message");

// ✅ New
import { Logger } from "testy-colorfy";
Logger.success("message");
```

---

## 🖥️ Demo Screenshots

### Basic colored output

![Basic output demo](https://github.com/DarshanPro123/testy-colorfy/blob/d8e332c4669ba97db0b67bb623ba0e580bcde18e/Demo.png)

### Advanced usage with timestamps and prefix

![Advanced demo](https://github.com/DarshanPro123/testy-colorfy/blob/5a70efc8ba5f5082eb8f24f285cfdae055bc04fe/Demoi.png)

---

## 📄 License

ISC © [Darshan Panchal](https://github.com/DarshanPro123)
