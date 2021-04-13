/*!

=========================================================
* BLK Design System React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";

// sections for this page/view
import Basics from "views/example-sections/Basics.js";
import Navbars from "views/example-sections/Navbars.js";
import Tabs from "views/example-sections/Tabs.js";
import Pagination from "views/example-sections/Pagination.js";
import Notifications from "views/example-sections/Notifications.js";
import Typography from "views/example-sections/Typography.js";
import JavaScript from "views/example-sections/JavaScript.js";
import NucleoIcons from "views/example-sections/NucleoIcons.js";
import Signup from "views/example-sections/Signup.js";
import Examples from "views/example-sections/Examples.js";
import Download from "views/example-sections/Download.js";

export default function Components() {
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
        <PageHeader />
        <div className="main">
          <Basics />
          <Navbars />
          <Tabs />
          <Pagination />
          <Notifications />
          <Typography />
          <JavaScript />
          <NucleoIcons />
          <Signup />
          <Examples />
          <Download />
        </div>
        <Footer />
      </div>
    </>
  );
}
