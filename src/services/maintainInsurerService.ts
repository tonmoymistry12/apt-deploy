import http from '@/common/http';

export const getOrgInsurers = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getorginsurers', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateinsurer = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/checkduplicateinsurer', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveInsurer = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/saveinsurer', payload);
    return data;
  } catch (error) {
    throw error;
  }
};