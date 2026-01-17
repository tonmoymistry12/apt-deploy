import http from '@/common/http';

export const getDoctorDetails = async (payload: any): Promise<any[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
       doctorMasterId: localStorage.getItem("doctorUid") || ""

     }
    const { data } = await http.post<any>('/getdoctorprofiledetails', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveDoctorEducation = async (payload: any): Promise<any[]> => {
  try {
    let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
     }

    const { data } = await http.post<any>('/savedoctoreducation', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveDoctorExperience = async (payload: any): Promise<any[]> => {
  try {
  
let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
       orgId: localStorage.getItem("orgId") || "",
     }

    const { data } = await http.post<any>('/savedoctorexperience', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveProfileApi = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/editaccountdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

