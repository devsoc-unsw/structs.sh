import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Alert, Box, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { FC, useEffect, useState } from 'react';
import { Topic } from 'utils/apiRequests';
import { LastLink, Link } from './Links';
import OperationDetails from './OperationDetails';
import { Operation, operationsDictionary } from '../operations';

export interface OperationsMenuState {
    [k: string]: boolean;
}

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topic: Topic;
}

const OperationsTree: FC<Props> = ({ topic, executeCommand }) => {
    // Tracks which operation items in the menu are expanded
    const [showOp, setShowOp] = useState<OperationsMenuState>({});

    const ops: Operation[] = operationsDictionary[topic.title];
    const theme: Theme = useTheme();
    const textPrimaryColour = theme.palette.text.primary;

    const handleClick = (command) => {
        setShowOp({ ...showOp, [command]: !showOp[command] });
    };

    return !ops ? (
        <Alert severity={'error'}>No operations are defined for the topic '{topic.title}'</Alert>
    ) : (
        <Box sx={{ padding: 2 }}>
            <Typography color="textPrimary">{topic.title}</Typography>
            <List>
                {ops.map((op, idx) => {
                    const isLast = idx === ops.length - 1;
                    return (
                        <Box key={idx}>
                            <ListItem
                                button
                                sx={{
                                    paddingTop: '0px',
                                    paddingBottom: '0px',
                                    paddingLeft: '35px',
                                }}
                                onClick={() => handleClick(op.command)}
                            >
                                <ListItemIcon>
                                    {isLast ? (
                                        <LastLink colour={textPrimaryColour} />
                                    ) : (
                                        <Link colour={textPrimaryColour} />
                                    )}
                                </ListItemIcon>
                                <Typography color="textPrimary">{op.command}</Typography>
                                {showOp[op.command] ? (
                                    <ExpandLess sx={{ fill: theme.palette.text.primary }} />
                                ) : (
                                    <ExpandMore sx={{ fill: theme.palette.text.primary }} />
                                )}
                            </ListItem>
                            {
                                <OperationDetails
                                    op={op}
                                    isLast={isLast}
                                    showOp={showOp}
                                    executeCommand={executeCommand}
                                />
                            }
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
};

export default OperationsTree;
