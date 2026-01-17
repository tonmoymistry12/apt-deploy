import http from '@/common/http';

export const getPetOwnerList = async (payload: any): Promise<any[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || ""
     }
    const { data } = await http.post<any>('/getpetownerlist', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPetList = async (payload: any): Promise<any> => {
  try {
     let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || ""
     }
    const { data } = await http.post<any>('/getpetlist', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getPetDetails = async (payload: any): Promise<any> => {
  try {
    const fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
      orgId: localStorage.getItem("orgId") || "",
    }
    const { data } = await http.post<any>('/getpetprofile', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
}

export const savePetCall = async (payload: any): Promise<any> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
     }

    const { data } = await http.post<any>('/addpet', fixPaylod);
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

/* export const uploadDocument = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/uploaddocument', payload);
    return data;
  } catch (error) {
    throw error;
  }
}
 */
export const uploadDocument = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/uploaddocument', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const savePatient = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post<any>('/savepatient', payload);
    return data;
  } catch (error) {
    throw error;
  }
}
