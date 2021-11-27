/** @jsxImportSource @emotion/react */
import { Chip, Stack } from '@mui/material';
import React, { Fragment, useCallback } from 'react';

interface TagListProps {
    tags: string[];
    handleDelete?: (tag: string) => void;
    display?: boolean;
}

export const TagList: React.FC<TagListProps> = ({ tags, handleDelete, display }) => {
    const filterInvalidTags = useCallback((tags: string[]): string[] => {
        return tags.filter((tag: string) => {
            return /\S/.test(tag);
        });
    }, []);

    return tags && tags.length > 0 ? (
        <Stack direction="row" spacing={1}>
            {filterInvalidTags(tags).map((tag, index) => (
                <Fragment key={index}>
                    <Chip label={tag} onDelete={() => handleDelete(tag)} color="info" />
                </Fragment>
            ))}
        </Stack>
    ) : (
        <></>
    );
};
