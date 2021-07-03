import PageHeader from 'components/PageHeader/PageHeaderLayout.jsx';
import Layout from 'layout/Layout';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import styles from './HomePage.module.scss';
import { Searchbar } from 'components/Search';
// import { Button, Container } from 'reactstrap';
import CustomCarousel from '../components/CustomCarousel/CustomCarousel';
import card1 from '../assets/img/card1.jpg';
import card2 from '../assets/img/card2.jpg';
import card3 from '../assets/img/card3.jpg';
import card4 from '../assets/img/card4.jpg';

// TEST DATA
const cards = [
    {
        title: 'Lists',
        image: card1,
        route: '/visualiser/linked-list',
    },
    {
        title: 'Trees',
        image: card2,
        route: '/visualiser/binary-search-tree',
    },
    {
        title: 'Graphs',
        image: card3,
        route: '/visualiser/graph',
    },
    {
        title: 'Algorithms',
        image: card4,
        route: '/visualiser/sorting',
    },
];

const HomePage = (props) => {
    return (
        <Layout>
            <PageHeader>
                {/* carousel */}
                <CustomCarousel items={cards} />
                <>
                    {/* <h1>Structs.sh</h1>
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
                </a> */}
                </>
            </PageHeader>
        </Layout>
    );
};

HomePage.propTypes = {};

export default HomePage;
