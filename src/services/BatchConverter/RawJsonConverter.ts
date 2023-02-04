import {BaseConverter} from './BaseConverter';
import {JsonConverter} from './JsonConverter';

class RawJsonConverter extends BaseConverter<string> {
    prepare(data: string): number[] {
        try {
            return new JsonConverter(this.getOptions()).prepare(JSON.parse(data));
        } catch (error) {
            if (error instanceof SyntaxError) {
                this.error('Invalid JSON input');
            }

            throw error;
        }
    }

    protected validate(data: any): boolean {
        return typeof data === 'string';
    }
}

export {RawJsonConverter};
