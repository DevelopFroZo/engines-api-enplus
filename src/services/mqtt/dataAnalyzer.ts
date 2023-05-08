import {client} from './client';

import {analyzeService} from '@/services/analyzeService';
import {analyzersRepository} from '@/repositories/analyzersRepository';

class Helper {
    private _thresholds: Map<string, number> = new Map();
    private _data: Map<string, number[]> = new Map();

    public threshold(code: string, threshold: number) {
        this._thresholds.set(code, threshold);
    }

    public hasThreshold(code: string): boolean {
        return this._thresholds.has(code);
    }

    public async data(code: string, value: number) {
        if (!this._data.has(code)) {
            this._data.set(code, []);
        }

        const threshold = this._thresholds.get(code);
        const data = this._data.get(code)!;
        const length = data.push(value);

        if (!threshold || length < threshold) return;

        const points = data
            .splice(0, threshold)
            .map<[number, number]>((value, i) => [i + 1, value]);

        await analyzeService.analyze(points, code);
    }
}

function dataAnalyzer(topic: string): void {
    const helper = new Helper();

    const preparedTopic = topic
        .replace('+', '(.*?)')
        .replace('#', '(.*)');

    const topicRegExp = new RegExp(`^${preparedTopic}$`);

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
        const matched = localTopic.match(topicRegExp);

        if (!matched) return;

        const code = matched[1];
        const value = parseInt(JSON.parse(payload.toString('utf8')));

        if (!helper.hasThreshold(code)) {
            const threshold = await analyzersRepository.getThresholdByCode(code);

            helper.threshold(code, threshold!);
        }

        await helper.data(code, value);
    });
}

export {dataAnalyzer};
