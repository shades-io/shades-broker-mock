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
        process.nextTick(() => {
            broadcastHandlers
                .slice()
                .forEach(handler => handler(message));
        });
        return Promise.resolve();
    };
    const enqueue = (event) => {
        process.nextTick(() => {
            queueHandlers
                .slice()
                .forEach(handler => handler(event));
        });
        return Promise.resolve();
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
