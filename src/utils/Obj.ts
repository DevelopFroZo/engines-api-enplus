class Obj {
    private static fixKeys(keys: any) {
        if (keys instanceof Set) {
            return keys;
        }

        return new Set(keys);
    }

    static get(needle: any, key: any, replace: any = null) {
        if (needle === null) {
            return replace;
        }

        const keyArray = key.split('.');
        let current: any = needle;

        for (const keyItem of keyArray) {
            current = current[keyItem] ?? null;

            if (current === null) {
                return replace;
            }
        }

        return current;
    }

    static reduce(needle: any, callback: any, initialValue: any = {}) {
        return Object
            .entries(needle)
            .reduce((res, [key, value], index) => callback(res, key, value, index), initialValue);
    }

    static filter(needle: any, callback: any) {
        return this.reduce(needle, (res: any, key: any, value: any, index: any) => {
            if (callback(key, value, index)) {
                res[key] = value;
            }

            return res;
        });
    }

    static only(needle: any, only: any) {
        const fixedOnly = this.fixKeys(only);

        return this.filter(needle, (key: any) => fixedOnly.has(key));
    }

    static rename(needle: any, keysMap: any) {
        return this.reduce(needle, (res: any, key: any, value: any) => {
            const newKey = keysMap[key] ?? key;

            res[newKey] = value;

            return res;
        });
    }

    static renameKey(needle: any, oldKey: any, newKey: any) {
        return this.rename(needle, {[oldKey]: newKey});
    }
}

export {Obj};
