import PageHeader from 'components/PageHeader/PageHeader';
import Layout from 'layout/Layout';
import React from 'react';
import {
    Container
} from 'reactstrap';

const HomePage = props => {
    return (
        <Layout>
            <PageHeader>
                <h1>Structs.sh</h1>
            </PageHeader>
            <Container>
                Pariatur aliqua exercitation esse consequat aliqua cupidatat officia in ex et quis tempor. Nostrud tempor eiusmod ad ad mollit consequat Lorem do nisi minim pariatur. Amet quis amet consectetur mollit. Culpa non esse do ipsum dolore et magna qui dolor non.
            </Container>
        </Layout>
    )
}

HomePage.propTypes = {

}

export default HomePage
