import http from '@/common/http';

export const getCounsultationFees = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/getfeesandlocalcharges', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveCounsultationFees = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post<any>('/saveconsultationfeesconfiguration', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveProcedureList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/saveprocedure', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getProcedureList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getprocedurelist', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const deleteProcedure = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/removeprocedure', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const checkDuplicate = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/checkduplicateprocedurename', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const getPharmacyitemDetails = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getpharmacyitemdetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const saveMedicineList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/savepharmacyitem', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const removeMedicineList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/removepharmacyitem', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getMedicineList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getpharmacyitemlist', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const checkDuplicatePhermecyName = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/checkduplicatepharmacyitemname', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const checkDuplicateOrderName = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/checkduplicateordername', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const saveOrderName = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/saveorder', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const deleteOrder = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/removeorder', payload);
    return data;
  } catch (error) {
    throw error;
  }
}

export const getOrderList = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/getorderlist', payload);
    return data;
  } catch (error) {
    throw error;
  }
}
