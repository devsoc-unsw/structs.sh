import React from "react";
import {
  Col, Container,
  Row
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
