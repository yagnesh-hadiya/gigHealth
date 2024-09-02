export interface RoleType {
  Id: number;
  Role: string;
  Description: string;
  IsRoleNameEditable: boolean;
  IsRoleDeletable: boolean;
  IsPermissionsEditable: boolean;
}
export interface Module {
  Module: string;
  SubModules: SubModule[];
  // isOpen: boolean;
}
export interface SubModule {
  SubModule: string;
}
export interface Allow {
  module: string;
  permissions: string[];
  submodules?: Allow[];
}

export interface CreateRoleParams {
  title: string;
  description: string;
  allows: Allow[];
}
