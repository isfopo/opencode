import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readText = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const configPath = path.join(root, "opencode.json");
const config = JSON.parse(readText(configPath));
const packagePath = path.join(root, "package.json");
const packageConfig = JSON.parse(fs.readFileSync(packagePath, "utf8"));

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(config.$schema === "https://opencode.ai/config.json", "opencode.json must declare the official schema");
assert(config.default_agent === "conductor", "default_agent must be conductor");
assert(config.experimental?.subagent_depth === 1, "experimental.subagent_depth must remain bounded at 1");
const mcpjungleTimeout = config.mcp?.servers?.mcpjungle?.timeout;
assert(mcpjungleTimeout?.catalog > 0, "mcpjungle must define a positive catalog timeout");
assert(mcpjungleTimeout?.execution > 0, "mcpjungle must define a positive execution timeout");
const chromeDevtoolsTimeout = config.mcp?.servers?.["chrome-devtools"]?.timeout;
assert(chromeDevtoolsTimeout?.catalog > 0, "chrome-devtools must define a positive catalog timeout");
assert(chromeDevtoolsTimeout?.execution > 0, "chrome-devtools must define a positive execution timeout");
assert(
  config.mcp?.servers?.["chrome-devtools"]?.command?.some((value) => value === "chrome-devtools-mcp@1.6.0"),
  "chrome-devtools MCP must use the pinned 1.6.0 version",
);

const agentNames = new Set(["conductor", "architect", "researcher", "builder", "reviewer"]);

for (const agent of agentNames) {
  const agentPath = path.join(root, "agents", `${agent}.md`);
  assert(fs.existsSync(agentPath), `missing agent file: agents/${agent}.md`);
  if (fs.existsSync(agentPath)) {
    const contents = readText(agentPath);
    assert(contents.startsWith("---\n"), `agent lacks frontmatter: ${agent}`);
    assert(contents.includes("description:"), `agent lacks description: ${agent}`);
  }
}

const localPlugins = config.plugins?.map((plugin) =>
  typeof plugin === "string" ? plugin : plugin?.package,
);
assert(
  localPlugins?.includes("./plugins/notify"),
  "local notify plugin must be configured",
);
assert(
  fs.existsSync(path.join(root, "plugins", "notify", "index.js")),
  "local notify plugin entrypoint is missing",
);

const commandDir = path.join(root, "commands");
for (const file of fs.readdirSync(commandDir).filter((name) => name.endsWith(".md"))) {
  const contents = readText(path.join(commandDir, file));
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
