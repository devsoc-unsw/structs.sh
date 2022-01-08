import React, { FC, useState } from 'react';
import Console from 'react-console-emulator';
import Typist from 'react-typist';
import docs from './manualDoc';
import ManualPage from './ManualPage';
import styles from './Terminal.module.scss';

const consoleStyle = {
    container: {
        height: 'calc(100% - 100px)',
        paddingTop: '0px',
        backgroundColor: '#181818',
        width: '100%',
    },
    prompt: {
        color: 'orange',
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

    // Attempts to execute command, catching obviously bad inputs and incorrect usage
    const processCommand = (command, arg) => {
        if (arg && parseFloat(arg)) {
            return executeCommand(command, arg);
        } else {
            const foundEntry = docs.find((entry) => entry.command === command);
            return foundEntry ? foundEntry.usage : `Documentation for ${command} not found`;
        }
    };

    // See console emulator docs: https://www.npmjs.com/package/react-console-emulator
    const commands = {
        append: {
            usage: 'append <number>',
            fn: (arg: string) => {
                return processCommand('append', [arg]);
            },
        },
        delete: {
            usage: 'delete <number>',
            fn: (arg: string) => {
                return processCommand('delete', [arg]);
            },
        },
        insert: {
            usage: 'insert <value> <index>',
            fn: (arg1: string, arg2: string) => {
                return processCommand('insert', [arg1, arg2]);
            },
        },
        search: {
            usage: 'search <value>',
            fn: (arg: string) => {
                return processCommand('search', [arg]);
            },
        },
        man: {
            fn: () => {
                // avoid updating react state on unmounted component
                setTimeout(() => {
                    setShowMan(true);
                }, 10);
            },
        },
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
                        Type "man" for more commands
                    </Typist>
                )}
            </div>
            {showMan ? (
                <ManualPage setShowMan={setShowMan} />
            ) : (
                <Console
                    style={consoleStyle.container}
                    promptLabel={'admin@Structs.sh:~$'}
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
