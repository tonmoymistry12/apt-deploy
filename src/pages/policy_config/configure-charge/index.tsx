import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import ChargeEventTabs from '@/components/ConfigureCharge';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const Charges = () => {
    return (
        <PrivateRoute>
      <AuthenticatedLayout>
        <ChargeEventTabs/>
        </AuthenticatedLayout>
  </PrivateRoute>
    );
};

export default Charges;