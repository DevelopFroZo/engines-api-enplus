import {Point} from '@/utils/algorithms/types';

type Options = Record<string, any>;

abstract class Converter<T> {
    constructor(
        protected options: Options = {}
    ) {
    }

    abstract convert(data: T): Point[];

    protected getOptions(): Options {
        return this.options;
    }

    protected getOption(key: string, replacer: any = null): any {
        return this.options[key] ?? replacer;
    }
}

export type {Options};
export {Converter};
