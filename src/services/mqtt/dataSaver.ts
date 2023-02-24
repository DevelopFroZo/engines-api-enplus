import {client} from './client';

import {enginesDataService} from '@/services/enginesDataService';

function dataSaver(topic: string): void {
    client.on('connect', () => {
        console.log('[MQTT] Connected');

        client.subscribe(topic, {qos: 2}, err => {
            if (err) {
                console.error(`[MQTT] Error while subscribe to "${topic}" topic`);
                console.error(err);
            } else {
                console.log(`[MQTT] Subscribed to "${topic}" topic`);
            }
        });
    });

    client.on('message', async (localTopic, payload) => {
        if (localTopic !== topic) return;

        const model = JSON.parse(payload.toString('utf8'));

        try {
            await enginesDataService.createOne(model);
        } catch (error) {
            console.error('[MQTT] Error while saving data');
            console.error(error);
        }
    });
}

export {dataSaver};
