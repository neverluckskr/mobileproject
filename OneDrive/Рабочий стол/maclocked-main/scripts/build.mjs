import { spawn } from 'node:child_process';
import { mkdir, rm, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';
import esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const isWatch = process.argv.includes('--watch');
const shouldServe = process.argv.includes('--serve');

const entryPoints = {
  script: join(root, 'src', 'script.js'),
  admin: join(root, 'src', 'admin.js'),
};

const buildConfig = {
  entryPoints,
  bundle: true,
  format: 'esm',
  outdir: distDir,
  sourcemap: isWatch,
  minify: !isWatch,
  target: 'es2019',
  loader: { '.json': 'json' },
};

async function main() {
  await clean();
  await copyStatic();
  const context = await esbuild.context(buildConfig);
  if (isWatch) {
    await context.watch();
    watchStatic();
    if (shouldServe) {
      startServer();
    }
    console.log('Watching for changes…');
  } else {
    await context.rebuild();
    await context.dispose();
    console.log('Build completed.');
  }
}

async function clean() {
  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });
}

async function copyStatic() {
  const targets = [
    ['src/index.html', 'index.html'],
    ['src/admin.html', 'admin.html'],
    ['src/styles.css', 'styles.css'],
    ['src/manifest.json', 'manifest.json'],
    ['src/service-worker.js', 'service-worker.js'],
    ['src/icons', 'icons'],
    ['data', 'data'],
  ];
  await Promise.all(
    targets.map(([from, to]) =>
      cp(join(root, from), join(distDir, to), { recursive: true }),
    ),
  );
}

function watchStatic() {
  const watcher = chokidar.watch(
    [
      'src/**/*.html',
      'src/**/*.css',
      'src/icons/**/*',
      'data/**/*.json',
      'src/service-worker.js',
      'src/manifest.json',
    ],
    { ignoreInitial: true },
  );
  watcher.on('all', async () => {
    await copyStatic();
    console.log('Static assets updated.');
  });
}

function startServer() {
  const child = spawn(
    'npx',
    ['live-server', distDir, '--port=4173', '--quiet', '--watch=dist'],
    { stdio: 'inherit', shell: process.platform === 'win32' },
  );
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
