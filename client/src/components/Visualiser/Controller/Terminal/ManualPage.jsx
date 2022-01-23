import PropTypes from 'prop-types';
import React, { useEffect, useReducer, useState } from 'react';
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

const ManualPage = ({ documentation, setShowMan }) => {
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

    const handleInput = (e) => {
        let str = e.target.value;
        setInput(str);
        if (str !== ':' && isSearch) {
            // only search if it is in search mode
            dispatch({ type: 'SEARCH_INPUT', payload: str });
            findMatchCommands(str);
        } else {
            setIsSearch(false);
        }
    };

    const findMatchCommands = (str) => {
        const matchCommands = state.data
            .filter(
                (item) =>
                    item.command.toLowerCase().includes(str.toLowerCase()) ||
                    item.description.toLowerCase().includes(str.toLowerCase())
            )
            .map((item) => {
                let newCommand = item.command.replace(
                    new RegExp(str, 'gi'),
                    (match) => `<mark>${match}</mark>`
                );
                let newUsage = item.usage.replace(
                    new RegExp(str, 'gi'),
                    (match) => `<mark>${match}</mark>`
                );
                let newDescription = item.description.replace(
                    new RegExp(str, 'gi'),
                    (match) => `<mark>${match}</mark>`
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

    return (
        <div className={styles.manualContainer}>
            {state.search.length > 0
                ? state.searchData.map((item, key) => <ManualText manual={item} key={key} />)
                : state.data.map((item, key) => <ManualText manual={item} key={key} />)}
            <input
                type="text"
                className={styles.searchBar}
                value={input}
                onInput={(e) => handleInput(e)}
                onKeyUp={(e) => handleQuit(e)}
                autoFocus
            />
        </div>
    );
};

ManualPage.propTypes = {
    setShowMan: PropTypes.func,
};
export default ManualPage;