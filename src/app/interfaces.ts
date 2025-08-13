export interface Resource {

  empId: number,
  employee_Name: string,
  designation_Name: string,
  reportingToName: string,
  billable: string,
  skills: string,
  projects: string,
  location_Name: string,
  emailId: string,
  ctE_DOJ: Date,
  remarks: string,
  exportedAt: Date

}

export interface Designation {
  designationId: number;
  designation_Name: string;
}

export interface Manager {
  managerId: number;
  manager_Name: string;
}

export interface Skills {
  skillId: number;
  skill_Name: string;
}

export interface Project {
    projectId: number;
    project_Name: string;
}

export interface Location {
    locationId: number;
    location_Name: string;
}

export interface Role {
    roleId: number;
    role: string;
}