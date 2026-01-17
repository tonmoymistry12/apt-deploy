import http from '@/common/http';

export const getOrgCorporates = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getorgcorporates', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateCorporate = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/checkduplicatecorporate', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveCorporate = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/savecorporate', payload);
    return data;
  } catch (error) {
    throw error;
  }
};