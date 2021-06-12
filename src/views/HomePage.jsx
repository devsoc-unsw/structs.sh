import PageHeader from 'components/PageHeader/PageHeaderLayout.jsx';
import Layout from 'layout/Layout';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';

const HomePage = (props) => {
    return (
        <Layout>
            <PageHeader>
                <h1>Structs.sh</h1>
                <h3>[Temporary buttons]</h3>
                <Link to="/visualiser/linked-list">
                    <Button>Linked Lists</Button>
                </Link>
                <Link to="/visualiser/binary-search-tree">
                    <Button>Binary Search Trees</Button>
                </Link>
                <Link to="/visualiser/graph">
                    <Button>Graph</Button>
                </Link>
                <Link to="/about">
                    <Button>About Us</Button>
                </Link>
                <Link to="/feedback">
                    <Button>Feedback</Button>
                </Link>
                <a href="/visualiser.html">
                    <Button>Vanilla JS Visualiser Test</Button>
                </a>
            </PageHeader>
            <Container>
                Pariatur aliqua exercitation esse consequat aliqua cupidatat officia in ex et quis
                tempor. Nostrud tempor eiusmod ad ad mollit consequat Lorem do nisi minim pariatur.
                Amet quis amet consectetur mollit. Culpa non esse do ipsum dolore et magna qui dolor
                non.
            </Container>
        </Layout>
    );
};

HomePage.propTypes = {};

export default HomePage;
