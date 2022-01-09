import React, { FC, useEffect, useState } from 'react';
import Console from 'react-console-emulator';
import Typist from 'react-typist';
import ManualPage from './ManualPage';
import styles from './Terminal.module.scss';
import {
    CommandDocumentation,
    getDocumentation,
    getVisualiserTerminalCommands,
} from '../../commandsInputRules';
import { titleToUrl } from 'utils/url';
import { useNavigate } from 'react-router-dom';

const consoleStyle = {
    container: {
        height: 'calc(100% - 100px)',
        paddingTop: '0px',
        backgroundColor: '#181818',
        width: '100%',
    },
    prompt: {
        color: 'orange',
        whiteSpace: 'nowrap',
    },
    content: {
        padding: '1px',
    },
};

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topicTitle: string;
}

const Terminal: FC<Props> = ({ executeCommand, topicTitle }) => {
    const [showMan, setShowMan] = useState(false);
    const [documentation, setDocumentation] = useState<CommandDocumentation[]>();

    const navigate = useNavigate();

    useEffect(() => {
        setDocumentation(getDocumentation(topicTitle));
    }, [topicTitle]);

    // Attempts to execute command, catching obviously bad inputs and incorrect usage
    const processCommand = (command: string, args: string[]): string => {
        if (args) {
            return executeCommand(command, args);
        } else {
            const foundEntry = documentation.find((entry) => entry.command === command);
            return foundEntry ? foundEntry.usage : `Documentation for ${command} not found`;
        }
    };

    // Visualiser commands
    const visualiserCommands = getVisualiserTerminalCommands(topicTitle, processCommand);

    // Built in commands that should be run when any topic is selected
    // TODO: these are experimental stubs
    const builtInCommands = {
        man: {
            fn: () => {
                // Note: timeout is necessary to avoid updating react state on unmounted component
                setTimeout(() => {
                    setShowMan(true);
                }, 10);
            },
        },
        cd: {
            fn: (path: string) => {
                navigate('/visualiser/' + path);
            },
        },
        ls: {
            fn: () => {
                return 'Linked Lists\nBinary Search Trees';
            },
        },
    };

    // Set of all commands that the terminal will be able to execute
    const commands = {
        ...visualiserCommands,
        ...builtInCommands,
    };

    return (
        <div className={styles.terminalContainer}>
            <div className={styles.output}>
                {showMan ? (
                    <div>
                        <Typist cursor={{ hideWhenDone: true }} avgTypingDelay={30}>
                            Type :q + Enter to exit
                        </Typist>
                    </div>
                ) : (
                    <Typist
                        className={styles.manualPrompt}
                        cursor={{ hideWhenDone: true }}
                        avgTypingDelay={30}
                    >
                        Type "man" to see commands available for '{topicTitle}'.
                    </Typist>
                )}
            </div>
            {showMan ? (
                <ManualPage documentation={documentation} setShowMan={setShowMan} />
            ) : (
                <Console
                    style={consoleStyle.container}
                    promptLabel={`/${titleToUrl(topicTitle)} $`}
                    commands={commands}
                    promptLabelStyle={consoleStyle.prompt}
                    contentStyle={consoleStyle.content}
                    messageStyle={{ color: 'red' }}
                    autoFocus
                    // other props: contentStyle, inputAreaStyle, inputStyle, inputTextStyle
                />
            )}
        </div>
    );
};

export default Terminal;
