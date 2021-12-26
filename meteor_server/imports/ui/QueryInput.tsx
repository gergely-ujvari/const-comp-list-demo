import React from 'react';
import { Input, Checkbox, Row, Col, Space } from 'antd';
import { getAllSpecialities } from '/imports/db/specialities';

/*
 * This component is responsible for showing the search bar and the specialities' checkbox group
 */
interface QueryInputProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedSpecialities: string[];
    setSelectedSpecialities: (selected: string[]) => void;
}

export const QueryInput = (props: QueryInputProps) => {
    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row>
                <Col span={4}>Company name</Col>
                <Col span={20}>
                    <Input.Search
                        placeholder="search for name fragment in company name"
                        allowClear
                        value={props.searchTerm}
                        onChange={(e) => props.setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={4}>Specialities</Col>
                <Col span={20}>
                    <Checkbox.Group
                        options={getAllSpecialities()}
                        value={props.selectedSpecialities}
                        onChange={(selected) => props.setSelectedSpecialities(selected as string[])}
                    />
                </Col>
            </Row>
        </Space>
    );
};
