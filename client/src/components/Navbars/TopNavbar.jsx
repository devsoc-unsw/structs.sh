import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// reactstrap components
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import MenuIcon from '@material-ui/icons/Menu';
import Sidebar from './sidebar';
import { Drawer } from '@material-ui/core';
import logo from 'assets/img/logo.png';
import styles from './TopNavbar.module.scss';

const TopNavbar = ({ showMenu }) => {
    const [color, setColor] = React.useState('navbar-transparent');
    const [showSidebar, setShowSidebar] = React.useState(false);

    React.useEffect(() => {
        window.addEventListener('scroll', changeColor);
        return function cleanup() {
            window.removeEventListener('scroll', changeColor);
        };
    }, []);

    const changeColor = () => {
        if (document.documentElement.scrollTop > 99 || document.body.scrollTop > 99) {
            setColor('bg-info');
        } else if (document.documentElement.scrollTop < 100 || document.body.scrollTop < 100) {
            setColor('navbar-transparent');
        }
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <Navbar className={'fixed-top ' + color} color-on-scroll="100" expand="lg">
            <Container>
                <div className="navbar-translate">
                    {showMenu && (
                        <>
                            <MenuIcon
                                className={`navbar-toggle-sidebar ${styles.hamburger}`}
                                onClick={toggleSidebar}
                            />
                            <Drawer open={showSidebar} onClose={toggleSidebar}>
                                <Sidebar setShowSidebar={setShowSidebar} />
                            </Drawer>
                        </>
                    )}
                    <div id="structs-logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className={styles.brandContainer}>
                        <NavbarBrand to="/" tag={Link}>
                            <span className={styles.brandName}>Structs.sh </span>
                        </NavbarBrand>
                    </div>
                </div>
            </Container>
        </Navbar>
    );
};

TopNavbar.propTypes = {
    showMenu: PropTypes.bool,
};
export default TopNavbar;
