/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import { TagList } from './TagList';

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const TagSelector: FC<TagSelectorProps> = ({ selectedTags, setSelectedTags }) => (
  <TagList
    tags={selectedTags}
    handleDelete={(tag: string) => {
      const filteredArr: string[] = selectedTags.filter((filterTag) => filterTag !== tag);
      setSelectedTags(filteredArr);
    }}
  />
);

export default TagSelector;
