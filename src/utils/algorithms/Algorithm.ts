import type {Point, Series, Edge, WeightFunction, SeriesItem, Network} from './types';

import {
    markPoints,
    weightFunctions,
} from './utils';

interface ConstructorOptions {
    markFunction?: string,
    weightFunction?: string,
    isDirected?: boolean,
    isRemoveDuplicate?: boolean,
    algorithmParameters?: Record<string, any>,
}

abstract class Algorithm {
    protected _series: Series;
    protected _edges: Edge[];
    protected _weightFunction?: WeightFunction;
    protected _isDirected: boolean;
    protected _isRemoveDuplicate: boolean;
    protected _algorithmParameters: Record<string, any>;
    protected _uniqueIdx: Set<string> = new Set();

    constructor(
        points: Point[],
        {
            markFunction = 'x',
            weightFunction,
            isDirected = false,
            isRemoveDuplicate = true,
            algorithmParameters = {},
        }: ConstructorOptions = {}
    ) {
        this._series = markPoints(points, markFunction);
        this._edges = [];

        if (weightFunction) {
            this.setWeightFunction(weightFunction);
        }

        this._isDirected = isDirected;
        this._isRemoveDuplicate = isRemoveDuplicate;
        this._algorithmParameters = algorithmParameters;
    }

    static execute(points: Point[], settings: ConstructorOptions = {}): Network {
        // @ts-ignore
        const algorithm = new this(points, settings);

        algorithm.execute();

        return algorithm.getFullData();
    }

    setWeightFunction(weightFunction: string): this {
        if (typeof weightFunction === 'string') {
            this._weightFunction = weightFunctions[weightFunction];
        } else {
            this._weightFunction = weightFunction;
        }

        return this;
    }

    getFullData(): Network {
        return {
            series: this._series,
            edges: this._edges,
        };
    }

    makeEdge(seriesItem0: SeriesItem, seriesItem1: SeriesItem): this {
        const {label: label0} = seriesItem0;
        const {label: label1} = seriesItem1;

        if (this._isRemoveDuplicate) {
            const key0 = `${label0}_${label1}`;
            const key1 = `${label1}_${label0}`;

            if (
                this._uniqueIdx.has(key0) ||
                this._uniqueIdx.has(key1)
            ) {
                return this;
            }

            this._uniqueIdx.add(key0);
        }

        const edge: Edge = {
            source: label0,
            target: label1,
        };

        if (this._weightFunction) {
            edge.weight = this._weightFunction(seriesItem0.point, seriesItem1.point);
        }

        this._edges.push(edge);

        return this;
    }

    abstract execute(): void;
}

export {Algorithm};
