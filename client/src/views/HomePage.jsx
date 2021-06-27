import PageHeader from 'components/PageHeader/PageHeaderLayout.jsx';
import Layout from 'layout/Layout';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import styles from './HomePage.module.scss';
import { Searchbar } from 'components/Search';

const HomePage = (props) => {
    return (
        <Layout>
            <PageHeader>
                <div className={styles.headerContent}>
                    <h1 className={styles.title}>
                        <strong>Welcome to Structs.sh</strong>
                    </h1>
                    <p className={styles.description}>
                        An interactive learning platform designed for UNSW CSE students
                    </p>
                    <div className={styles.searchbarContainer}>
                        <Searchbar className={styles.searchbar} />
                    </div>

                    <Link to="/visualiser/linked-list">
                        <Button>Linked Lists</Button>
                    </Link>
                    <Link to="/visualiser/binary-search-tree">
                        <Button>Binary Search Trees</Button>
                    </Link>
                    <Link to="/visualiser/graph">
                        <Button>Graph</Button>
                    </Link>
                    <Link to="/visualiser/sorting">
                        <Button>Sorting</Button>
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
                </div>
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
