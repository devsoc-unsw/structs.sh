import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import React from 'react';
// sections for this page/view
import Basics from "views/example-sections/Basics.js";
import Download from "views/example-sections/Download.js";
import Examples from "views/example-sections/Examples.js";
import JavaScript from "views/example-sections/JavaScript.js";
import Navbars from "views/example-sections/Navbars.js";
import Notifications from "views/example-sections/Notifications.js";
import NucleoIcons from "views/example-sections/NucleoIcons.js";
import Pagination from "views/example-sections/Pagination.js";
import Signup from "views/example-sections/Signup.js";
import Tabs from "views/example-sections/Tabs.js";
import Typography from "views/example-sections/Typography.js";
import styles from "layout/Layout.module.scss";
import {
    Container
} from "reactstrap";

const Layout = ({ Header, children }) => {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    },[]);

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <Header />
                <div className="main">
                    <Container className={styles.contentContainer}> 
                        {children}
                    </Container>
                </div>
            <Footer />
            </div>
        </>
    )
}

Layout.propTypes = {

}

export default Layout
