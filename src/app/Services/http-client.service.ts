import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Designation, Manager, Project, Resource, Skills, Location } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private ServerURI = environment.apiBaseUrl

  constructor(private httpclient: HttpClient) { }

  getEmployeeDetailsById(id: string): Observable<Resource> {
    const endpoint = this.ServerURI + "/details/" + id.toString();
    return this.httpclient.get<Resource>(endpoint);
  }

  getEmployeeById(id: string) {
    const endpoint = this.ServerURI + "/" + id.toString();
    return this.httpclient.get(endpoint);
  }

  getAllEmployees() {
    const endpoint = this.ServerURI;
    return this.httpclient.get(endpoint)
  }

  getAllEmployeesDownload() {
    const endpoint = this.ServerURI + "download-csv";
    return this.httpclient.get(endpoint);
  }

  addEmployeeeDetails(data: any) {
    const endpoint = this.ServerURI;
    console.log("Data:", data);
    return this.httpclient.post(endpoint, data)
  }

  updateEmployeeDetails(id: string, data: any) {
    const endpoint = this.ServerURI + '/' + id.toString();
    const payload = { empId: id, ...data }
    return this.httpclient.put(endpoint, payload)
  }

  bulkUpdateEmployeeDetails(payload: any) {
    const endpoint = `${this.ServerURI}/bulk-update`;
    return this.httpclient.put(endpoint, payload);
  }

  deleteEmployeeDetails(id: string) {
    const endpoint = this.ServerURI + '/' + id.toString();
    return this.httpclient.delete(endpoint)
  }

  bulkImportResources(resources: any[]) {
    const endpoint = this.ServerURI + '/import';
    return this.httpclient.post(endpoint, resources);
  }

  getDesignations(): Observable<Designation[]> {
    return this.httpclient.get<Designation[]>(this.ServerURI + '/designations');
  }

  getLocations(): Observable<Location[]> {
    return this.httpclient.get<Location[]>(this.ServerURI + '/locations');
  }

  getSkills(): Observable<Skills[]> {
    return this.httpclient.get<Skills[]>(this.ServerURI + '/skills');
  }

  getProjects(): Observable<Project[]> {
    return this.httpclient.get<Project[]>(this.ServerURI + '/projects');
  }

  getReportingTo(): Observable<Manager[]> {
    return this.httpclient.get<Manager[]>(this.ServerURI + '/managers');
  }
}
