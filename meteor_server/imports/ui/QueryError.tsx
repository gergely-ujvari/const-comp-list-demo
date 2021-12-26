import React from 'react';
import { Result, Typography } from 'antd';

/*
 * Basic Error Status component
 */
interface QueryErrorProps {
    title?: string;
    subTitle?: string;
    invisible?: boolean;
}

export const QueryError = (props: QueryErrorProps) => {
    if (props.invisible) {
        return null;
    }

    return (
        <Result status="error" title={props.title} subTitle={props.subTitle}>
            <Typography.Paragraph>
                <Typography.Text>If the problem persists, contact an administrator!</Typography.Text>
            </Typography.Paragraph>
        </Result>
    );
};
