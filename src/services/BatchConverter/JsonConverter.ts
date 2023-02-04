import {Obj} from '@/utils/Obj';
import {BaseConverter} from './BaseConverter';

class JsonConverter extends BaseConverter<Record<string, any> | Record<string, any>[]> {
    prepare(data: Record<string, any> | Record<string, any>[]): number[] {
        if (!this.validateArray(data)) {
            const dataKey = this.getOption('dataKey', 'data');

            data = Obj.get(data, dataKey);

            this.arrayGuard(data, dataKey);
        }

        const valueKey: string = this.getOption('valueKey', 'value');
        const isSelf = valueKey === '__SELF__';
        const isValueString = this.getOption('isValueString') === true;

        return data.map((obj: Record<string, any>) => {
            this.arrayItemGuard(obj, isSelf);

            const rawValue = isSelf ? obj : obj[valueKey];

            return isValueString ? Number(rawValue) : rawValue;
        });
    }

    protected arrayGuard(data: any, dataKey: string): never | void {
        if (!this.validateArray(data)) {
            this.error(`If data is not array, value under key "${dataKey}" must be an array`);
        }
    }

    protected arrayItemGuard(item: any, isSelf: boolean): never | void {
        if (isSelf && typeof item === 'object') {
            this.error('When "valueKey" option is "__SELF__" array items must be primitive type');
        }

        if (!isSelf && (item === null || Array.isArray(item) || typeof item !== 'object')) {
            this.error('When "valueKey" option is not "__SELF__" array items must be object type');
        }
    }

    protected validate(data: any): boolean {
        return data !== null && (this.validateArray(data) || typeof data === 'object');
    }

    protected validateArray(data: any): boolean {
        return Array.isArray(data);
    }
}

export {JsonConverter};
