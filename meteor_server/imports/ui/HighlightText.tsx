import React from 'react';

interface HighlightTextProps {
    text: string;
    searchTerm: string | undefined;
}

function hightLightSearch(text: string, search: string): JSX.Element {
    const searchPos = text.toLowerCase().indexOf(search.toLowerCase());
    if (searchPos < 0) {
        return <>{text}</>;
    }

    return (
        <>
            {text.substring(0, searchPos)}
            <mark>{text.substring(searchPos, searchPos + search.length)}</mark>
            {hightLightSearch(text.substring(searchPos + search.length), search)}
        </>
    );
}

export const HighlightText = (props: HighlightTextProps) => {
    if (!props.searchTerm || !props.searchTerm.length) {
        return <>{props.text}</>;
    }

    return hightLightSearch(props.text, props.searchTerm);
};
