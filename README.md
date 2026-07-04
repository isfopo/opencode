# OpenCode Configuration

This is my OpenCode configuration directory with custom providers, MCP servers, and skills.

## Setup

Install dependencies:

```bash
cd ~/.config/opencode
npm install
```

## Authentication

API keys are stored in `~/.local/share/opencode/auth.json` (outside this repo) to keep them out of version control.

Example `auth.json`:

```json
{
  "opencode-go": {
    "type": "api",
    "key": "sk-xxxxxxxxxxxx"
  },
  "manifest": {
    "type": "api",
    "key": "mnfst_xxxxxxxxxxxx"
  }
}
```

This file is automatically created when you run `/connect` in OpenCode, or you can create it manually.

## Providers

### Manifest AI

Custom provider using `@ai-sdk/openai-compatible` with a Manifest router endpoint.

Configuration in `opencode.json`:

```json
{
  "provider": {
    "manifest": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Manifest",
      "options": {
        "baseURL": "https://router.lhun.net/v1"
      },
      "models": {
        "auto": {
          "name": "Manifest Auto"
        }
      }
    }
  }
}
```

## MCP Servers

- **chrome-devtools** - Browser automation and debugging
- **cloudflare** - Cloudflare Workers and Pages management
- **cloudflare-bindings** - Cloudflare bindings management
- **cloudflare-documentation** - Cloudflare docs search
- **cloudflare-observability** - Cloudflare observability tools
- **context7** - Library documentation lookup
- **deep-wiki** - GitHub repository documentation
- **homebrew** - Homebrew package management
- **mermaid** - Diagram generation
- **mobilenext** - Mobile device emulation and testing
- **playwright** - Browser automation
- **github** - GitHub API (requires `GITHUB_PAT` environment variable)

## GitHub MCP Setup

The GitHub MCP server requires a Personal Access Token. Set it in your shell profile:

```bash
export GITHUB_PAT=ghp_xxxxxxxxxxxx
```

Or create a `.env` file (gitignored):

```bash
GITHUB_PAT=ghp_xxxxxxxxxxxx
```

## Usage

Start OpenCode:

```bash
opencode
```

Or use the web interface:

```bash
opencode web
```
