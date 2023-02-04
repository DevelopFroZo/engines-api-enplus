import {resolve} from 'path';

import {Watcher as TSWatcher} from './ts';
import {Buffer} from './Buffer';
import {CachePurger} from './CachePurger';
import {Aliases} from './aliases';

interface Config {
    init?(): void
}

const tsWatcher = new TSWatcher();
const buffer = new Buffer<string>();
const cachePurger = new CachePurger(filter);
const aliases = new Aliases('tsconfig.json');

function filter(path: string) {
    if (!/\.js$/.test(path) || path.startsWith(resolve('zbnr'))) {
        return false;
    }
}

function watch(handlePaths: (paths: string[]) => void | Promise<void>, {init}: Config = {}) {
    if (typeof init === 'function') {
        init();
    }

    tsWatcher.before('writeFile', (path: string, oldTxt: string, bl: boolean) => {
        const [, newTxt] = aliases.replaceInText(oldTxt);

        buffer.addData(resolve(path));

        return [path, newTxt, bl];
    });

    buffer.hook(async (paths, ready) => {
        const purged = cachePurger.purge(...paths);
        const resultPaths = [...paths];

        for (const path of purged) {
            if (resultPaths.includes(path)) continue;

            resultPaths.push(path);
        }

        try {
            await handlePaths(resultPaths);
        } catch (error) {
            console.error(error);
        }

        ready();
    });

    tsWatcher.start();
}

export {watch};
