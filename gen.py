import json
from secrets import GITHUB_PAT

config ={
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "type": "remote",
      "enabled": True
    },
    "fetch": {
      "url": "https://remote.mcpservers.org/fetch/mcp",
      "type": "remote",
      "enabled": True
    },
    "sequential-thinking": {
      "url": "https://remote.mcpservers.org/sequentialthinking/mcp",
      "type": "remote",
      "enabled": True
    },
    "deep-wiki": {
      "url": "https://mcp.deepwiki.com/mcp",
      "type": "remote",
      "enabled": True
    },
    "semgrep": {
      "url": "https://mcp.semgrep.ai/sse",
      "type": "remote",
      "enabled": True
    },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "type": "remote",
      "enabled": True,
      "headers": {
        "Authorization": f"Bearer {GITHUB_PAT}"
      }
    },
    "playwright": {
      "type": "local",
      "command": ["npx", "@playwright/mcp@latest"],
      "enabled": True,
    }
  },
}

with open("opencode.json", "w") as f:
    f.write(json.dumps(config))
