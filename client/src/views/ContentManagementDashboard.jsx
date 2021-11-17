import React, { useEffect } from 'react';
import axios from 'axios';
import { ApiConstants } from 'constants/api';
import { Notification } from 'utils/Notification';

const ContentManagementDashboard = () => {
    useEffect(() => {
        axios
            .get(`${ApiConstants.URL}/api/lessons`)
            .then((res) => {
                Notification.success('Successfully fetched lessons');
            })
            .catch((err) => {
                Notification.error('Something went wrong');
            });
    }, []);

    return (
        <div>
            <h1 onClick={() => alert('asd')}>Content management</h1>
        </div>
    );
};

export default ContentManagementDashboard;
