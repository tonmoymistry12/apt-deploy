import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import PaymentCollection from "@/components/PaymentCollection";
import PrivateRoute from "@/components/PrivateRoute";
import React, { useState } from "react";

interface Invoice {
  id: number;
  ownerFirstName: string;
  ownerLastName: string;
  petName: string;
  mrn: string;
  encounterDate: string;
  totalDueAmount: number;
}

type Props = {};

const GenerateInvoicePage: React.FC<Props> = ({}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const handleDataUpdate = (updatedInvoices: Invoice[]) => {
    setInvoices(updatedInvoices);
    // Optionally, do something with the updated invoices (e.g., log them)
    console.log("Updated invoices:", updatedInvoices);
  };

  return (
    <PrivateRoute>
      <AuthenticatedLayout>
        <PaymentCollection />

      </AuthenticatedLayout>
    </PrivateRoute>
  );
};

export default GenerateInvoicePage;