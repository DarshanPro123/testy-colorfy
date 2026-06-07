# testy-colorfy

> 🎨 Colorful, configurable Node.js console logger — zero dependencies.

[![npm version](https://img.shields.io/npm/v/testy-colorfy)](https://www.npmjs.com/package/testy-colorfy)
[![license](https://img.shields.io/npm/l/testy-colorfy)](./LICENSE)

## Install

```sh
npm install testy-colorfy
```

## Quick Start

```js
const { Logger } = require("testy-colorfy");
// or: import { Logger } from "testy-colorfy";

Logger.success("User logged in");
Logger.error("Something went wrong");
Logger.warning("Memory usage above 80%");
Logger.info("Server running on port 3000");
Logger.debug("GET /api/users");
```

| Method | Color | Emoji |
|---|---|---|
| `success` | 🟢 Green | `✔` |
| `error` | 🔴 Red | `✖` |
| `warning` | 🟡 Yellow | `⚠` |
| `info` | 🔵 Blue | `ℹ` |
| `debug` | ⚫ Gray | `⚙` |

---

## Configuration

```js
Logger.configure({
  timestamp:       true,        // show timestamp
  timestampFormat: "datetime",  // "time" | "datetime" | "iso"
  prefix:          "API",       // [API] label
  emoji:           true,        // true | false | custom object
  noColor:         false,       // true = plain text (CI safe)
});

Logger.success("Payment processed");
// → [2026-06-07 10:30:45] [API] ✔ Payment processed

Logger.resetConfig(); // back to defaults
```

---

## Timestamp Formats

```js
Logger.configure({ timestamp: true, timestampFormat: "time" });
// → [10:30:45 AM] ℹ message

Logger.configure({ timestamp: true, timestampFormat: "datetime" });
// → [2026-06-07 10:30:45] ℹ message

Logger.configure({ timestamp: true, timestampFormat: "iso" });
// → [2026-06-07T10:30:45.000Z] ℹ message
```

---

## Custom Emojis

```js
const log = new Logger({
  emoji: { success: "🚀", error: "💥", warning: "🔔", info: "📢", debug: "🐛" }
});

log.success("Deployed!");   // → 🚀 Deployed!
log.error("Build failed");  // → 💥 Build failed
```

---

## Instance Logger (per-module config)

```js
const dbLogger   = new Logger({ prefix: "DB",   timestamp: true });
const authLogger = new Logger({ prefix: "AUTH", emoji: false });

dbLogger.success("Connected");       // → [10:30:45 AM] [DB] ✔ Connected
authLogger.info("Token generated");  // → [AUTH] Token generated
```

---

## noColor Mode (CI / file logging)

```js
const ciLogger = new Logger({ noColor: true });
ciLogger.success("Tests passed: 42/42"); // plain text, no color codes
```

---

## Screenshots

![Basic colored output](https://raw.githubusercontent.com/DarshanPro123/testy-colorfy/3759168a6b574adc400aa944069eb9517f1996c6/assets/demo1.png)

![Timestamp and prefix demo](https://raw.githubusercontent.com/DarshanPro123/testy-colorfy/3759168a6b574adc400aa944069eb9517f1996c6/assets/demo2.png)

![Custom emojis and instance loggers](https://raw.githubusercontent.com/DarshanPro123/testy-colorfy/3759168a6b574adc400aa944069eb9517f1996c6/assets/demo3.png)

---

## API Reference

| Method | Description |
|---|---|
| `Logger.success / error / warning / info / debug` | Log with color + emoji |
| `Logger.configure(options)` | Update global config |
| `Logger.resetConfig()` | Reset to defaults |
| `new Logger(options)` | Create instance with its own config |

### LoggerConfig

| Option | Type | Default |
|---|---|---|
| `timestamp` | `boolean` | `false` |
| `timestampFormat` | `"time" \| "datetime" \| "iso"` | `"time"` |
| `prefix` | `string` | `""` |
| `emoji` | `boolean \| CustomEmojis` | `true` |
| `noColor` | `boolean` | `false` |

---

## Legacy (Deprecated)

```js
// Old — still works but deprecated
import { Loger } from "testy-colorfy";
Loger.sucess("message");

// New — use this
import { Logger } from "testy-colorfy";
Logger.success("message");
```

---

ISC © [Darshan Panchal](https://github.com/DarshanPro123)
