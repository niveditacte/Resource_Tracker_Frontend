import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Resource } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private ServerURI = environment.apiBaseUrl

  constructor(private httpclient:HttpClient) { }

  getEmployeeDetailsById(empId:string): Observable<Resource>{
    const endpoint = this.ServerURI+empId.toString();
    return this.httpclient.get<Resource>(endpoint);
  }

  getAllEmployees(){
    const endpoint = this.ServerURI;
    return this.httpclient.get(endpoint)
  }

  getAllEmployeesDownload() {
    const endpoint = this.ServerURI + "download-csv"; 
    return this.httpclient.get(endpoint);
  }

  addEmployeeeDetails(data:any){
    const endpoint = this.ServerURI ;
    console.log("Data:", data);
    return this.httpclient.post(endpoint,data)
  }

  updateEmployeeDetails(empId:string,data:any){
    const endpoint = this.ServerURI ;
    const payload = {empId, ...data}
    return this.httpclient.put(endpoint,payload)
  }

  bulkUpdateEmployeeDetails(payload:any[]) {
  const endpoint = `${this.ServerURI}bulk`;
  return this.httpclient.put(endpoint, payload);
  }

  deleteEmployeeDetails(empId:string){
    const endpoint = this.ServerURI + empId.toString();
    return this.httpclient.delete(endpoint)
  }

  importParsedResources(resources: Resource[]) {
    debugger
    const endpoint = this.ServerURI + 'import';
    return this.httpclient.post(endpoint, resources);
  }

  getDesignations(): Observable<string[]> {
    return this.httpclient.get<string[]>(this.ServerURI + 'designations');
  }

  getLocations(): Observable<string[]> {
    return this.httpclient.get<string[]>(this.ServerURI + 'locations');
  }

  getSkills(): Observable<string[]> {
    return this.httpclient.get<string[]>(this.ServerURI + 'skills');
  }

  getProjects(): Observable<string[]> {
    return this.httpclient.get<string[]>(this.ServerURI + 'projects');
  }

  getReportingTo(): Observable<string[]> {
    return this.httpclient.get<string[]>(this.ServerURI + 'reportingto');
  }
}
