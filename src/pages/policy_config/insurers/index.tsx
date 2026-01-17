import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import InsurerTable from "@/components/Insurers/InsurerTable";

import PrivateRoute from "@/components/PrivateRoute";
import React from "react";

type Props = {};

function insurers({}: Props) {
  return(
  
  <PrivateRoute>
      <AuthenticatedLayout>
        <InsurerTable/>
        </AuthenticatedLayout>
  </PrivateRoute>
  )
}




export default insurers;
