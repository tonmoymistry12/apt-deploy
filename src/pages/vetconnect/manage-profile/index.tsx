import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import VetConnectUserProfile from '@/components/vetconnect/ManageProfile';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const ManageProfile = () => {
    return (
        <PrivateRoute>
            <AuthenticatedLayout>
                <VetConnectUserProfile/>
            </AuthenticatedLayout>
        </PrivateRoute>
    );
};

export default ManageProfile;