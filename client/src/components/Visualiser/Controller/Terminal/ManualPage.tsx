import { CommandDocumentation } from 'components/Visualiser/commandsInputRules';
import PropTypes from 'prop-types';
import React, {
  FC, useEffect, useReducer, useState,
} from 'react';
import ManualText from './ManualText';
import styles from './Terminal.module.scss';

const initialState = {
  data: [],
  search: '',
  searchData: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
      };
    case 'SEARCH_INPUT':
      return { ...state, search: action.payload };
    case 'SEARCH_DATA':
      return { ...state, searchData: action.payload };
    default:
      throw new Error();
  }
};

interface Props {
  documentation: CommandDocumentation[];
  setShowMan: (shouldShow: boolean) => void;
}

const ManualPage: FC<Props> = ({ documentation, setShowMan }) => {
  const [input, setInput] = useState('');
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isSearch, setIsSearch] = useState(true);

  useEffect(() => {
    dispatch({ type: 'SET_DATA', payload: documentation });
  }, [documentation]);

  const handleQuit = (e) => {
    if (e.key === 'Enter' && input === ':q') {
      setShowMan(false);
    }
    if (e.key === 'Backspace' && !input.match(/:/)) {
      // when ':' is deleted, enter search mode again
      setIsSearch(true);
    }
  };

  const findMatchCommands = (str) => {
    const matchCommands = state.data
      .filter(
        (item) => item.command.toLowerCase().includes(str.toLowerCase())
          || item.description.toLowerCase().includes(str.toLowerCase()),
      )
      .map((item) => {
        const newCommand = item.command.replace(
          new RegExp(str, 'gi'),
          (match) => `<mark>${match}</mark>`,
        );
        const newUsage = item.usage.replace(
          new RegExp(str, 'gi'),
          (match) => `<mark>${match}</mark>`,
        );
        const newDescription = item.description.replace(
          new RegExp(str, 'gi'),
          (match) => `<mark>${match}</mark>`,
        );

        return {
          ...item,
          command: newCommand,
          usage: newUsage,
          description: newDescription,
        };
      });
    dispatch({ type: 'SEARCH_DATA', payload: matchCommands });
  };

  const handleInput = (e) => {
    const str = e.target.value;
    setInput(str);
    if (str !== ':' && isSearch) {
      // only search if it is in search mode
      dispatch({ type: 'SEARCH_INPUT', payload: str });
      findMatchCommands(str);
    } else {
      setIsSearch(false);
    }
  };

  return (
    <div className={styles.manualContainer}>
      {state.search.length > 0
        ? state.searchData.map((item, key) => (
          <ManualText manual={item as CommandDocumentation} key={key} />
        ))
        : state.data.map((item, key) => (
          <ManualText manual={item as CommandDocumentation} key={key} />
        ))}
      <input
        type="text"
        className={styles.searchBar}
        value={input}
        onInput={(e) => handleInput(e)}
        onKeyUp={(e) => handleQuit(e)}
      />
    </div>
  );
};

ManualPage.propTypes = {
  setShowMan: PropTypes.func,
};
export default ManualPage;
