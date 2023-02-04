import {MarkFunction, Point} from '../types';

function x([x]: Point): string {
    return `${x}`;
}

function idx([], i: number): string {
    return `${i}`;
}

const markFunctions: Record<string, MarkFunction> = {
    x,
    idx,
};

export {markFunctions};
