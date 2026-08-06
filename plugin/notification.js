const message = "Session completed!";

async function notify({ $ }) {
  if (process.platform === "win32") {
    await $`powershell -NoProfile -NonInteractive -Command "Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile','-NonInteractive','-Command','Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show(\"${message}\",\"opencode\") | Out-Null'"`;
    return;
  }

  if (process.platform === "darwin") {
    await $`osascript -e 'display notification "Session completed!" with title "opencode"'`;
    return;
  }

  if (process.platform === "linux") {
    await $`notify-send opencode ${message}`;
  }
}

export const NotificationPlugin = async ({ $ }) => {
  return {
    event: async ({ event }) => {
      if (event.type !== "session.idle") return;

      try {
        await notify({ $ });
      } catch (error) {
        console.warn("Unable to send opencode desktop notification:", error);
      }
    },
  };
};
