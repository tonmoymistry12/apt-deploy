import http from '@/common/http';

interface LoginCredentials {
  userName: string;
  userPwd: string;
  orgId: number;
  orgFacilityId: number;
}

interface LoginResponse {
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
  userLoggedInAs: string;
  orgId: number;
  orgUserId: number;
  clinicType: string;
  loggedinFacilityId: number;
  messages: string;
  facilities: Array<{
    facilityId: number;
    facilityName: string;
    activeInd: number;
  }>;
  lstPrivilegeLevel1: Array<{
    id: number;
    parentId: number;
    menuName: string;
    displayName: string;
    menuAction: string;
  }>;
  lstPrivilegeLevel2: Array<{
    id: number;
    parentId: number;
    menuName: string;
    displayName: string;
    menuAction: string;
  }>;
  lstPrivilegeLevel3: Array<{
    id: number;
    parentId: number;
    menuName: string;
    displayName: string;
    menuAction: string;
  }>;
  lstPrivilegeLevel4: Array<any>;
  activeInd: number;
  isExpired: number;
  loginAllowed: number;
}

interface Organization {
  orgName: string;
  orgLogoFile: string | null;
  regValidUpto: string | null;
  validityMessage: string | null;
  userLoggedInAs: string | null;
  clinicType: string | null;
  transactionId: string | null;
  subscriptionType: string | null;
  dashboardValidityMessage: string | null;
  phoneNumber: string | null;
  userName: string | null;
  orgId: number;
  activeInd: number;
  noOfDaysLeftActive: number;
  noOfDaysExpired: number;
  validityDays: number;
  daysExpired: number;
}

interface OrganizationRequest {
  userName: string;
}

interface FacilityRequest {
  userName: string;
  orgId: string;
}

interface Facility {
  patientsToView: number;
  internBilling: number;
  activeInd: number;
  facilityId: number;
  orgId: number;
  cityPincodeMappingId: number;
  cityId: number;
  fees: number;
  facilityName: string;
  contactPersonName: string | null;
  address1: string | null;
  address2: string | null;
  searcharea: string | null;
  pin: string | null;
  state: string | null;
  country: string | null;
  firstContactNo: string | null;
  firstContactEmail: string | null;
  secondContactNo: string | null;
  secondContactEmail: string | null;
  city: string | null;
  userName: string | null;
  userPass: string | null;
  deviceStat: string | null;
  mode: string | null;
  orgName: string | null;
  areaName: string | null;
  toDayDate: string | null;
  searchFacility: string | null;
  status: string | null;
  facilityType: string | null;
  callingFrom: string | null;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const { data } = await http.post<any>('/validateUser', credentials);
    
    // Save orgId to localStorage on successful login
    if (data && data.orgId) {
      localStorage.setItem('orgId', data.orgId.toString());
      localStorage.setItem('orgUserId', data.orgUserId.toString());
      localStorage.setItem('clinicType', data.clinicType.toString());
    }
    
    // Save username and password to localStorage on successful login
    if (data && credentials.userName && credentials.userPwd) {
      localStorage.setItem('userName', credentials.userName);
      localStorage.setItem('userPwd', credentials.userPwd);
      localStorage.setItem('firstName', data?.firstName);
      localStorage.setItem('lastName', data?.lastName);
      localStorage.setItem('clinicName', data?.clinicName)
      localStorage.setItem('loggedinFacilityId', data.loggedinFacilityId.toString())
      localStorage.setItem('doctorUid', data?.doctorMasterId.toString())
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const saveBooking = async (bookingData: any) => {
  try {
    const { data } = await http.post('/api/bookings', bookingData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getOrganizationList = async (userName: string): Promise<Organization[]> => {
  try {
    const { data } = await http.post<Organization[]>('/getOrganizationList', { userName });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getLocationsDropdown = async (userName: string, orgId: string): Promise<Facility[]> => {
  try {
    const { data } = await http.post<Facility[]>('/getLocationsDropdown', { userName, orgId });
    return data;
  } catch (error) {
    throw error;
  }
}; 