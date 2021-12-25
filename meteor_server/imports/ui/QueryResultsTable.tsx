import React from 'react';
import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { QueryResult } from '/imports/model/QueryResult';

interface QueryResultsTableProps {
    columns: ColumnType<any>[];
    results: QueryResult<any>;
    loading: boolean;
    currentPage: number;
    changePage: (page: number) => void;
    pageSize: number;
}

export const QueryResultsTable = (props: QueryResultsTableProps) => {
    return (
        <Table
            columns={props.columns}
            loading={props.loading}
            dataSource={props.results.data}
            pagination={{ current: props.currentPage, pageSize: props.pageSize, position: ['bottomCenter'] }}
            onChange={(pagination) => {
                props.changePage(pagination.current || 1);
            }}
        />
    );
};
