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
            <Container>
                Pariatur aliqua exercitation esse consequat aliqua cupidatat officia in ex et quis tempor. Nostrud tempor eiusmod ad ad mollit consequat Lorem do nisi minim pariatur. Amet quis amet consectetur mollit. Culpa non esse do ipsum dolore et magna qui dolor non.
            </Container>
        </Layout>
    )
};

export default HomePage;
