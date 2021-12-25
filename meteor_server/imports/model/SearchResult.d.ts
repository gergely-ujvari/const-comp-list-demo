/*
 * A simple interface to represent are relevant query data
 */
export interface QueryResult<D> {
    data: D[];
    from: number;
    to: number;
    total: number;
}
