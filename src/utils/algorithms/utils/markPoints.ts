import type {Point, MarkFunction, Series} from '../types';

import {markFunctions} from './markFunctions';

function markPoints(points: Point[], markFunction: string | MarkFunction): Series {
    let markFunction_: MarkFunction;

    if (typeof markFunction === 'string') {
        markFunction_ = markFunctions[markFunction];
    } else {
        markFunction_ = markFunction;
    }

    return points.map((point, i) => ({
        point,
        label: markFunction_(point, i),
    }));
}

export {markPoints};
