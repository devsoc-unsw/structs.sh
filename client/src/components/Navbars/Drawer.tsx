import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import React, {
    Dispatch,
    FC,
    Fragment,
    KeyboardEvent,
    MouseEvent,
    SetStateAction,
    useState,
} from 'react';

interface ContentsProps {
    setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

interface Props {
    Contents: React.FC<ContentsProps>;
}

const Sidebar: FC<Props> = ({ Contents }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleDrawer = (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as KeyboardEvent).key === 'Tab' || (event as KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setSidebarOpen(open);
    };

    return (
        <Fragment>
            <MenuIcon
                onClick={toggleDrawer(true)}
                className={`navbar-toggle-sidebar`}
                sx={{ cursor: 'pointer', marginRight: '10px' }}
            />
            <Drawer open={sidebarOpen} onClose={toggleDrawer(false)}>
                <Contents setShowSidebar={setSidebarOpen} />
            </Drawer>
        </Fragment>
    );
};

export default Sidebar;
