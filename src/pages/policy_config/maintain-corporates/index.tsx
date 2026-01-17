import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import MaintainTable from "@/components/MaintainCorporate/MaintainTable";
import PrivateRoute from "@/components/PrivateRoute";
import React from "react";

type Props = {};

function maintainCorporate({}: Props) {
  return(
  
  <PrivateRoute>
      <AuthenticatedLayout>
        <MaintainTable/>
        </AuthenticatedLayout>
  </PrivateRoute>
  )
}




export default maintainCorporate;

