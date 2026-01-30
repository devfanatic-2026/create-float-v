#!/usr/bin/env node

// src/index.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prompts from "prompts";
import pc from "picocolors";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var banner = `
${pc.cyan("\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557")}
${pc.cyan("\u2551")}  ${pc.bold(pc.magenta("\u26A1 Create Float-V App"))}               ${pc.cyan("\u2551")}
${pc.cyan("\u2551")}  ${pc.dim("Ultra Modern Web Framework")}          ${pc.cyan("\u2551")}
${pc.cyan("\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D")}
`;
var templates = [
  {
    title: `Web ${pc.dim("(Next.js + @float-v/core)")}`,
    value: "web",
    description: "Modern web application with SSR, layouts, and routing."
  },
  {
    title: `Mobile ${pc.dim("(Expo + @float-v/lite)")}`,
    value: "mobile",
    description: "Cross-platform mobile app for iOS and Android."
  },
  {
    title: `Server ${pc.dim("(Headless + @float-v/core)")}`,
    value: "server",
    description: "API-only server for real-time and headless workloads."
  }
];
async function main() {
  console.log(banner);
  let targetDir = process.argv[2];
  if (!targetDir) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-float-app",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-z0-9-_]+$/i.test(value)) return "Invalid project name";
        return true;
      }
    });
    if (!response.projectName) {
      console.log(pc.red("\n\u274C Project creation cancelled\n"));
      process.exit(1);
    }
    targetDir = response.projectName;
  }
  const { template } = await prompts({
    type: "select",
    name: "template",
    message: "Select a template:",
    choices: templates
  });
  if (!template) {
    console.log(pc.red("\n\u274C Project creation cancelled\n"));
    process.exit(1);
  }
  const projectDir = path.resolve(process.cwd(), targetDir);
  if (fs.existsSync(projectDir)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `Directory ${targetDir} already exists. Overwrite?`,
      initial: false
    });
    if (!overwrite) {
      console.log(pc.red("\n\u274C Project creation cancelled\n"));
      process.exit(1);
    }
    fs.rmSync(projectDir, { recursive: true });
  }
  console.log(pc.cyan(`
\u{1F4C1} Generating ${pc.bold(template)} project in ${pc.bold(projectDir)}...
`));
  let templateDir = path.resolve(__dirname, "..", "templates", template);
  if (!fs.existsSync(templateDir)) {
    templateDir = path.resolve(__dirname, "..", "templates", template);
    if (!fs.existsSync(templateDir)) {
      templateDir = path.resolve(process.cwd(), "templates", template);
    }
  }
  if (!fs.existsSync(templateDir)) {
    console.log(pc.red(`
\u274C Template directory not found
`));
    process.exit(1);
  }
  copyDir(templateDir, projectDir);
  const pkgPath = path.join(projectDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = path.basename(projectDir);
    pkg.version = "0.1.0";
    if (pkg.dependencies) {
      if (pkg.dependencies["@float-v/core"]) pkg.dependencies["@float-v/core"] = "^1.0.0";
      if (pkg.dependencies["@float-v/lite"]) pkg.dependencies["@float-v/lite"] = "^1.0.0";
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }
  console.log(pc.green("\n\u2728 Project created successfully!"));
  console.log(pc.dim(`Template: ${template}
`));
  console.log(pc.bold("Next steps:\n"));
  console.log(`  ${pc.cyan("cd")} ${targetDir}`);
  console.log(`  ${pc.cyan("pnpm")} install`);
  console.log(`  ${pc.cyan("pnpm")} dev
`);
  console.log(pc.dim("Happy coding with Float-V! \u26A1\n"));
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(src)) {
    const srcFile = path.resolve(src, file);
    const destFile = path.resolve(dest, file);
    if (fs.lstatSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map