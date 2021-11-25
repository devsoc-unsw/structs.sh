// import React from 'react';
// import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import { Container, Navbar, NavbarBrand } from 'reactstrap';
// import MenuIcon from '@mui/icons-material/Menu';
// import Sidebar from './sidebar';
// import { Drawer } from '@mui/material';
// import logo from 'assets/img/logo.png';
// import styles from './TopNavbar.module.scss';

// const TopNavbar = ({ showMenu }) => {
//     const [color, setColor] = React.useState('navbar-transparent');
//     const [showSidebar, setShowSidebar] = React.useState(false);

//     React.useEffect(() => {
//         window.addEventListener('scroll', changeColor);
//         return function cleanup() {
//             window.removeEventListener('scroll', changeColor);
//         };
//     }, []);

//     const changeColor = () => {
//         if (document.documentElement.scrollTop > 99 || document.body.scrollTop > 99) {
//             setColor('bg-info');
//         } else if (document.documentElement.scrollTop < 100 || document.body.scrollTop < 100) {
//             setColor('navbar-transparent');
//         }
//     };

//     const toggleSidebar = () => {
//         setShowSidebar(!showSidebar);
//     };

//     return (
//         <Navbar className={`fixed-top ${color} ${styles.navbar}`} color-on-scroll="100" expand="lg">
//             <Container>
//                 <div className="navbar-translate">
//                     {showMenu && (
//                         <>
//                             <MenuIcon
//                                 className={`navbar-toggle-sidebar ${styles.hamburger}`}
//                                 onClick={toggleSidebar}
//                             />
//                             <Drawer open={showSidebar} onClose={toggleSidebar}>
//                                 <Sidebar setShowSidebar={setShowSidebar} />
//                             </Drawer>
//                         </>
//                     )}
//                     <Link to="/">
//                         <div id="structs-logo">
//                             <img src={logo} alt="logo" />
//                         </div>
//                     </Link>
//                     <div className={styles.brandContainer}>
//                         <NavbarBrand to="/" tag={Link}>
//                             <span className={styles.brandName}>Structs.sh </span>
//                         </NavbarBrand>
//                     </div>
//                 </div>
//             </Container>
//         </Navbar>
//     );
// };

// TopNavbar.propTypes = {
//     showMenu: PropTypes.bool,
// };
// export default TopNavbar;

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

function appBarLabel(label: string) {
    return (
        <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {label}
            </Typography>
        </Toolbar>
    );
}

const TopNavbar = () => {
    return <AppBar>{appBarLabel('Structs.sh')}</AppBar>;
};

export default TopNavbar;
