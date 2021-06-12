import React from 'react';
import { Link } from 'react-router-dom';
// reactstrap components
import {
    Button,
    Col,
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    Row,
    UncontrolledDropdown,
    UncontrolledTooltip,
} from 'reactstrap';

const TopNavbar = () => {
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const [collapseOut, setCollapseOut] = React.useState('');
    const [color, setColor] = React.useState('navbar-transparent');

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

    const toggleCollapse = () => {
        document.documentElement.classList.toggle('nav-open');
        setCollapseOpen(!collapseOpen);
    };

    const onCollapseExiting = () => {
        setCollapseOut('collapsing-out');
    };

    const onCollapseExited = () => {
        setCollapseOut('');
    };

    return (
        <Navbar className={'fixed-top ' + color} color-on-scroll="100" expand="lg">
            <Container>
                <div className="navbar-translate">
                    <NavbarBrand to="/" tag={Link} id="navbar-brand">
                        <span>Structs.sh </span>
                    </NavbarBrand>
                    <UncontrolledTooltip placement="bottom" target="navbar-brand">
                        Designed and Coded by Creative Tim
                    </UncontrolledTooltip>
                    <button
                        aria-expanded={collapseOpen}
                        className="navbar-toggler navbar-toggler"
                        onClick={toggleCollapse}
                    >
                        <span className="navbar-toggler-bar bar1" />
                        <span className="navbar-toggler-bar bar2" />
                        <span className="navbar-toggler-bar bar3" />
                    </button>
                </div>
                <Collapse
                    className={'justify-content-end ' + collapseOut}
                    navbar
                    isOpen={collapseOpen}
                    onExiting={onCollapseExiting}
                    onExited={onCollapseExited}
                >
                    <div className="navbar-collapse-header">
                        <Row>
                            <Col className="collapse-brand" xs="6">
                                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                    Structs.sh
                                </a>
                            </Col>
                            <Col className="collapse-close text-right" xs="6">
                                <button
                                    aria-expanded={collapseOpen}
                                    className="navbar-toggler"
                                    onClick={toggleCollapse}
                                >
                                    <i className="tim-icons icon-simple-remove" />
                                </button>
                            </Col>
                        </Row>
                    </div>
                    <Nav navbar>
                        <UncontrolledDropdown nav>
                            <DropdownToggle
                                caret
                                color="default"
                                data-toggle="dropdown"
                                href="#pablo"
                                nav
                                onClick={(e) => e.preventDefault()}
                            >
                                <i className="fa fa-cogs d-lg-none d-xl-none" />
                                Data Structures
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-with-icons">
                                <DropdownItem href="https://demos.creative-tim.com/blk-design-system-react/#/documentation/overview">
                                    <i className="tim-icons icon-paper" />
                                    Documentation
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/register-page">
                                    <i className="tim-icons icon-bullet-list-67" />
                                    Register Page
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/landing-page">
                                    <i className="tim-icons icon-image-02" />
                                    Landing Page
                                </DropdownItem>
                                <DropdownItem tag={Link} to="/profile-page">
                                    <i className="tim-icons icon-single-02" />
                                    Profile Page
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem>
                            <Button
                                className="nav-link d-none d-lg-block"
                                color="primary"
                                target="_blank"
                                href="https://www.creative-tim.com/product/blk-design-system-pro-react?ref=bdsr-user-archive-index-navbar-upgrade-pro"
                            >
                                Sign In
                            </Button>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNavbar;
