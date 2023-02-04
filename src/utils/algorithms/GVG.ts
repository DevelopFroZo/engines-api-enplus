import {Algorithm} from './Algorithm';

class GVG extends Algorithm {
    execute(): void {
        const {windowsCount = 1} = this._algorithmParameters;
        const seriesLength = this._series.length;

        for (let i = 0; i < seriesLength - 1; i++) {
            this.makeEdge(this._series[i], this._series[i + 1]);
        }

        const seriesItemsSorted = [...this._series].sort(({point: [, y0]}, {point: [, y1]}) => {
            if (y0 > y1) return -1;
            if (y0 < y1) return 1;

            return 0;
        });

        const lastY = seriesItemsSorted[0].point[1];
        const windowSize = (lastY - seriesItemsSorted[seriesLength - 1].point[1]) / windowsCount;
        let border = lastY - windowSize;
        let group = [];

        for (const seriesItem0 of seriesItemsSorted) {
            const {point: [, y]} = seriesItem0;

            if (y < border) {
                group = [];
                border = lastY - Math.ceil((lastY - y) / windowSize) * windowSize;
            }

            if (group.length > 0) {
                for (const seriesItem1 of group) {
                    this.makeEdge(seriesItem0, seriesItem1);
                }
            }

            group.push(seriesItem0);
        }
    }
}

export {GVG};
