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
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="4">
            <h1 className="title">Structs.sh</h1>
          </Col>
          <Col md="8">
            Minim et exercitation ea ullamco aliqua ullamco duis magna. Veniam tempor amet exercitation irure occaecat consectetur officia et adipisicing reprehenderit elit commodo. Consectetur velit nulla consectetur sit id excepteur occaecat.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
