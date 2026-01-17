import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import PrivateRoute from '@/components/PrivateRoute';
import RenewPage from '@/components/RenewSubscription';
import React from 'react';

const RenewSubscriptionPage = () => {
    return (
        <PrivateRoute>
      <AuthenticatedLayout>
        <RenewPage/>
        </AuthenticatedLayout>
  </PrivateRoute>
    );
};

export default RenewSubscriptionPage;