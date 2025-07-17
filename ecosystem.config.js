// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'notes-api',
            script: 'src/server.js',
            instances: 1,
            exec_mode: 'fork', // atau 'cluster'
            env: {
                NODE_ENV: 'development'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
