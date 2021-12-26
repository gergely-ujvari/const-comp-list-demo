/*
 * A simple interface to represent a general query result.
 * Basically it's data + pagination info
 */
export interface QueryResult<D> {
    data: D[];
    from: number;
    to: number;
    total: number;
}
