import http from '@/common/http';

export const getPatientlistWithdueCharges = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getpatientlistwithduecharges', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPatientPendingCharges = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getpatientpendingcharges', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRevisedDiscount =  async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getreviseddiscount', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addInvoice =  async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/addinvoice', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

//80, 81 pending
