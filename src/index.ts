import { formatWithOptions, format } from "node:util";
import { relative, basename } from "node:path";

export type LogLevel = "success" | "error" | "warning" | "info" | "debug";
export type TimestampFormat = "time" | "datetime" | "iso";
export type FilePathMode = "relative" | "basename" | "absolute";

export interface CustomEmojis {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  debug?: string;
}

export interface LoggerConfig {
  /** Show file path and line number of where the log was called. Default: true */
  showFilePath?: boolean;
  /** Format of file path: "relative" | "basename" | "absolute". Default: "relative" */
  filePathMode?: FilePathMode;
  /** Show timestamp before message. Default: false */
  timestamp?: boolean;
  /** Timestamp format: "time" | "datetime" | "iso". Default: "time" */
  timestampFormat?: TimestampFormat;
  /** Custom label shown in [brackets] before message. e.g. "API" -> [API] */
  prefix?: string;
  /** true = default emojis | false = no emoji | CustomEmojis = override per level. Default: true */
  emoji?: boolean | CustomEmojis;
  /** Disable ANSI color output (useful for CI / file logging). Default: false */
  noColor?: boolean;
}

interface CallSite {
  getFileName(): string | null;
  getLineNumber(): number | null;
  getColumnNumber(): number | null;
  isNative(): boolean;
}

const DEFAULT_CONFIG: Required<LoggerConfig> = {
  showFilePath: true,
  filePathMode: "relative",
  timestamp: false,
  timestampFormat: "time",
  prefix: "",
  emoji: true,
  noColor: false,
};

const DEFAULT_EMOJIS: Record<LogLevel, string> = {
  success: "✔",
  error: "✖",
  warning: "⚠",
  info: "ℹ",
  debug: "⚙",
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  success: "32", // Green
  error: "31",   // Red
  warning: "33", // Yellow
  info: "34",    // Blue
  debug: "90",   // Gray / Dim
};

const RESET_CODE = "\x1b[0m";
const DIM_CODE = "\x1b[90m";

/**
 * Capture caller location from V8 stack trace
 */
function getCallerLocation(mode: FilePathMode = "relative"): string | null {
  const originalPrepare = Error.prepareStackTrace;
  try {
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    const stack = err.stack as unknown as CallSite[];

    if (!Array.isArray(stack)) return null;

    // Iterate stack frames to find the caller outside this logger package
    for (let i = 0; i < stack.length; i++) {
      const fileName = stack[i]?.getFileName();
      if (!fileName) continue;

      const normalizedPath = fileName.replace(/\\/g, "/");

      // Filter internal node frames & logger code frames (src/index.ts or dist/src/index.js)
      if (
        normalizedPath.startsWith("node:") ||
        normalizedPath.includes("node_modules") ||
        /\/src\/index\.[tj]s$/.test(normalizedPath) ||
        /\/dist\/src\/index\.[tj]s$/.test(normalizedPath)
      ) {
        continue;
      }

      const line = stack[i].getLineNumber();
      const col = stack[i].getColumnNumber();

      let formattedPath = fileName;
      if (mode === "relative") {
        formattedPath = relative(process.cwd(), fileName).replace(/\\/g, "/");
      } else if (mode === "basename") {
        formattedPath = basename(fileName);
      }

      return `${formattedPath}:${line}:${col}`;
    }
  } catch {
    // Fallback if stack trace API is unavailable
  } finally {
    Error.prepareStackTrace = originalPrepare;
  }
  return null;
}

export class Logger {
  private static globalConfig: Required<LoggerConfig> = { ...DEFAULT_CONFIG };
  private instanceConfig?: LoggerConfig;

  constructor(options?: LoggerConfig) {
    this.instanceConfig = options;
  }

  private getConfig(): Required<LoggerConfig> {
    if (!this.instanceConfig) return Logger.globalConfig;
    return {
      ...Logger.globalConfig,
      ...this.instanceConfig,
      emoji:
        typeof this.instanceConfig.emoji === "object"
          ? {
              ...(typeof Logger.globalConfig.emoji === "object"
                ? Logger.globalConfig.emoji
                : {}),
              ...this.instanceConfig.emoji,
            }
          : (this.instanceConfig.emoji ?? Logger.globalConfig.emoji),
    };
  }

