import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import FeesAndCharges from '@/components/ConfigureFeesAndCharges/FeesAndCharges';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const Charges = () => {
    return (
        <PrivateRoute>
      <AuthenticatedLayout>
        <FeesAndCharges/>
        </AuthenticatedLayout>
  </PrivateRoute>
    );
};

export default Charges;