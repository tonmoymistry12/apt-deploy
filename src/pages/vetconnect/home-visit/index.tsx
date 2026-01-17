import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import VetConnectHomeVisit from '@/components/vetconnect/HomeVisit';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const HomeVisit = () => {
    return (
        <PrivateRoute>
            <AuthenticatedLayout>
                <VetConnectHomeVisit/>
            </AuthenticatedLayout>
        </PrivateRoute>
    );
};

export default HomeVisit;
