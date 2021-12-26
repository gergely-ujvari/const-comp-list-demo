import React from 'react';
/*
 * This simple component has one responsibility: Generate a JSX Element
 * where in the text the search result is highlighted with a <mark> html element.
 */
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
            <mark className="ccl-highlight">{text.substring(searchPos, searchPos + search.length)}</mark>
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
