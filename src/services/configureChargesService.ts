import http from '@/common/http';

export const getOrgPaymentConfigInfo = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getorgpaymentconfiginfo', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveOrganizationConfig = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/saveorganizationconfig', payload);
    return data;
  } catch (error) {
    throw error;
  }
};