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
import { HighlightText } from '/imports/ui/HighlightText';
import { QueryError } from '/imports/ui/QueryError';

function getCompanyColumns(searchTerm?: string): ColumnType<Company>[] {
    return [
        {
            title: 'Logo',
            dataIndex: 'logo',
            width: '20%',
            render: (logo) => {
                const url = logo == null ? 'https://placekitten.com/100/100' : logo;
                return <img src={url} height={64} />;
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: '20%',
            render: (name) => <HighlightText text={name} searchTerm={searchTerm} />,
        },
        {
            title: 'City',
            dataIndex: 'city',
            width: '20%',
        },
        {
            title: 'Specialities',
            dataIndex: 'specialities',
            width: '40%',
            render: (specs) => specs.join(', '),
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
    const [queryError, setQueryError] = useState<{ title: string; subTitle: string } | undefined>(undefined);

    useEffect(() => {
        setLoading(true);
        setQueryError(undefined);
        fetch(`${Meteor.absoluteUrl()}/api/v1/companies/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildQuery(searchTerm, selectedSpecialities, currentPage, pageSize)),
        })
            .then((data) => {
                setLoading(false);
                if (!data.ok) {
                    console.error('Failed to fetch data', data.status, data.statusText);
                    setQueryError({
                        title: 'Search Failed',
                        subTitle: `Status: ${data.status}. Details: ${data.statusText}.`,
                    });
                    return;
                }

                data.json()
                    .then((json) => {
                        setQueryResult(json);
                    })
                    .catch((jsonError) => {
                        console.error('Failed to parse jsonData', jsonError);
                        setQueryError({ title: 'Invalid data', subTitle: jsonError.toString() });
                    });
            })
            .catch((error) => {
                console.error('Failed to fetch data', error);
                setQueryError({ title: 'Search Failed', subTitle: error.toString() });
            });
    }, [searchTerm, selectedSpecialities, currentPage, pageSize]);

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
                            columns={getCompanyColumns(searchTerm)}
                            results={queryResult}
                            loading={loading}
                            currentPage={currentPage}
                            changePage={setCurrentPage}
                            pageSize={pageSize}
                            changePageSize={setPageSize}
                        />
                        <QueryError
                            title={queryError?.title}
                            subTitle={queryError?.subTitle}
                            invisible={queryError == null}
                        />
                    </Space>
                </Col>
            </Row>
        </>
    );
};
