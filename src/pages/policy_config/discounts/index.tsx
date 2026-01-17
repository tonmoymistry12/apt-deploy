import AuthenticatedLayout from '@/components/AuthenticatedLayout';
import DiscountTabs from '@/components/ConfigureDiscounts';
import PrivateRoute from '@/components/PrivateRoute';
import React from 'react';

const Discounts = () => {
    return (
        <PrivateRoute>
      <AuthenticatedLayout>
        <DiscountTabs/>
        </AuthenticatedLayout>
  </PrivateRoute>
    );
};

export default Discounts;