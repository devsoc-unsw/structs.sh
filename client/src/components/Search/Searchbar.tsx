import React from 'react';
import { Form, FormGroup, Input } from 'reactstrap';
import styles from './Searchbar.module.scss';

const Searchbar = () => {
    return (
        <Form className={`form-inline ml-auto`}>
            <FormGroup className={`no-border ${styles.container}`}>
                <i className={`tim-icons icon-zoom-split ${styles.searchIcon}`} />
                <Input className={styles.searchbar} placeholder="Search" type="text"></Input>
            </FormGroup>
        </Form>
    );
};

export default Searchbar;
