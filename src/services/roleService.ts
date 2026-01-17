import http from '@/common/http';
import { GetOrgRolesPayload, GetOrgRolesResponse, GetAllRoleGroupOfOrgPayload, GetAllRoleGroupOfOrgResponse } from '@/interfaces/roleInterface';

export const getOrgRoles = async (payload: GetOrgRolesPayload): Promise<any[]> => {
  try {
    const { data } = await http.post<any[]>('/getorgroles', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllRoleGroupOfOrg = async (payload: GetAllRoleGroupOfOrgPayload): Promise<any[]> => {
  try {
    const { data } = await http.post<GetAllRoleGroupOfOrgResponse[]>('/getallrolegroupoforg', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveRole = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/saverole', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchRoleDetails = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/getroledetails', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const saverolefacilitymapping = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/saverolefacilitymapping', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchFacilites = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/getallfacilityoforg', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getfacilityidsforrolemapping = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/getfacilityidsforrolemapping', payload);
    return data;
  } catch (error) {
    throw error;
  }
};

export const checkDuplicateRoleName = async (payload: any): Promise<any[]> => {
  try {
    const { data } = await http.post('/checkduplicaterolename', payload);
    return data;
  } catch (error) {
    throw error;
  }
};





