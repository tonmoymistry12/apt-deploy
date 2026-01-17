interface DiscountDetails {
  discountName: string;
  discountType: "byval" | "bypercent";
  cuttOffAge: number;
  discountValue: number;
  discountPercentage: number;
  applyOnRegistration: 0 | 1;
  applyOnConsultation: 0 | 1;
  applyOnPharmacy: 0 | 1;
  applyOnProcedure: 0 | 1;
  applyOnOrder: 0 | 1;
  discountId: number;
}