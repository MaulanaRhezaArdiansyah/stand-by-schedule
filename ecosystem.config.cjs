module.exports = {
  apps: [{
    name: 'standby-scheduler',
    script: 'bun',
    args: 'run src/server/index.ts',
    cwd: 'C:/typescript/stand-by-schedule',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 10001
    },
    error_file: 'logs/pm2-error.log',
    out_file: 'logs/pm2-out.log',
    log_file: 'logs/pm2-combined.log',
    time: true,
    merge_logs: true
  }]
}
