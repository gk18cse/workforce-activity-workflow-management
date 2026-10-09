const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const backend = path.join(root, 'backend');
const mysqlStore = path.join(backend, '.mysql-data');
const mysqlData = path.join(mysqlStore, 'data');
const mysqlConfig = path.join(mysqlStore, 'my.ini');
const mysqlBase = process.env.MYSQL_BASEDIR || 'C:/Program Files/MySQL/MySQL Server 8.4';
const mysqlBin = process.env.MYSQL_BIN || path.join(mysqlBase, 'bin');
const mysqld = process.env.MYSQLD_PATH || path.join(mysqlBin, 'mysqld.exe');
const mysql = process.env.MYSQL_PATH || path.join(mysqlBin, 'mysql.exe');

let stopping = false;
const children = [];

function readDatabaseConfig() {
  const envFile = path.join(backend, '.env');
  if (!fs.existsSync(envFile)) throw new Error(`Missing ${envFile}`);

  const entry = fs.readFileSync(envFile, 'utf8').match(/^\s*DATABASE_URL\s*=\s*['"]?([^\r\n'"]+)/m);
  if (!entry) throw new Error('DATABASE_URL is missing from backend/.env');

  const url = new URL(entry[1].trim());
  if (url.protocol !== 'mysql:') throw new Error('This project expects a MySQL DATABASE_URL.');
  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
  };
}

function canConnect(host, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(700);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
  });
}

function run(executable, args, options = {}) {
  const result = spawnSync(executable, args, { cwd: root, encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `${path.basename(executable)} exited with ${result.status}`).trim());
  }
  return result.stdout;
}

function quoteIdentifier(value) {
  return `\`${value.replaceAll('`', '``')}\``;
}

async function ensureDatabase() {
  const config = readDatabaseConfig();
  const local = ['localhost', '127.0.0.1', '::1'].includes(config.host);
  const connectHost = local ? '127.0.0.1' : config.host;
  let fresh = false;

  if (!(await canConnect(connectHost, config.port)) && local) {
    if (!fs.existsSync(mysqld) || !fs.existsSync(mysql)) {
      throw new Error(`MySQL Server was not found at ${mysqlBase}. Install MySQL Server or set MYSQL_BASEDIR.`);
    }

    fs.mkdirSync(mysqlData, { recursive: true });
    const baseForIni = mysqlBase.replaceAll('\\', '/');
    const dataForIni = mysqlData.replaceAll('\\', '/');
    fs.writeFileSync(mysqlConfig, [
      '[mysqld]', `basedir=${baseForIni}`, `datadir=${dataForIni}`,
      `port=${config.port}`, 'bind-address=127.0.0.1', 'mysqlx=0', '',
    ].join('\n'));

    fresh = !fs.existsSync(path.join(mysqlData, 'mysql'));
    if (fresh) run(mysqld, [`--defaults-file=${mysqlConfig}`, '--initialize-insecure', '--console']);

    const server = spawn(mysqld, [`--defaults-file=${mysqlConfig}`, '--console'], {
      cwd: mysqlStore,
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    });
    server.unref();

    let ready = false;
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await canConnect(connectHost, config.port)) { ready = true; break; }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!ready) throw new Error('MySQL did not become ready on the configured port.');
    console.log(`[database] MySQL is running at ${config.host}:${config.port}`);
  } else if (!(await canConnect(connectHost, config.port))) {
    throw new Error(`Cannot reach the configured database at ${config.host}:${config.port}.`);
  }

  const sql = fresh
    ? `ALTER USER '${config.user.replaceAll("'", "''")}'@'localhost' IDENTIFIED BY '${config.password.replaceAll("'", "''")}';\nCREATE DATABASE IF NOT EXISTS ${quoteIdentifier(config.database)};\n`
    : `CREATE DATABASE IF NOT EXISTS ${quoteIdentifier(config.database)};\n`;
  run(mysql, [
    '--protocol=TCP', `--host=${connectHost}`, `--port=${config.port}`,
    `--user=${config.user}`, '--batch',
  ], { input: sql, env: { ...process.env, MYSQL_PWD: fresh ? '' : config.password } });

  const prisma = path.join(backend, 'node_modules', 'prisma', 'build', 'index.js');
  run(process.execPath, [prisma, 'migrate', 'deploy'], { cwd: backend });
  console.log('[database] Schema is up to date');
}

function shutdown(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill();
  }
  process.exitCode = exitCode;
}

async function start() {
  await ensureDatabase();
  const services = [
    {
      name: 'frontend',
      cwd: path.join(root, 'frontend'),
      script: path.join(root, 'frontend', 'node_modules', 'vite', 'bin', 'vite.js'),
      args: [],
    },
    {
      name: 'backend',
      cwd: backend,
      script: path.join(backend, 'node_modules', 'ts-node-dev', 'lib', 'bin.js'),
      args: ['--respawn', '--transpile-only', 'src/index.ts'],
    },
  ];

  for (const { name, cwd, script, args } of services) {
    const child = spawn(process.execPath, [script, ...args], { cwd, stdio: 'inherit', shell: false });
    children.push(child);
    child.on('error', (error) => {
      console.error(`[${name}] Could not start: ${error.message}`);
      shutdown(1);
    });
    child.on('exit', (code, signal) => {
      if (!stopping) {
        console.log(`[${name}] exited (${signal ?? code ?? 'unknown'})`);
        shutdown(code ?? 1);
      }
    });
  }
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start().catch((error) => {
  console.error(`[database] ${error.message}`);
  process.exitCode = 1;
});
