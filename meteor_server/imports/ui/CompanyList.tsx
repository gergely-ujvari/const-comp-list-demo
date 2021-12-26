import { Meteor } from 'meteor/meteor';
import { useEffect, useState } from 'react';
import React from 'react';
import { Row, Col, Space, Tag } from 'antd';
import type { ColumnType } from 'antd/es/table';

import { QueryInput } from '/imports/ui/QueryInput';
import { numberOfSpecialities } from '/imports/db/specialities';
import { QueryResultsTable } from '/imports/ui/QueryResultsTable';
import type { Company } from '/imports/model/Company';
import { CompanyQueryData } from '/imports/model/CompanyQueryData';
import { QueryResult } from '/imports/model/QueryResult';
import { HighlightText } from '/imports/ui/HighlightText';
import { QueryError } from '/imports/ui/QueryError';
import { LOGO_HEIGHT, LOGO_WIDTH } from '/imports/consts';
/*
 * The CompanyList component acts as a main component for displaying a page with the:
 * - QueryInput (SearchBar + Specialities selector)
 * - QueryResultsTable (Showing the results in a paginated way)
 * - QueryError (Showing any occurring error message)
 *
 * Also this is the sole component that stores the state. Every other components gets them as simple props.
 * State:
 * - searchTerm: The company name fragment the user is typing into the search bar
 * - selectedSpecialities: The selected specialities to filter
 * - loading: Is data fetching in progress?
 * - pageSize: The current page size for the table component (relevant also to the query)
 * - currentPage: Which is the current page we're on
 * - queryResult: The result of the query
 * - queryError: Any possible errors
 *
 * In the state point of view the component is self-contained however for a real-life project using a state-manager
 * (like Mobx or Redux) would be a necessity
 */

function getCompanyColumns(searchTerm?: string, selectedSpecialities?: string[]): ColumnType<Company>[] {
    return [
        {
            title: 'Logo',
            dataIndex: 'logo',
            width: '20%',
            render: (logo) => {
                const url = logo == null ? `https://placekitten.com/${LOGO_WIDTH}/${LOGO_HEIGHT}` : logo;
                return <img src={url} height={LOGO_HEIGHT} />;
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
            render: (specs) => (
                <>
                    {specs.map((s: string) => {
                        const color = (selectedSpecialities || []).indexOf(s) > -1 ? '#8B0000' : '#108ee9';
                        return (
                            <Tag key={s} color={color}>
                                {s}
                            </Tag>
                        );
                    })}
                </>
            ),
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
        // Explanation: If all specialities are enabled then no filtering is needed
        // and treat none specialities as all
        specialities:
            specialities?.length === numberOfSpecialities() || specialities?.length === 0 ? undefined : specialities,
        skip: (page - 1) * pageSize,
        limit: pageSize,
    };
}

export const CompanyList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialities, setSelectedSpecialities] = useState<string[] | undefined>(undefined);
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
                <Col span={20} offset={2}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <h2>Company list</h2>
                        <QueryInput
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedSpecialities={selectedSpecialities || []}
                            setSelectedSpecialities={setSelectedSpecialities}
                        />
                        <QueryResultsTable
                            columns={getCompanyColumns(searchTerm, selectedSpecialities)}
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
