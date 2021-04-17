import PageHeader from 'components/PageHeader/PageHeader.jsx';
import Layout from 'layout/Layout';
import React from 'react';
import LinkedList from 'components/Visualisation/LinkedList';
import {
    Container
} from 'reactstrap';

const HomePage = () => {
    return (
        <Layout>
            <PageHeader>
                <h1>Linked List</h1>
                <LinkedList />
            </PageHeader>
        </Layout>
    )
};

export default HomePage;
