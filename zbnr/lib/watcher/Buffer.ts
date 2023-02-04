type Callback<Data> = (data: Data[], ready: () => void) => void;

class Buffer<Data> {
    private readonly _delay: number;

    private _callback: Callback<Data> = () => {
    };

    private _data: Data[] = [];
    private _timeout?: NodeJS.Timeout;
    private _isStopped: boolean = false;
    private _isReady: boolean = true;

    constructor(delay = 100) {
        this._delay = delay;
    }

    hook(callback: Callback<Data>): void {
        this._callback = callback;
    }

    maybeClearTimeout(): void {
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    debounce(): void {
        if (!this._isReady) return;

        this.maybeClearTimeout();

        this._timeout = setTimeout(() => {
            if (this._isReady && !this._isStopped && this._data.length > 0) {
                this._isReady = false;
                this._callback(this._data, () => this.ready());
                this._data = [];
            }
        }, this._delay);
    }

    addData(data: Data): void {
        if (this._isStopped) return;

        if (!this._data.includes(data)) {
            this._data.push(data);
        }

        this.debounce();
    }

    stop(): void {
        this._isStopped = true;
    }

    start(): void {
        this._isStopped = false;
    }

    ready(): void {
        this._isReady = true;
    }
}

export type {Callback};
export {Buffer};
