'use strict';

const create = options => {
    const queueHandlers = [];
    const broadcastHandlers = [];

    let mockEventInterval = null;

    const onEvent = (handler) => {
        queueHandlers.push(handler);

        if (!mockEventInterval) {
            mockEventInterval = setInterval(() => {
                const timestamp = new Date().getTime();
                // Simulate dummy event
                const dummyEvent = {
                    namespace: 'npp',
                    operation: 'create',
                    entity: {
                        id: `id_${timestamp}`,
                        type: 'someEntityType',
                        data: { timestamp }
                    }
                };
                enqueue(dummyEvent);
            }, 5000);
        }
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
            subscribe: onEvent
        },
        updates: {
            publish,
            subscribe: onMessage
        }
    };
};

module.exports = create;
