import http from '@/common/http';
import {
  CheckOrgCinLlpinPayload,
  GetCityListPayload,
  GetCityListResponse,
  GetAreaListSearchTextPayload,
  GetAreaListSearchTextResponse,
  CheckDuplicateOrgUsernamePayload,
  AddNewOrganizationPayload,
  AddNewOrganizationResponse,
  CheckDuplicateOrgPayload,
  CheckDuplicateOrgResponse,
} from '@/interfaces/registrationInterface';

export const checkOrgCinLlpin = async (payload: CheckOrgCinLlpinPayload) => {
  const response = await http.post('/checkorgcinllpin', payload);
  return response.data;
};

export const getCityList = async (payload: GetCityListPayload): Promise<GetCityListResponse[]> => {
  const response = await http.post('/getcitylist', payload);
  return response.data;
};

export const getAreaListSearchText = async (payload: GetAreaListSearchTextPayload): Promise<GetAreaListSearchTextResponse[]> => {
  const response = await http.post('/getarealistsearchtext', payload);
  return response.data;
};

export const checkDuplicateOrgUsername = async (payload: CheckDuplicateOrgUsernamePayload) => {
  const response = await http.post('/checkduplicateorgusername', payload);
  return response.data;
};

export const addNewOrganization = async (payload: AddNewOrganizationPayload): Promise<AddNewOrganizationResponse> => {
  const response = await http.post('/addneworganization', payload);
  return response.data;
};

export const checkDuplicateOrg = async (payload: CheckDuplicateOrgPayload): Promise<CheckDuplicateOrgResponse> => {
  const response = await http.post('/checkduplicateorg', payload);
  return response.data;
};

export const getPricingDetails = async (): Promise<any> => {
  const response = await http.post('/clinicsubscriptionpricingdetails', {
    "facilityTypeId": "1"
});
  return response.data;
};

export const getNoOfDoctors = async (): Promise<any> => {
  const response = await http.post('/getFacilityTypes', {});
  return response.data;
};

export const savePlans = async (payload:any): Promise<any> => {
  const response = await http.post('/saveclinicprobsubscriptiondata', payload);
  return response.data;
};

export const postProvisionalSubscription =  async (payload:any): Promise<any> => {
  const response = await http.post('/postProvisionalSubscription', payload);
  return response.data;
};

