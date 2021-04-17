import "assets/css/nucleo-icons.css";
import "assets/demo/demo.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ComponentsPage from "views/examples/ComponentsPage";
import LandingPage from "views/examples/LandingPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import RegisterPage from "views/examples/RegisterPage.js";
import HomePage from "views/HomePage.js";
import LinkedList from "components/Visualisation/LinkedList/LinkedList.tsx";

const routes = [
  // Visualiser routes
  {
    path: "/visualiser/linked-list",
    component: (props) => <LinkedList {...props} />
  },
  // Some default pages for showcasing the UI (made by the original template author, Creative Tim)
  {
    path: "/landing-page",
    component: (props) => <LandingPage {...props} />
  },
  {
    path: "/register-page",
    component: (props) => <RegisterPage {...props} />
  },
  {
    path: "/profile-page",
    component: (props) => <ProfilePage {...props} />
  },
  {
    path: "/components",
    component: (props) => <ComponentsPage {...props} />
  },
  // Home
  {
    path: "/",
    component: (props) => <HomePage {...props} />
  }
]

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {routes.map(eachRoute => (
        <Route
          path={eachRoute.path}
          render={eachRoute.component}
        />
      ))}
      {/* <Redirect from="/" to="/components" /> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
