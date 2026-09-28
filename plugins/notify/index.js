/**
 * Local OpenCode V2 port of the `opencode-notify` plugin (V1-only upstream).
 *
 * Behavior preserved from the npm package (opencode-notify@0.3.1):
 * - session.idle -> "waiting for input" notification (gated by notifyOnIdle)
 * - session.error -> error notification
 * - permission.asked / permission.updated -> permission request notification
 * - AskUserQuestion tool parts -> question notification
 * - Reads ~/.config/opencode/opencode-notify.json (same config file, same keys)
 * - Quiet hours and terminal-focus suppression are preserved.
 *
 * V2 notes:
 * - Uses Plugin.define({ id, setup }) from @opencode/plugin (V2 API).
 * - Subscribes via ctx.event.subscribe() instead of the V1 `event` hook.
 */
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { execSync, spawn } from "node:child_process";
import { Plugin } from "@opencode/plugin";

// ---------------------------------------------------------------------------
// Config (same file and defaults as opencode-notify@0.3.1)
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG = {
  sounds: {
    permission: "Submarine",
    error: "Basso",
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
  notifyChildSessions: false,
  terminal: null,
  focusAfterAction: true,
  notifyOnIdle: false,
  nativeMacNotifications: true,
};

function loadConfig() {
  const configPath = join(
    homedir(),
    ".config",
    "opencode",
    "opencode-notify.json",
  );
  if (!existsSync(configPath)) return DEFAULT_CONFIG;
  try {
    const userConfig = JSON.parse(readFileSync(configPath, "utf-8"));
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      sounds: { ...DEFAULT_CONFIG.sounds, ...userConfig.sounds },
      quietHours: { ...DEFAULT_CONFIG.quietHours, ...userConfig.quietHours },
    };
  } catch {
    console.warn("[opencode-notify] Failed to parse config, using defaults");
    return DEFAULT_CONFIG;
  }
}

function parseTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return { hours, minutes };
}

function isQuietHours(config) {
  if (!config.quietHours.enabled) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTime(config.quietHours.start);
  const end = parseTime(config.quietHours.end);
  const startMinutes = start.hours * 60 + start.minutes;
  const endMinutes = end.hours * 60 + end.minutes;
  if (startMinutes > endMinutes) {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

// ---------------------------------------------------------------------------
// Terminal detection / focus
// ---------------------------------------------------------------------------

const TERMINALS = {
  ghostty: {
    app: "ghostty",
    bundleId: "com.mitchellh.ghostty",
    processName: "ghostty",
  },
  kitty: {
    app: "kitty",
    bundleId: "net.kovidgoyal.kitty",
    processName: "kitty",
  },
  iterm: {
    app: "iterm",
    bundleId: "com.googlecode.iterm2",
    processName: "iTerm2",
  },
  iterm2: {
    app: "iterm",
    bundleId: "com.googlecode.iterm2",
    processName: "iTerm2",
  },
  wezterm: {
    app: "wezterm",
    bundleId: "com.github.wez.wezterm",
    processName: "wezterm-gui",
  },
  terminal: {
    app: "terminal",
    bundleId: "com.apple.Terminal",
    processName: "Terminal",
  },
  alacritty: {
    app: "alacritty",
    bundleId: "org.alacritty",
    processName: "Alacritty",
  },
  hyper: { app: "hyper", bundleId: "co.zeit.hyper", processName: "Hyper" },
};

function detectTerminal(configuredTerminal) {
  if (configuredTerminal)
    return TERMINALS[configuredTerminal.toLowerCase()] ?? { app: "unknown" };
  const termProgram = process.env.TERM_PROGRAM?.toLowerCase();
  if (termProgram === "ghostty") return TERMINALS.ghostty;
  if (termProgram === "iterm.app") return TERMINALS.iterm;
  if (termProgram === "wezterm") return TERMINALS.wezterm;
  if (termProgram === "apple_terminal") return TERMINALS.terminal;
  if (process.env.KITTY_WINDOW_ID) return TERMINALS.kitty;
  if (termProgram === "alacritty") return TERMINALS.alacritty;
  if (termProgram === "hyper") return TERMINALS.hyper;
  if (process.env.WT_SESSION)
    return { app: "windows-terminal", processName: "WindowsTerminal" };
  return { app: "unknown" };
}

function isTerminalFocused(terminal) {
  if (process.platform === "darwin")
    return isMacOSAppFocused(terminal.processName ?? terminal.app);
  if (process.platform === "linux")
    return isLinuxAppFocused(terminal.processName);
  if (process.platform === "win32")
    return isWindowsAppFocused(terminal.processName);
  return false;
}

function isMacOSAppFocused(bundleIdOrName) {
  if (!bundleIdOrName) return false;
  try {
    const script = `
      tell application "System Events"
        set frontApp to name of first application process whose frontmost is true
        return frontApp
      end tell
    `;
    const result = execSync(`osascript -e '${script}'`, {
      encoding: "utf-8",
      timeout: 1000,
    }).trim();
    return result.toLowerCase().includes(bundleIdOrName.toLowerCase());
  } catch {
    return false;
  }
}

function isLinuxAppFocused(processName) {
  if (!processName) return false;
  try {
    const windowId = execSync("xdotool getactivewindow", {
      encoding: "utf-8",
      timeout: 1000,
    }).trim();
    const pid = execSync(`xdotool getwindowpid ${windowId}`, {
      encoding: "utf-8",
      timeout: 1000,
    }).trim();
    const comm = execSync(`cat /proc/${pid}/comm`, {
      encoding: "utf-8",
      timeout: 1000,
    }).trim();
    return comm.toLowerCase().includes(processName.toLowerCase());
  } catch {
    return false;
  }
}

function isWindowsAppFocused(processName) {
  if (!processName) return false;
  try {
    // The foreground window's process name, without needing a compiled Win32 helper.
    const script = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        public class Win32Focus {
          [DllImport("user32.dll")]
          public static extern IntPtr GetForegroundWindow();
          [DllImport("user32.dll")]
          public static extern int GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);
        }
"@
      $hwnd = [Win32Focus]::GetForegroundWindow()
      $focusedPid = 0
      [void][Win32Focus]::GetWindowThreadProcessId($hwnd, [ref]$focusedPid)
      (Get-Process -Id $focusedPid).ProcessName
    `;
    const result = execSync(
      `powershell -NoProfile -Command "${script.replace(/"/g, '\\"')}"`,
      {
        encoding: "utf-8",
        timeout: 2000,
      },
    ).trim();
    return result.toLowerCase().includes(processName.toLowerCase());
  } catch {
    return false;
  }
}

