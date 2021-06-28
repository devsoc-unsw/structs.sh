import { IconButton, List, ListItem, ListItemIcon } from '@material-ui/core';
import Collapse from '@material-ui/core/Collapse';
import React from 'react';
import logo from '../../assets/img/linked-list.svg';
import filter from '../../assets/img/filter.svg'
import { makeStyles } from '@material-ui/core/styles';
import Filter from "./filter"

const dataStructures = {
    'Linked-List': ['insert', 'delete'],
    'Tree': ['BFS', 'DFS'],
};

const useStyles = makeStyles({
    'strucFilter': {
        marginLeft: '240px',
        marginTop: '5px',
    },
});

const Sidebar = () => {
    const [open, setOpen] = React.useState({ 'Linked-List': false, Tree: false });
    const [showFilter, setShowFilter] = React.useState(false);
    

    const handleClick = (struct) => {
        setOpen({ ...setOpen, [struct]: !open[struct] });
    };

    const classes = useStyles();

    return (
        <div className="structure-list">
            <IconButton className={classes.strucFilter} onClick={e => setShowFilter(!showFilter)}>
                <img src={filter} alt="filter icon" />
            </IconButton>
            <Collapse in={showFilter} timeout="auto" unmountOnExit><Filter /></Collapse>
            <List>
                {Object.keys(dataStructures).map((struct, idx) => {
                    return (
                        <div key={idx} className="struct-item">
                            <ListItem
                                button
                                onClick={() => {
                                    handleClick(struct);
                                }}
                            >
                                <ListItemIcon>
                                    <img className="struct-logo" src={logo} alt="struct logo" />
                                </ListItemIcon>
                                <div>{struct}</div>
                            </ListItem>
                        </div>
                    );
                })}
            </List>
        </div>
    );
};

export default Sidebar;