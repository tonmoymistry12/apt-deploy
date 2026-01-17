import http from '@/common/http';

export const getinvoicehistorylist = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getinvoicehistorylist', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const viewInvoicecumcollection = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/viewinvoicecumcollection', payload);
    return data;
  } catch (error) {
    throw error;
  }
};


