export interface GetOrgRolesPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
  loggedInFacilityId: string;
  facilityId?: string;
  status?: string;
  roleGrpId?: string;
  searchRole?: string;
}

export interface GetOrgRolesResponse {
  roleName: string;
  orgRoleGroup: string;
  orgRoleId: number;
  activeInd: number;
}

export interface GetAllRoleGroupOfOrgPayload {
  callingFrom: string;
  userName: string;
  userPass: string;
  orgId: string;
}

export interface GetAllRoleGroupOfOrgResponse {
  roleGroupName: string;
  roleGroupId: number;
}