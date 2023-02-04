import type {Point} from '@/utils/algorithms/types';

import {ConverterError} from './ConverterError';
import {Converter} from './Converter';

abstract class BaseConverter<T> extends Converter<T> {
    abstract prepare(data: T): number[];

    protected abstract validate(data: any): boolean;

    convert(data: T): Point[] {
        this.dataGuard(data);

        return this
            .prepare(data)
            .map((value, i) => {
                this.notNumberArrayItemGuard(value, i);

                return [i + 1, value];
            });
    }

    protected error(message?: string): never {
        throw new ConverterError(message);
    }

    protected dataGuard(data: any, message?: string): never | void {
        if (!this.validate(data)) {
            this.error(message ?? 'Invalid data');
        }
    }

    protected notNumberArrayItemGuard(data: any, index: number): never | void {
        if (isNaN(data) || typeof data !== 'number') {
            this.error(`Array item under index "${index}" must be number`);
        }
    }
}

export {BaseConverter};
