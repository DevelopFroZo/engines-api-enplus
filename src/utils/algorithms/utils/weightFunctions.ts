import type {Point, WeightFunction} from '../types';

function absoluteDistance(point0: Point, point1: Point): number {
    return Math.abs(point0[0] - point1[0]);
}

const weightFunctions: Record<string, WeightFunction> = {
    absoluteDistance,
};

export {weightFunctions};
