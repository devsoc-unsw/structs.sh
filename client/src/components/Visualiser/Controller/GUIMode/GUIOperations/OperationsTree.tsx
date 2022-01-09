import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Alert, Box, List, ListItem, ListItemIcon, Theme, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import { getGUICommands, Operation } from 'components/Visualiser/commandsInputRules';
import React, { FC, useState } from 'react';
import { LastLink, Link } from './Links';
import OperationDetails from './OperationDetails';

export interface OperationsMenuState {
    [k: string]: boolean;
}

interface Props {
    executeCommand: (command: string, args: string[]) => string;
    topicTitle: string;
}

const OperationsTree: FC<Props> = ({ topicTitle, executeCommand }) => {
    // Tracks which operation items in the menu are expanded
    const [showOp, setShowOp] = useState<OperationsMenuState>({});

    const ops: Operation[] = getGUICommands(topicTitle);
    const theme: Theme = useTheme();
    const textPrimaryColour = theme.palette.text.primary;

    const handleClick = (command) => {
        setShowOp({ ...showOp, [command]: !showOp[command] });
    };

    return !ops ? (
        <Alert severity={'error'}>
            No operations are defined for the topicTitle '{topicTitle}'
        </Alert>
    ) : (
        <Box sx={{ padding: 2 }}>
            <Typography color="textPrimary">{topicTitle}</Typography>
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
