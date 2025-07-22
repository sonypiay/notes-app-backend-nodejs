require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Handlebars = require('handlebars');
const notes = require('./api/notes');
const NotesService = require('./services/InMemory/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const notesService = new NotesService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
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

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if( response instanceof ClientError ) {
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            });

            newResponse.code(response.statusCode);
            return newResponse;
        }

        return h.continue;
    })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();