function focusTerminal(terminal) {
  // Focus restoration is best-effort on macOS/Linux; Windows Terminal cannot be
  // reliably focused from a background process, matching upstream behavior.
  if (process.platform === "darwin" && terminal.bundleId) {
    try {
      execSync(`open -b "${terminal.bundleId}"`, { timeout: 2000 });
    } catch {}
  }
  if (process.platform === "linux" && terminal.processName) {
    try {
      execSync(`wmctrl -a "${terminal.processName}"`, { timeout: 2000 });
    } catch {}
  }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

function notifyWindows(options) {
  // Windows toast via powershell + Windows.UI.Notifications (no extra deps).
  const script = `
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null
    $template = [Windows.UI.Notifications.ToastNotificationManager]::GetTemplateContent([Windows.UI.Notifications.ToastTemplateType]::ToastText02)
    $texts = $template.GetElementsByTagName("text")
    $texts.Item(0).AppendChild($template.CreateTextNode("${options.title.replace(/"/g, '`"')}")) | Out-Null
    $texts.Item(1).AppendChild($template.CreateTextNode("${options.message.replace(/"/g, '`"')}")) | Out-Null
    $toast = [Windows.UI.Notifications.ToastNotification]::new($template)
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier("opencode.notify").Show($toast)
  `;
  spawn("powershell", ["-NoProfile", "-NonInteractive", "-Command", script], {
    stdio: "ignore",
    detached: true,
  }).unref();
}

function notifyMacOS(options) {
  const script = `display notification "${options.message.replace(/"/g, '\\"')}" with title "${options.title.replace(/"/g, '\\"')}"${
    options.sound ? ` sound name "${options.sound}"` : ""
  }`;
  spawn("osascript", ["-e", script], {
    stdio: "ignore",
    detached: true,
  }).unref();
}

function notifyLinux(options) {
  spawn("notify-send", [options.title, options.message], {
    stdio: "ignore",
    detached: true,
  }).unref();
}

function notify(options) {
  switch (process.platform) {
    case "win32":
      return notifyWindows(options);
    case "darwin":
      return notifyMacOS(options);
    case "linux":
      return notifyLinux(options);
    default:
      console.warn(
        `[opencode-notify] No notification backend for platform: ${process.platform}`,
      );
  }
}

// ---------------------------------------------------------------------------
// Plugin (V2 entrypoint)
// ---------------------------------------------------------------------------

export default Plugin.define({
  id: "notify",
  async setup(ctx) {
    const config = loadConfig();
    const terminal = detectTerminal(config.terminal);
    const notifiedToolCalls = new Set();
    let isShowingNotification = false;
    let hasNotifiedIdle = false;

    const shouldSuppress = () => isQuietHours(config);

    const show = async (options) => {
      if (isShowingNotification) return;
      isShowingNotification = true;
      try {
        notify(options);
      } finally {
        isShowingNotification = false;
      }
    };

    const showPermissionRequest = (permissionType, message) =>
      show({
        title: "Opencode Permission Request",
        subtitle: permissionType,
        message: message.length > 100 ? message.slice(0, 100) + "…" : message,
        sound: config.sounds.permission,
      });

    const showSessionComplete = (message) =>
      show({ title: "Opencode", message, sound: config.sounds.permission });

    const showError = (message) =>
      show({ title: "Opencode Error", message, sound: config.sounds.error });

    const showQuestion = (message) =>
      show({
        title: "Opencode Question",
        message,
        sound: config.sounds.permission,
      });

    // Returns after handling one event; never throws into the subscription loop.
    const handleEvent = async (event) => {
      const eventType = event.type;

      if (eventType === "permission.asked") {
        hasNotifiedIdle = false;
        const props = event.properties;
        if (
          shouldSuppress() ||
          isTerminalFocused(terminal) ||
          isShowingNotification
        )
          return;
        const permissionType = props.permission ?? "Permission";
        const patterns = Array.isArray(props.patterns)
          ? props.patterns.join(", ")
          : "";
        const message = patterns || "Permission requested";
        await showPermissionRequest(permissionType, message);
        return;
      }

      switch (eventType) {
        case "message.part.updated": {
          hasNotifiedIdle = false;
          const part = event.properties?.part;
          if (
            part?.type === "tool" &&
            part?.tool?.toLowerCase() === "askuserquestion" &&
            part?.state?.status === "pending"
          ) {
            const callId = part.id ?? `part-AskUserQuestion-${Date.now()}`;
            if (notifiedToolCalls.has(callId)) return;
            notifiedToolCalls.add(callId);
            if (
              shouldSuppress() ||
              isTerminalFocused(terminal) ||
              isShowingNotification
            )
              return;
            const firstQuestion = part.input?.questions?.[0]?.question;
            await showQuestion(
              firstQuestion ?? "Opencode has a question for you",
            );
          }
          return;
        }

        case "message.updated": {
          hasNotifiedIdle = false;
          const info = event.properties?.info;
          if (info?.role !== "assistant") return;
          const parts = info.parts;
          if (!Array.isArray(parts) || parts.length === 0) return;
          for (const p of parts) {
            if (
              p.type === "tool" &&
              p.tool?.toLowerCase() === "askuserquestion" &&
              p.state?.status === "pending"
            ) {
              const callId = p.id ?? `${info.id}-AskUserQuestion`;
              if (notifiedToolCalls.has(callId)) return;
              notifiedToolCalls.add(callId);
              if (
                shouldSuppress() ||
                isTerminalFocused(terminal) ||
                isShowingNotification
              )
                return;
              const firstQuestion = p.input?.questions?.[0]?.question;
              await showQuestion(
                firstQuestion ?? "Opencode has a question for you",
              );
              return;
            }
          }
          return;
        }

        case "permission.updated": {
          hasNotifiedIdle = false;
          const props = event.properties;
          if (
            shouldSuppress() ||
            isTerminalFocused(terminal) ||
            isShowingNotification
          )
            return;
          const command = props.title ?? "Permission requested";
          await showPermissionRequest(props.type, command);
          return;
        }

        case "session.error": {
          if (shouldSuppress() || isTerminalFocused(terminal)) return;
          const message =
            event.properties?.error?.data?.message ?? "An error occurred";
          await showError(message);
          return;
        }

        case "session.idle": {
          if (!config.notifyOnIdle) return;
          if (hasNotifiedIdle) return;
          if (shouldSuppress() || isTerminalFocused(terminal)) return;
          hasNotifiedIdle = true;
          await showSessionComplete(
            "Agent has stopped and is waiting for input",
          );
          return;
        }
      }
    };

    const controller = new AbortController();

    void (async () => {
      for await (const event of ctx.event.subscribe({
        signal: controller.signal,
      })) {
        try {
          await handleEvent(event);
        } catch (error) {
          console.warn("[opencode-notify] Failed to handle event:", error);
        }
      }
    })();

    return () => controller.abort();
  },
});
