import {
    MqttClient,
    ClientSubscribeCallback,
    PacketCallback,
    OnMessageCallback,
} from 'mqtt';

import {client} from './client';

interface Options {
    requestTopic: string,
    responseTopic: string,
}

class TestMode {
    private readonly _client: MqttClient;
    private readonly _requestTopic: string;
    private readonly _responseTopic: string;
    private _isBusy: boolean = false;
    private _isEnabled: boolean = false;
    private readonly _onMessageCallback: OnMessageCallback;

    constructor(options: Options) {
        this._client = client;
        this._requestTopic = options.requestTopic;
        this._responseTopic = options.responseTopic;
        this._onMessageCallback = this.handleMessage.bind(this);
    }

    async enable(): Promise<Error | null> {
        if (this._isBusy) {
            return new Error('Service busy');
        }

        if (this._isEnabled) {
            return new Error('Already enabled');
        }

        if (!this._client.connected) {
            return new Error('MQTT client not connected');
        }

        this._isBusy = true;

        return new Promise<Error | null>(res => {
            this._client.subscribe(this._requestTopic, {qos: 2}, this.onSubscribeCallback(res));
        });
    }

    async disable(): Promise<Error | null> {
        if (this._isBusy) {
            return new Error('Service busy');
        }

        if (!this._isEnabled) {
            return new Error('Already disabled');
        }

        if (!this._client.connected) {
            return new Error('MQTT client not connected');
        }

        this._isBusy = true;

        return new Promise(res => {
            this._client.unsubscribe(this._requestTopic, {qos: 2}, this.onUnsubscribeCallback(res));
        });
    }

    public isEnabled(): boolean {
        return this._isEnabled;
    }

    private onSubscribeCallback(res: Function): ClientSubscribeCallback {
        return error => {
            if (!error) {
                this._client.on('message', this._onMessageCallback);

                this._isEnabled = true;
            }

            this._isBusy = false;

            res(error);
        };
    }

    private onUnsubscribeCallback(res: Function): PacketCallback {
        return error => {
            if (!error) {
                this._client.off('message', this._onMessageCallback);

                this._isEnabled = false;
            }

            this._isBusy = false;

            res(error);
        };
    }

    private handleMessage(topic: string, payload: Buffer): void {
        if (topic !== this._requestTopic) return;

        this._client.publish(this._responseTopic, payload, {qos: 2});
    }
}

let testMode_: TestMode;

function testMode(options?: Options): TestMode {
    if (!testMode_) {
        if (!options?.requestTopic) {
            throw new Error(`[MQTT TEST MODE] Initialize. Invalid argument "requestTopic"`);
        }

        if (!options?.responseTopic) {
            throw new Error(`[MQTT TEST MODE] Initialize. Invalid argument "responseTopic"`);
        }

        testMode_ = new TestMode(options);
    }

    return testMode_;
}

export {testMode};
