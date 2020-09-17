const handlers = require('./api/handlers');
const static = require('./api/static');

exports.handler = async event => {
    let res;

    try {
        if (event.path === '' || event.path === '/') {
            return {
                statusCode: 200,
                body: static.index(),
                headers: { 'Content-Type': 'text/html' }
            };
        }

        const path = event.path.substring(1);
        if (!handlers[path]) {
            return {
                statusCode: 400,
                body: JSON.stringify('command not allowed'),
            };
        }

        return handlers[path]()
            .then(res => ({
                statusCode: 200,
                body: JSON.stringify(res)
            }));
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify(e.stack),
        };
    }
};
