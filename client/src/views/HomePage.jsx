import Layout from 'layout/Layout';
import React from 'react';
// import card1 from '../assets/img/card1.jpg';
// import card2 from '../assets/img/card2.jpg';
// import card3 from '../assets/img/card3.jpg';
// import card4 from '../assets/img/card4.jpg';
import styles from './HomePage.module.scss';

// const cards = [
//     {
//         title: 'Lists',
//         image: card1,
//         route: '/visualiser/linked-list',
//     },
//     {
//         title: 'Trees',
//         image: card2,
//         route: '/visualiser/binary-search-tree',
//     },
//     {
//         title: 'Graphs',
//         image: card3,
//         route: '/visualiser/graph',
//     },
//     {
//         title: 'Algorithms',
//         image: card4,
//         route: '/visualiser/sorting',
//     },
// ];

const HomePage = (props) => {
    return (
        <Layout>
            <div className={styles.headerContent}>
                <h1 className={styles.title}>
                    <strong>Welcome to Structs.sh</strong>
                </h1>
                <p className={styles.description}>
                    An interactive learning platform designed for UNSW CSE students
                </p>
                {/* <div className={styles.searchbarContainer}>
                    <Searchbar className={styles.searchbar} />
                </div> */}
                {/* carousel */}
                {/* <CustomCarousel items={cards} /> */}
            </div>
        </Layout>
    );
};

export default HomePage;
