import React from 'react';
import styles from './PageHeader.module.scss';

// reactstrap components
import { Container } from 'reactstrap';

export default function PageHeader({ children }) {
    return (
        <div className="page-header header-filter" style={{ backgroundColor: '#4d18b8' }}>
            <div className="squares square1" />
            <div className="squares square2" />
            <div className="squares square3" />
            <div className="squares square4" />
            <div className="squares square5" />
            <div className="squares square6" />
            <div className="squares square7" />

            <Container>
                <div className={`content-center ${styles.content}`}>{children}</div>
            </Container>
        </div>
    );
}
