import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prompts from 'prompts';
import pc from 'picocolors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const banner = `
${pc.cyan('╔═══════════════════════════════════════╗')}
${pc.cyan('║')}  ${pc.bold(pc.magenta('⚡ Create Float-V App'))}               ${pc.cyan('║')}
${pc.cyan('║')}  ${pc.dim('Ultra Modern Web Framework')}          ${pc.cyan('║')}
${pc.cyan('╚═══════════════════════════════════════╝')}
`;

const templates = [
  {
    title: `Web ${pc.dim('(Float-V Core / SSR)')}`,
    value: 'web',
    description: 'High-performance web application with native SSR and file-based routing.'
  },
  {
    title: `Mobile ${pc.dim('(Expo + @float-v/lite)')}`,
    value: 'mobile',
    description: 'Cross-platform mobile app for iOS and Android.'
  },
  {
    title: `Server ${pc.dim('(Headless + @float-v/core)')}`,
    value: 'server',
    description: 'API-only server for real-time and headless workloads.'
  }
];

async function main() {
  console.log(banner);

  let targetDir = process.argv[2];

  if (!targetDir) {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name:',
      initial: 'my-float-app',
      validate: (value) => {
        if (!value) return 'Project name is required';
        if (!/^[a-z0-9-_]+$/i.test(value)) return 'Invalid project name';
        return true;
      },
    });

    if (!response.projectName) {
      console.log(pc.red('\n❌ Project creation cancelled\n'));
      process.exit(1);
    }
    targetDir = response.projectName;
  }

  const { template } = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select a template:',
    choices: templates,
  });

  if (!template) {
    console.log(pc.red('\n❌ Project creation cancelled\n'));
    process.exit(1);
  }

  const projectDir = path.resolve(process.cwd(), targetDir);

  if (fs.existsSync(projectDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `Directory ${targetDir} already exists. Overwrite?`,
      initial: false,
    });

    if (!overwrite) {
      console.log(pc.red('\n❌ Project creation cancelled\n'));
      process.exit(1);
    }
    fs.rmSync(projectDir, { recursive: true });
  }

  console.log(pc.cyan(`\n📁 Generating ${pc.bold(template)} project in ${pc.bold(projectDir)}...\n`));

  // Determine template directory
  // In dev: templates is in ../templates relative to dist/index.js (if running dist)
  // or ../../templates relative to dist/index.js
  // Let's assume standard publishing structure
  let templateDir = path.resolve(__dirname, '..', 'templates', template);

  if (!fs.existsSync(templateDir)) {
    // Try current dir if running from src (dev)
    templateDir = path.resolve(__dirname, '..', 'templates', template);
    if (!fs.existsSync(templateDir)) {
      templateDir = path.resolve(process.cwd(), 'templates', template);
    }
  }

  if (!fs.existsSync(templateDir)) {
    console.log(pc.red(`\n❌ Template directory not found\n`));
    process.exit(1);
  }

  // Copy template
  copyDir(templateDir, projectDir);

  // Update package.json
  const pkgPath = path.join(projectDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    pkg.name = path.basename(projectDir);
    pkg.version = '0.1.0';
    // Ensure we use the latest public versions of our packages
    if (pkg.dependencies) {
      if (pkg.dependencies['@float-v/core']) pkg.dependencies['@float-v/core'] = '^1.0.0';
      if (pkg.dependencies['@float-v/lite']) pkg.dependencies['@float-v/lite'] = '^1.0.0';
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  }

  console.log(pc.green('\n✨ Project created successfully!'));
  console.log(pc.dim(`Template: ${template}\n`));

  console.log(pc.bold('Next steps:\n'));
  console.log(`  ${pc.cyan('cd')} ${targetDir}`);
  console.log(`  ${pc.cyan('pnpm')} install`);
  console.log(`  ${pc.cyan('pnpm')} dev\n`);

  console.log(pc.dim('Happy coding with Float-V! ⚡\n'));
}

function copyDir(src: string, dest: string) {
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
