export interface CreateRoleAddProps {
  roleGroupOptions: any[];
  onAddSuccess: (arg:string) => void | Promise<void>;
  onCancel?: ()=> void
}

export interface CreateRoleEditProps {
  role: { roleName: string; roleGroupName: string; status: string; orgRoleId: string };
  roleGroupOptions: any[];
  onAddSuccess: (arg:string) => void | Promise<void>;
  onCancel?: ()=> void
}

export interface CreateRoleAssignProps {
  role: { roleName: string; roleGroupName: string; status: string; facilities: string[] };
  onSubmit: (data: { roleName: string; roleGroupName: string; facilities: string[] }) => void;
  onCancel: () => void;
  onFacilitiesChange: (facilities: string[]) => void;
}