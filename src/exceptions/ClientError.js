class ClientError extends Error {
    constructor(message, statusCode = 404) {
        super(message);

        this.statusCode = statusCode;
        this.name = 'ClientError';
    }
}

module.exports = ClientError;