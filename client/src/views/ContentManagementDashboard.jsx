import React, { useEffect } from 'react';
import axios from 'axios';
import { ApiConstants } from 'constants/api';
import cogoToast from 'cogo-toast';
import { Notification } from 'utils/Notification';

const ContentManagementDashboard = () => {
    useEffect(() => {
        Notification.success('Ass');
    }, []);

    return (
        <div>
            <h1 onClick={() => alert('asd')}>Content management</h1>
        </div>
    );
};

export default ContentManagementDashboard;
