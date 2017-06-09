'use strict';

const create = options => {
    const queueHandlers = [];
    const broadcastHandlers = [];

    const onEvent = (handler) => {
        queueHandlers.push(handler);
    };
    const onMessage = (handler) => {
        broadcastHandlers.push(handler);
    };
    const publish = (message) => {
        broadcastHandlers
            .slice()
            .forEach(handler => handler(message));
    };
    const enqueue = (event) => {
        queueHandlers
            .slice()
            .forEach(handler => handler(event));
    };

    return {
        queue: {
            enqueue,
            on: onEvent
        },
        broadcast: {
            publish,
            on: onMessage
        }
    };
};

module.exports = create;
