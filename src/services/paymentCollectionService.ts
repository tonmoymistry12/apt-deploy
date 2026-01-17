import http from '@/common/http';

export const getInvoicelistForCollection = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getinvoicelistforcollection', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getInvoiceDueCharges = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getinvoiceduechargedetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addCollection = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/addcollection', payload);
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

