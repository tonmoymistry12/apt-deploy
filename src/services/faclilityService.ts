import http from '@/common/http';
import { FaclityServicePayload, FaclityServiceResponse, GetFacilityDetailsPayload, AddNewFacilityPayload } from '@/interfaces/facilityInterface';

export const getOwnFacilites = async (payload: any): Promise<FaclityServiceResponse[]> => {
  try {
     let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || "",
     }

    const { data } = await http.post<FaclityServiceResponse[]>('/getownfacility', fixPaylod);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getFacilityDetails = async (payload: GetFacilityDetailsPayload): Promise<any> => {
  try {
    const { data } = await http.post('/getfacilitydetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateFacility = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/checkduplicatefacility', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateFacilityTeleMedicine = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post("/checktelemedicinefacpresence", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLastSavedBillingConfiguration = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post("/getlastsavedbillingconfiguration", payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const addNewFacility = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/addnewfacility', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getCityList = async (searchText: string): Promise<any[]> => {
  try {
    const { data } = await http.post('/getcitylist', { searchText });
    return data;
  } catch (error) {
    throw error;
  }
};

export const editFacilityDetails = async (payload: any): Promise<any[]> => {
  
  try {
    const { data } = await http.post('/editfacilitydetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAreaListSearchText = async (cityId: string, searchText: string): Promise<any[]> => {
  try {
    const { data } = await http.post('/getarealistsearchtext', { cityId, searchText,searchWith:"area" });
    return data;
  } catch (error) {
    throw error;
  }
};
