import http from '../common/http';

// Interface for API payloads
interface GetOrgUsersPayload {
  userName: string;
  userPwd: string;
  callingFrom: string;
  orgId: string;
  loggedinFacilityId: string;
  orgFacilityId: string;
  statusId: number;
}

interface GetUserDetailsPayload {
  callingFrom: string;
  userName: string;
  userPwd: string;
  orgId: string;
  loggedinFacilityId: string;
  orgUserId: string;
}

interface GetAllRoleGroupOfOrgPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
}

// Interface for user response
interface User {
  orgUserId: number;
  userNameWithTitle?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  cellNumber?: string;
  imageFilePath?: string;
  activeInd: number;
  isDoctor: number;
  userTitle?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  areaName?: string;
  country?: string;
  state?: string;
  pin?: string;
  userName?: string;
  userUid?: number;
  specialty?: string;
  orgUserQlfn?: string;
  councilId?: string;
  yearOfReg?: number;
  roleName?: string;
  imageFileName?: string;
}

// Interface for council response
interface Council {
  councilId: string;
  councilName: string;
  statusMessage?: string | null;
  errorMessage?: string | null;
}

// Interface for role group response
interface RoleGroup {
  roleGroupId: number;
  roleGroupName: string;
}

// Fetch all users (getorgusers)
export const getOrgUsers = async (statusId: number): Promise<User[]> => {
  const payload: GetOrgUsersPayload = {
    userName: localStorage.getItem('userName') || '',
    userPwd: localStorage.getItem('userPwd') || '',
    callingFrom: 'web',
    orgId: localStorage.getItem('orgId') || '',
    loggedinFacilityId: '1',
    orgFacilityId: '0',
    statusId,
  };

  try {
    const response = await http.post('/getorgusers', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch user details (getuserdetails)
export const getUserDetails = async (orgUserId: string): Promise<User | null> => {
  const payload: GetUserDetailsPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPwd: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedinFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
  };

  try {
    const response = await http.post('/getuserdetails', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

// Fetch council list (getcouncillist)
export const getCouncilList = async (): Promise<Council[]> => {
  try {
    const response = await http.post('/getcouncillist', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching council list:', error);
    return [];
  }
};

export const editUser = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/edituserdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const addUser = async (payload: any): Promise<any> => {
  try {
    const { data } = await http.post('/adduserdetails', payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export const getSpecalityList = async (): Promise<any[]> => {
  

  try {
    const {data} = await http.post('/getspecialtylist', {});
    return data;
  } catch (error) {
    console.error('Error fetching specality list:', error);
    return [];
  }
};

// Fetch role group list (getallrolegroupoforg)
export const getAllRoleGroupOfOrg = async (orgId: string = localStorage.getItem('orgId') || ''): Promise<RoleGroup[]> => {
  const payload: GetAllRoleGroupOfOrgPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId,
  };

  try {
    const response = await http.post('/getallrolegroupoforg', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching role group list:', error);
    return [];
  }
};

// Interface for registration details payload
interface RegistrationDetailsPayload {
  councilId: string;
  yearReg: string;
  registrationNumber: string;
}

// Interface for registration details response
export interface RegistrationDetailsResponse {
  councilId: string | null;
  registrationNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  statusMessage: string;
  cellNumber: string | null;
  orgUserQlfn: string | null;
  userName: string | null;
  createdBy: string | null;
  gblSpltyId: number | null;
  provUserUid: number | null;
  userUid: number | null;
  yearReg: number;
}

// Check doctor registration details
export const checkDoctorRegistration = async (payload: RegistrationDetailsPayload): Promise<RegistrationDetailsResponse> => {
  try {
    const response = await http.post('/registrationdetails', payload);
    return response.data;
  } catch (error) {
    console.error('Error checking doctor registration:', error);
    throw error;
  }
};

// Get doctor list interfaces
export interface GetDoctorListPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  deviceStat: string;
  orgId: string;
}

export interface DoctorListItem {
  userName: string;
  roleName: string | null;
  imageFilePath: string | null;
  roleGroup: string | null;
  userNameWithTitle: string | null;
  email: string | null;
  userLoggedInAs: string | null;
  clinicType: string | null;
  userPassword: string | null;
  userTitle: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  cellNumber: string | null;
  imageFileName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  pin: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  orgUserQlfn: string | null;
  specialty: string;
  areaName: string | null;
  profileDetails: string | null;
  councilId: string | null;
  ownerUid: number;
  orgUserId: number;
  orgId: number;
  userUid: number;
  aptcarePUserId: number;
  glbSpltyId: number;
  cityPincodeMappingId: number;
  cityId: number;
  activeInd: number;
  isDoctor: number;
  yearOfReg: number;
  charge: number;
  registrationNumber: string | null;
}

// Get doctor list API
export const getDoctorList = async (payload: GetDoctorListPayload): Promise<DoctorListItem[]> => {
  try {
    
let fixPaylod = {
      ...payload,
      loggedInFacilityId: localStorage.getItem("loggedinFacilityId") || ""
     }

    const response = await http.post('/getdoctorlist', fixPaylod);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor list:', error);
    throw error;
  }
};

// Interface for assigned facilities payload
interface GetAssignedFacilitiesPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
  loggedInFacilityId: string;
  orgUserId: string;
}

// Interface for assigned facilities response
export interface AssignedFacility {
  facilityId: number;
  facilityName: string;
  orgId: number;
  [key: string]: any; // Allow other properties from API response
}

// Get assigned facilities for a user
export const getAssignedFacilities = async (orgUserId: string): Promise<AssignedFacility[]> => {
  const payload: GetAssignedFacilitiesPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedInFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
  };

  try {
    const response = await http.post<AssignedFacility[]>('/getassignedfacilities', payload);
    // Ensure response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      // If response.data is an object, try to extract array from it
      console.warn('API returned non-array response:', response.data);
      return [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching assigned facilities:', error);
    throw error;
  }
};

// Interface for facility user role mapping payload
interface GetOrgFacilityUserRoleMappingPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
  loggedInFacilityId: string;
  orgUserId: string;
}

// Interface for facility user role mapping response
export interface FacilityUserRoleMapping {
  roleName: string;
  roleGroupName: string;
  roleId: number;
  facilityId: number;
  orgUserId: number;
  activeInd: number;
  [key: string]: any; // Allow other properties from API response
}

// Get organization facility user role mapping
export const getOrgFacilityUserRoleMapping = async (orgUserId: string): Promise<FacilityUserRoleMapping[]> => {
  const payload: GetOrgFacilityUserRoleMappingPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedInFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
  };

  try {
    const response = await http.post<any>('/getorgfacilityuserrolemapping', payload);
    
    // Handle case where API returns a message object instead of array
    if (response.data && typeof response.data === 'object') {
      // Check if it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // Check if it's a message object (e.g., { message: "...", status: "notfound" })
      if (response.data.message || response.data.status) {
        console.log('No role mappings found:', response.data.message || response.data.status);
        return [];
      }
    }
    
    // Default: return empty array if response is not in expected format
    return [];
  } catch (error) {
    console.error('Error fetching facility user role mapping:', error);
    // Return empty array instead of throwing, so UI can still show available roles
    return [];
  }
};

// Interface for user facility privilege mapping payload
interface GetOrgUserFacilityPrivilegeMappingPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
  loggedInFacilityId: string;
  orgUserId: string;
}

// Interface for user facility privilege mapping response
export interface UserFacilityPrivilegeMapping {
  id: number;
  privilegeId: number;
  parentId: number;
  facilityId: number;
  menuName: string;
  displayName: string | null;
  menuAction: string | null;
  facilityName: string | null;
}

// Get organization user facility privilege mapping
export const getOrgUserFacilityPrivilegeMapping = async (orgUserId: string): Promise<UserFacilityPrivilegeMapping[]> => {
  const payload: GetOrgUserFacilityPrivilegeMappingPayload = {
    callingFrom: 'web',
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedInFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
  };

  try {
    const response = await http.post<any>('/getorguserfacilityprivilegemapping', payload);
    
    // Handle case where API returns a message object instead of array
    if (response.data && typeof response.data === 'object') {
      // Check if it's an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // Check if it's a message object (e.g., { message: "...", status: "notfound" })
      if (response.data.message || response.data.status) {
        console.log('No privilege mappings found:', response.data.message || response.data.status);
        return [];
      }
    }
    
    // Default: return empty array if response is not in expected format
    return [];
  } catch (error) {
    console.error('Error fetching user facility privilege mapping:', error);
    // Return empty array instead of throwing, so UI can still show available privileges
    return [];
  }
};

// Interface for all roles of facility payload
interface GetAllRolesOfFacilityPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  callingFrom: string;
  orgId: string;
  facilityId: string;
  isDoctor: string; // '0' or '1'
}

// Interface for all roles of facility response
export interface FacilityRole {
  roleName: string;
  orgRoleGroup: string | null;
  globalRoleGroup: string;
  orgRoleId: number;
  globalRoleGroupId: number;
  orgId: number;
  activeInd: number;
}

// Get all roles of facility
export const getAllRolesOfFacility = async (facilityId: string, isDoctor: boolean): Promise<FacilityRole[]> => {
  const payload: GetAllRolesOfFacilityPayload = {
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    deviceStat: 'M',
    callingFrom: 'web',
    orgId: localStorage.getItem('orgId') || '',
    facilityId,
    isDoctor: isDoctor ? '1' : '0',
  };

  try {
    const response = await http.post<any>('/getallrolesoffacility', payload);
    console.log('getAllRolesOfFacility API response:', response);
    console.log('getAllRolesOfFacility response.data:', response.data);
    
    // Ensure response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response.data is not an array, log and return empty array
    console.warn('getAllRolesOfFacility did not return an array:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching all roles of facility:', error);
    throw error;
  }
};

// Interface for all privileges of role in org payload
interface GetAllPrivsOfRoleInOrgPayload {
  userName: string;
  userPass: string;
  deviceStat: string;
  callingFrom: string;
  orgId: string;
  facilityId: string;
  roleIds: string; // Comma-separated role IDs like "1,4,5"
}

// Interface for all privileges of role in org response (same structure as UserFacilityPrivilegeMapping)
export interface RolePrivilege {
  id: number;
  privilegeId: number;
  parentId: number;
  facilityId: number;
  menuName: string;
  displayName: string | null;
  menuAction: string | null;
  facilityName: string | null;
}

// Get all privileges of role in org
export const getAllPrivsOfRoleInOrg = async (facilityId: string, roleIds: number[]): Promise<RolePrivilege[]> => {
  const payload: GetAllPrivsOfRoleInOrgPayload = {
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    deviceStat: 'M',
    callingFrom: 'web',
    orgId: localStorage.getItem('orgId') || '',
    facilityId,
    roleIds: roleIds.join(','), // Convert array to comma-separated string
  };

  try {
    const response = await http.post<RolePrivilege[]>('/getallprivsofroleinorg', payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching all privileges of role in org:', error);
    throw error;
  }
};

// Interface for save user privileges payload
interface SaveUserPrivilegesPayload {
  callingFrom: string;
  callMode: string; // 'add' or 'edit'
  userName: string;
  userPass: string;
  orgId: string;
  loggedInFacilityId: string;
  orgUserId: string;
  facilityIds: string; // Comma-separated facility IDs
  facilityRoleIds: string; // Comma-separated format: "facilityId_roleId"
  facilityPrivIds: string; // Comma-separated format: "facilityId_privilegeId"
}

// Interface for save user privileges response
export interface SaveUserPrivilegesResponse {
  message: string;
  status?: string;
}

// Save user privileges
export const saveUserPrivileges = async (
  orgUserId: string,
  facilityIds: number[],
  facilityRoleIds: Array<{ facilityId: number; roleId: number }>,
  facilityPrivIds: Array<{ facilityId: number; privilegeId: number }>,
  callMode: 'add' | 'edit' = 'edit'
): Promise<SaveUserPrivilegesResponse> => {
  const payload: SaveUserPrivilegesPayload = {
    callingFrom: 'web',
    callMode,
    userName: localStorage.getItem('userName') || '',
    userPass: localStorage.getItem('userPwd') || '',
    orgId: localStorage.getItem('orgId') || '',
    loggedInFacilityId: localStorage.getItem('loggedinFacilityId') || '1',
    orgUserId,
    facilityIds: facilityIds.join(','),
    facilityRoleIds: facilityRoleIds.map(fr => `${fr.facilityId}_${fr.roleId}`).join(','),
    facilityPrivIds: facilityPrivIds.map(fp => `${fp.facilityId}_${fp.privilegeId}`).join(','),
  };

  try {
    const response = await http.post<SaveUserPrivilegesResponse>('/saveuserprivileges', payload);
    return response.data;
  } catch (error) {
    console.error('Error saving user privileges:', error);
    throw error;
  }
};