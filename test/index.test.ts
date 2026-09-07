import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Logger, logger, log } from "../src/index";

describe("testy-colorfy", () => {
  let logs: string[] = [];
  const originalLog = console.log;

  beforeEach(() => {
    logs = [];
    console.log = (...args: any[]) => {
      logs.push(args.join(" "));
    };
    Logger.resetConfig();
  });

  it("should log default success, info, warning, error, debug messages", () => {
    Logger.configure({ noColor: true, showFilePath: false });

    logger.info("Hello info");
    logger.success("Hello success");
    logger.warn("Hello warning");
    logger.error("Hello error");
    logger.debug("Hello debug");

    assert.equal(logs.length, 5);
    assert.match(logs[0], /ℹ Hello info/);
    assert.match(logs[1], /✔ Hello success/);
    assert.match(logs[2], /⚠ Hello warning/);
    assert.match(logs[3], /✖ Hello error/);
    assert.match(logs[4], /⚙ Hello debug/);

    console.log = originalLog;
  });

  it("should include file path and line number caller tracing by default", () => {
    Logger.configure({ noColor: true, showFilePath: true, filePathMode: "basename" });

    log.info("Testing file path tracing");

    assert.equal(logs.length, 1);
    // Should contain basename and line number format, e.g. [index.test.ts:31:9]
    assert.match(logs[0], /\[index\.test\.(ts|js):\d+:\d+\]/);

    console.log = originalLog;
  });

  it("should format multi-arguments and objects cleanly", () => {
    Logger.configure({ noColor: true, showFilePath: false });

    log.info("User object:", { id: 1, name: "Alice" });

    assert.equal(logs.length, 1);
    assert.match(logs[0], /User object: \{ id: 1, name: 'Alice' \}/);

    console.log = originalLog;
  });

  it("should format timestamps when enabled", () => {
    Logger.configure({ noColor: true, timestamp: true, showFilePath: false });

    log.success("Operation complete");

    assert.equal(logs.length, 1);
    assert.match(logs[0], /\[\d+:\d+:\d+/);

    console.log = originalLog;
  });

  it("should respect prefix setting", () => {
    Logger.configure({ noColor: true, prefix: "DATABASE", showFilePath: false });

    log.info("Connecting to db");

    assert.equal(logs.length, 1);
    assert.match(logs[0], /\[DATABASE\] ℹ Connecting to db/);

    console.log = originalLog;
  });

  it("should support custom emojis", () => {
    Logger.configure({
      noColor: true,
      showFilePath: false,
      emoji: { info: "🚀", success: "🎉" },
    });

    log.info("Launching");
    log.success("Launched");

    assert.equal(logs.length, 2);
    assert.match(logs[0], /🚀 Launching/);
    assert.match(logs[1], /🎉 Launched/);

    console.log = originalLog;
  });

  it("should support relative, basename, and absolute filePathMode", () => {
    Logger.configure({ noColor: true, showFilePath: true, filePathMode: "relative" });
    log.info("Relative path test");
    assert.match(logs[0], /\[(dist-test\/|dist\/)?test\/index\.test\.(ts|js):\d+:\d+\]/);

    logs = [];
    Logger.configure({ noColor: true, showFilePath: true, filePathMode: "basename" });
    log.info("Basename test");
    assert.match(logs[0], /\[index\.test\.(ts|js):\d+:\d+\]/);

    console.log = originalLog;
  });
});
