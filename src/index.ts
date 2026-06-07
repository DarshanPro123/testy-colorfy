import { format } from "util";

export type LogLevel = "success" | "error" | "warning" | "info" | "debug";

/** "time" → 10:30:45 AM | "datetime" → 2026-06-07 10:30:45 | "iso" → 2026-06-07T10:30:45.000Z */
export type TimestampFormat = "time" | "datetime" | "iso";

/** Override emojis for specific log levels. Omit a key to keep its default. */
export interface CustomEmojis {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  debug?: string;
}

export interface LoggerConfig {
  /** Show a timestamp before each message. Default: false */
  timestamp?: boolean;
  /** Timestamp format: "time" | "datetime" | "iso". Default: "time" */
  timestampFormat?: TimestampFormat;
  /** Custom label shown in [brackets] before the message. e.g. "API" → [API] */
  prefix?: string;
  /** true = default emojis | false = no emoji | CustomEmojis = per-level override. Default: true */
  emoji?: boolean | CustomEmojis;
  /** Disable ANSI color output (useful for CI / file logging). Default: false */
  noColor?: boolean;
}

const DEFAULT_EMOJIS: Record<LogLevel, string> = {
  success: "✔",
  error:   "✖",
  warning: "⚠",
  info:    "ℹ",
  debug:   "⚙",
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  success: "32",
  error:   "31",
  warning: "33",
  info:    "34",
  debug:   "90",
};

export class Logger {
  private static globalConfig: LoggerConfig = {
    timestamp:       false,
    timestampFormat: "time",
    prefix:          "",
    emoji:           true,
    noColor:         false,
  };

  private config?: LoggerConfig;

  constructor(options?: LoggerConfig) {
    this.config = options;
  }

  private getConfig(): LoggerConfig {
    return { ...Logger.globalConfig, ...this.config };
  }

  /** Update the shared global config. Affects all static calls and new instances. */
  static configure(options: LoggerConfig): void {
    Logger.globalConfig = { ...Logger.globalConfig, ...options };
  }

  /** Reset the global config back to defaults. */
  static resetConfig(): void {
    Logger.globalConfig = {
      timestamp:       false,
      timestampFormat: "time",
      prefix:          "",
      emoji:           true,
      noColor:         false,
    };
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

  private static resolveEmoji(level: LogLevel, emoji: boolean | CustomEmojis): string {
    if (emoji === false) return "";
    if (emoji === true)  return DEFAULT_EMOJIS[level];
    return emoji[level] ?? DEFAULT_EMOJIS[level];
  }

  private static buildPrefix(level: LogLevel, config: LoggerConfig): string {
    const parts: string[] = [];

    if (config.timestamp) {
      parts.push(`[${Logger.formatTimestamp(config.timestampFormat ?? "time")}]`);
    }

    if (config.prefix) {
      parts.push(`[${config.prefix}]`);
    }

    const emojiSetting = config.emoji ?? true;
    if (emojiSetting !== false) {
      const symbol = Logger.resolveEmoji(level, emojiSetting);
      if (symbol) parts.push(symbol);
    }

    const result = parts.join(" ");
    return result ? `${result} ` : "";
  }

  private static print(level: LogLevel, config: LoggerConfig, ...args: any[]): void {
    const prefix  = Logger.buildPrefix(level, config);
    const message = format(...args);

    if (config.noColor) {
      console.log(`${prefix}${message}`);
    } else {
      console.log(`\x1b[${LEVEL_COLORS[level]}m%s\x1b[0m`, `${prefix}${message}`);
    }
  }

  // Static API
  static success(...args: any[]): void { Logger.print("success", Logger.globalConfig, ...args); }
  static error  (...args: any[]): void { Logger.print("error",   Logger.globalConfig, ...args); }
  static warning(...args: any[]): void { Logger.print("warning", Logger.globalConfig, ...args); }
  static info   (...args: any[]): void { Logger.print("info",    Logger.globalConfig, ...args); }
  static debug  (...args: any[]): void { Logger.print("debug",   Logger.globalConfig, ...args); }

  /** @deprecated Typo — use Logger.success() instead */
  static sucess(...args: any[]): void { Logger.success(...args); }

  // Instance API
  success(...args: any[]): void { Logger.print("success", this.getConfig(), ...args); }
  error  (...args: any[]): void { Logger.print("error",   this.getConfig(), ...args); }
  warning(...args: any[]): void { Logger.print("warning", this.getConfig(), ...args); }
  info   (...args: any[]): void { Logger.print("info",    this.getConfig(), ...args); }
  debug  (...args: any[]): void { Logger.print("debug",   this.getConfig(), ...args); }

  /** @deprecated Typo — use instance.success() instead */
  sucess(...args: any[]): void { this.success(...args); }
}

/** @deprecated Use Logger instead */
export const Loger = Logger;
/** @deprecated Use Logger instead */
export type Loger = Logger;
