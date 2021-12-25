import { Meteor } from 'meteor/meteor';
import { useEffect, useState } from 'react';
import React from 'react';
import { Row, Col, Space } from 'antd';
import type { ColumnType } from 'antd/es/table';

import { QueryInput } from '/imports/ui/QueryInput';
import { getAllSpecialities } from '/imports/db/specialities';
import { QueryResultsTable } from '/imports/ui/QueryResultsTable';
import type { Company } from '/imports/model/Company';
import { CompanyQueryData } from '/imports/model/CompanyQueryData';
import { QueryResult } from '/imports/model/QueryResult';

function getCompanyColumns(searchTerm?: string): ColumnType<Company>[] {
    return [
        {
            title: 'Name',
            dataIndex: 'name',
        },
    ];
}

function buildQuery(
    searchTerm: string,
    specialities: string[] | undefined,
    page: number,
    pageSize: number
): CompanyQueryData {
    return {
        searchTerm: searchTerm.length ? searchTerm : undefined,
        specialities,
        skip: (page - 1) * pageSize,
        limit: pageSize,
    };
}

export const CompanyList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>(getAllSpecialities());
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [queryResult, setQueryResult] = useState<QueryResult<Company>>({ data: [], from: 0, to: 0, total: 0 });

    useEffect(() => {
        setLoading(true);
        fetch(`${Meteor.absoluteUrl()}/api/v1/companies/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildQuery(searchTerm, selectedSpecialities, currentPage, pageSize)),
        })
            .then((data) => {
                setLoading(false);
                if (!data.ok) {
                    console.error('Failed to fetch data', data.status, data.statusText);
                    return;
                }

                data.json()
                    .then((json) => {
                        setQueryResult(json);
                    })
                    .catch((jsonError) => {
                        console.error('Failed to parse jsonData', jsonError);
                    });
            })
            .catch((error) => {
                console.error('Failed to fetch data', error);
            });
    }, [searchTerm, selectedSpecialities, currentPage]);

    return (
        <>
            <Row>
                <Col span={16} offset={4}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <h2>Company list</h2>
                        <QueryInput
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedSpecialities={selectedSpecialities}
                            setSelectedSpecialities={setSelectedSpecialities}
                        />
                        <QueryResultsTable
                            columns={getCompanyColumns()}
                            results={queryResult}
                            loading={loading}
                            currentPage={currentPage}
                            changePage={setCurrentPage}
                            pageSize={pageSize}
                            changePageSize={setPageSize}
                        />
                    </Space>
                </Col>
            </Row>
        </>
    );
};
