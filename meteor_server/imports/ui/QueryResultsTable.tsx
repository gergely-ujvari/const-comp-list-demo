import React from 'react';
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { QueryResult } from '/imports/model/QueryResult';

/*
 * This component shows any QueryResult in table format.
 * It parametrizes the general antd table component.
 */
interface QueryResultsTableProps {
    columns: ColumnType<any>[];
    results: QueryResult<any>;
    loading: boolean;
    currentPage: number;
    changePage: (page: number) => void;
    pageSize: number;
    changePageSize: (size: number) => void;
}

export const QueryResultsTable = (props: QueryResultsTableProps) => {
    return (
        <Table
            rowKey={(record) => record.id}
            columns={props.columns}
            loading={props.loading}
            dataSource={props.results.data}
            pagination={{
                current: props.currentPage,
                pageSize: props.pageSize,
                total: props.results.total,
                position: ['topRight', 'bottomRight'],
            }}
            onChange={(pagination) => {
                props.changePage(pagination.current || 1);
                props.changePageSize(pagination.pageSize || 10);
            }}
        />
    );
};
