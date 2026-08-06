import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(root, "opencode.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(config.$schema === "https://opencode.ai/config.json", "opencode.json must declare the official schema");
assert(config.default_agent === "conductor", "default_agent must be conductor");
assert(config.subagent_depth === 1, "subagent_depth must remain bounded at 1");
assert(config.mcp?.mcpjungle?.timeout > 0, "mcpjungle must define a positive timeout");
assert(config.mcp?.["chrome-devtools"]?.timeout > 0, "chrome-devtools must define a positive timeout");
assert(
  config.mcp?.["chrome-devtools"]?.command?.some((value) => value === "chrome-devtools-mcp@1.6.0"),
  "chrome-devtools MCP must use the pinned 1.6.0 version",
);

const agentNames = new Set(["conductor", "architect", "researcher", "builder", "reviewer"]);

for (const agent of agentNames) {
  const agentPath = path.join(root, "agents", `${agent}.md`);
  assert(fs.existsSync(agentPath), `missing agent file: agents/${agent}.md`);
  if (fs.existsSync(agentPath)) {
    const contents = fs.readFileSync(agentPath, "utf8");
    assert(contents.startsWith("---\n"), `agent lacks frontmatter: ${agent}`);
    assert(contents.includes("description:"), `agent lacks description: ${agent}`);
  }
}

assert(fs.existsSync(path.join(root, "plugin", "notification.js")), "notification plugin is missing");

const commandDir = path.join(root, "command");
for (const file of fs.readdirSync(commandDir).filter((name) => name.endsWith(".md"))) {
  const contents = fs.readFileSync(path.join(commandDir, file), "utf8");
  const frontmatter = contents.match(/^---\n([\s\S]*?)\n---/);
  const declaredAgent = frontmatter?.[1].match(/^agent:\s*([^\s]+)$/m)?.[1];
  if (declaredAgent) assert(agentNames.has(declaredAgent), `${file} references unknown agent: ${declaredAgent}`);

  for (const [, referencedAgent] of contents.matchAll(/@([a-z][a-z0-9_-]*)/gi)) {
    if (["ARGUMENTS", "author"].includes(referencedAgent)) continue;
    assert(agentNames.has(referencedAgent), `${file} references unknown agent: @${referencedAgent}`);
  }
}

if (failures.length) {
  console.error("OpenCode setup validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("OpenCode setup validation passed.");
}
