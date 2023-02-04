export type Point = [number, number];

export interface SeriesItem {
    point: Point,
    label: string,
}

export type Series = SeriesItem[];

export interface Edge {
    source: string,
    target: string,
    weight?: number,
}

export interface Network {
    series: Series,
    edges: Edge[],
}

export type MarkFunction = (point: Point, index: number) => string;
export type WeightFunction = (point0: Point, point1: Point) => number;
