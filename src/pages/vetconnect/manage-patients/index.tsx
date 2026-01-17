import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import VetConnectManagePatient from '@/components/vetconnect/ManagePatient';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const ManageProfile = () => {
    return (
        <PrivateRoute>
            <AuthenticatedLayout>
                <VetConnectManagePatient/>
            </AuthenticatedLayout>
        </PrivateRoute>
    );
};

export default ManageProfile;