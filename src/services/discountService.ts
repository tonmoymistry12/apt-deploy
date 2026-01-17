import http from '@/common/http';

export const getLoyalityDiscount = async (payload: GetAllDiscountDetailsPayload): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<DiscountDetails>('/getalldiscountdetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const postLoyalityDiscount = async (payload: any): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<any>('/saveseniorcitizendiscountConfig', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCorporateDiscount = async (payload: any): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<any>('/getcorporatediscountdetail', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveCorporateDiscount = async (payload: any): Promise<DiscountDetails> => {
  try {
    const { data } = await http.post<any>('/savecorporatediscountconfig', payload);
    return data;
  } catch (error) {
    throw error;
  }
}
  export const getInsurerDiscount = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getinsurerdiscountdetail', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveInsurerDiscount = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/saveinsurerdiscountconfig', payload);
    return data;
  } catch (error) {
    throw error;
  }
};
