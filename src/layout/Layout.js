import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import React from 'react';

const Layout = ({ children }) => {

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
                <div className="main">
                    {children}
                </div>
            <Footer />
            </div>
        </>
    )
}

Layout.propTypes = {

}

export default Layout
