import {BaseConverter} from './BaseConverter';

class SeparatedConverter extends BaseConverter<string> {
    prepare(data: string): number[] {
        const separator = this.getOption('separator', ' ');

        return data.split(separator).map(Number);
    }

    protected validate(data: any): boolean {
        return typeof data === 'string';
    }
}

export {SeparatedConverter};