  /** Update shared global config for static calls and default instances. */
  static configure(options: LoggerConfig): void {
    Logger.globalConfig = {
      ...Logger.globalConfig,
      ...options,
      emoji:
        typeof options.emoji === "object"
          ? {
              ...(typeof Logger.globalConfig.emoji === "object"
                ? Logger.globalConfig.emoji
                : {}),
              ...options.emoji,
            }
          : (options.emoji ?? Logger.globalConfig.emoji),
    };
  }

  /** Reset global config to default values. */
  static resetConfig(): void {
    Logger.globalConfig = { ...DEFAULT_CONFIG };
  }

  private static formatTimestamp(fmt: TimestampFormat): string {
    const now = new Date();
    if (fmt === "iso") return now.toISOString();
    if (fmt === "datetime") {
      const date = now.toLocaleDateString("en-CA");
      const time = now.toLocaleTimeString("en-GB", { hour12: false });
      return `${date} ${time}`;
    }
    return now.toLocaleTimeString();
  }

  private static resolveEmoji(
    level: LogLevel,
    emoji: boolean | CustomEmojis
  ): string {
    if (emoji === false) return "";
    if (emoji === true) return DEFAULT_EMOJIS[level];
    return emoji[level] ?? DEFAULT_EMOJIS[level];
  }

  private static print(
    level: LogLevel,
    config: Required<LoggerConfig>,
    ...args: any[]
  ): void {
    const parts: string[] = [];

    // 1. Timestamp
    if (config.timestamp) {
      parts.push(`[${Logger.formatTimestamp(config.timestampFormat)}]`);
    }

    // 2. Custom Prefix
    if (config.prefix) {
      parts.push(`[${config.prefix}]`);
    }

    // 3. Caller File Path & Line Tracing
    if (config.showFilePath) {
      const caller = getCallerLocation(config.filePathMode);
      if (caller) {
        if (config.noColor) {
          parts.push(`[${caller}]`);
        } else {
          parts.push(`${DIM_CODE}[${caller}]${RESET_CODE}`);
        }
      }
    }

    // 4. Emoji Symbol
    if (config.emoji !== false) {
      const symbol = Logger.resolveEmoji(level, config.emoji);
      if (symbol) parts.push(symbol);
    }

    const header = parts.length > 0 ? `${parts.join(" ")} ` : "";
    const formattedMessage = formatWithOptions(
      { colors: !config.noColor },
      ...args
    );

    if (config.noColor) {
      console.log(`${header}${formattedMessage}`);
    } else {
      const colorCode = `\x1b[${LEVEL_COLORS[level]}m`;
      console.log(`${colorCode}${header}${RESET_CODE}${formattedMessage}`);
    }
  }

  // --- Static API ---
  static success(...args: any[]): void {
    Logger.print("success", Logger.globalConfig, ...args);
  }
  static error(...args: any[]): void {
    Logger.print("error", Logger.globalConfig, ...args);
  }
  static warning(...args: any[]): void {
    Logger.print("warning", Logger.globalConfig, ...args);
  }
  static warn(...args: any[]): void {
    Logger.warning(...args);
  }
  static info(...args: any[]): void {
    Logger.print("info", Logger.globalConfig, ...args);
  }
  static debug(...args: any[]): void {
    Logger.print("debug", Logger.globalConfig, ...args);
  }

  /** @deprecated Typo alias — use Logger.success() instead */
  static sucess(...args: any[]): void {
    Logger.success(...args);
  }

  // --- Instance API ---
  success(...args: any[]): void {
    Logger.print("success", this.getConfig(), ...args);
  }
  error(...args: any[]): void {
    Logger.print("error", this.getConfig(), ...args);
  }
  warning(...args: any[]): void {
    Logger.print("warning", this.getConfig(), ...args);
  }
  warn(...args: any[]): void {
    this.warning(...args);
  }
  info(...args: any[]): void {
    Logger.print("info", this.getConfig(), ...args);
  }
  debug(...args: any[]): void {
    Logger.print("debug", this.getConfig(), ...args);
  }

  /** @deprecated Typo alias — use instance.success() instead */
  sucess(...args: any[]): void {
    this.success(...args);
  }
}

/**
 * Convenient default logger instance for zero-setup logging
 */
export const logger = new Logger();
export const log = logger;
export default logger;

/** @deprecated Use Logger instead */
export const Loger = Logger;
/** @deprecated Use Logger instead */
export type Loger = Logger;
