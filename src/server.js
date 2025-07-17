const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');

const init = async () => {
  const notesService = new NotesService();

    const server = Hapi.server({
        port: 3000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register({
        plugin: notes,
        options: {
            service: notesService,
        },
    });

    await server.register(Vision);
    server.views({
        engines: {
            hbs: Handlebars,
        },
        path: `${__dirname}/views`,
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            // Rendering an hbs view with Handlebars
            return h.view('index', {
                title: 'Hapi.js with Handlebars',
                message: 'Ini adalah template rendering engine menggunakan handlebars dan plugin vision'
            });
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();