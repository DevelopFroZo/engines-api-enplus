import type {Algorithm} from './Algorithm';

import {GVG} from './GVG';

const algorithms: Record<string, typeof Algorithm> = {
    gvg: GVG,
};

export {algorithms};
