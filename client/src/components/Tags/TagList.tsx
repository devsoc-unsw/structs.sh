/** @jsxImportSource @emotion/react */
import { Chip, Stack } from '@mui/material';
import React, { Fragment, useCallback } from 'react';

interface TagListProps {
  tags: string[];
  handleDelete?: (tag: string) => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, handleDelete }) => {
  const filterInvalidTags = useCallback(
    (filterTags: string[]): string[] => filterTags.filter((tag: string) => /\S/.test(tag)),
    []
  );

  return tags && tags.length > 0 ? (
    <Stack direction="row" spacing={1}>
      {filterInvalidTags(tags).map((tag, index) => (
        <Fragment key={index}>
          <Chip
            label={tag}
            onDelete={handleDelete ? () => handleDelete(tag) : () => {}}
            color="info"
          />
        </Fragment>
      ))}
    </Stack>
  ) : null;
};
