import type {Converter, Options} from './Converter';

import {SeparatedConverter} from './SeparatedConverter';
import {JsonConverter} from './JsonConverter';
import {RawJsonConverter} from './RawJsonConverter';

class Factory {
    private static _converters: Map<string, typeof Converter> = new Map([
        ['separated', SeparatedConverter as typeof Converter],
        ['json', JsonConverter as typeof Converter],
        ['rawJson', RawJsonConverter as typeof Converter],
    ]);

    static make(type: string, options: Options = {}): Converter<any> {
        const ConverterClass = this._converters.get(type)!;

        // @ts-ignore
        return new ConverterClass(options);
    }
}

export {Factory};
