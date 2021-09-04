import React, { useState, useEffect } from 'react';
import styles from './Terminal.module.scss';
import Console from 'react-console-emulator';
import ManualPage from './ManualPage'
import Typist from 'react-typist';

// Pretty cool demo: https://codepen.io/spkml/pen/dgBqRm
const console = {
    container: {
        minHeight: '80%',
        maxHeight: '80%',
        paddingTop: '0px',
        backgroundColor: '#181818',
        width:'100%'
    },
    prompt: {
        color: 'orange',
    },
    content: {
        padding: '1px',
    },
};

const usage = (command) => {
    switch (command) {
        case 'append':
            return 'usage: append <number>';
        case 'delete':
            return 'usage: delete <number>';
    }
}



const Terminal = ({ executeCommand }) => {
    const [showMan, setShowMan] = useState(false) 

    const processCommand = (command, arg) => {
        if (arg && parseFloat(arg)) {
            executeCommand(command, arg);
        } else {
            return usage(command)
        }
    };

    const commands = {
        append: {
            usage: 'append <number>',
            fn: (arg) => {
                return processCommand('append', arg)
            },
        },
        delete: {
            usage: 'delete <number>',
            fn: (arg) => {
                return processCommand('delete', arg)
            }
        },
        man: {
            fn: () => {
                // avoid updating react state on unmounted component
                setTimeout(() => {
                    setShowMan(true);
                }, 10);
            }
        }
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
                    <Typist cursor={{ hideWhenDone: true }} avgTypingDelay={30}>
                        Type "man" for more commands
                    </Typist>
                )}
            </div>
            {showMan ? (
                <ManualPage setShowMan={setShowMan} />
            ) : (
                <Console
                    style={console.container}
                    promptLabel={'username@Structs.sh:~$'}
                    commands={commands}
                    promptLabelStyle={console.prompt}
                    contentStyle={console.content}
                    messageStyle={{ color: 'red' }}
                    autoFocus
                    // other props: contentStyle, inputAreaStyle, inputStyle, inputTextStyle
                />
            )}
        </div>
    );
};

export default Terminal;
