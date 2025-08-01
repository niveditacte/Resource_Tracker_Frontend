import { Component } from '@angular/core';
import { Designation, Manager, Project, Resource } from '../interfaces';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../Services/http-client.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { NotificationService } from '@progress/kendo-angular-notification';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_GRID, KENDO_BUTTONS, HttpClientModule, CommonModule, DialogModule, MatIconModule, NotificationModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent {
  designations: Designation[] = [];
  locations: Location[] = [];
  projects: Project[] = [];
  reportingTo: Manager[] = [];

  selectedEmpIds: string[] = [];
  showBulkEditDialog: boolean = false;
  empIdToDelete!: string;
  showDialog = false;

  showConfirmationDialog: boolean = false;
  confirmationData: {
    empIds: string[];
    updatedFields: { [key: string]: any };
  } = { empIds: [], updatedFields: {} };


  constructor(private httpClientService: HttpClientService, private router: Router, private notificationService: NotificationService) { };
  resourcesArray: Array<Resource> = [];

  ngOnInit() {
    this.httpClientService.getAllEmployees().subscribe((response) => {
      this.resourcesArray = (response as Array<Resource>)
      console.log(this.resourcesArray)
    })

    this.httpClientService.getDesignations().subscribe({
      next: (data) => {
        this.designations = data;
        console.log("designation", this.designations);
      },
      error: (err) => {
        console.error("Error in fetching designation", err);
      }
    });
    // this.httpClientService.getLocations().subscribe(data => this.locations = data);
    this.httpClientService.getProjects().subscribe(data => this.projects = data);
    this.httpClientService.getReportingTo().subscribe(data => this.reportingTo = data);
  }
  onEdit(empId: any) {
    // debugger
    this.router.navigate([`/Add-Edit/${empId}`]);
  }

  onShowClick(empId: any) {
    this.router.navigate([`/Details/${empId}`]);
  }
  openDeleteDialog(empId: string) {
    this.empIdToDelete = empId;
    this.showDialog = true;
  }
  onDelete(empId: any) {
    this.httpClientService.deleteEmployeeDetails(empId).subscribe({
      next: () => {
        this.notificationService.show({
          content: 'Employee deleted successfully',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'right', vertical: 'top' },
          type: { style: 'success', icon: true },
          // closable: true,
          hideAfter: 2000
        });
        this.showDialog = false;
        this.resourcesArray = this.resourcesArray.filter((d) => d.empId != empId)
      },
      error: (err) => {
        this.notificationService.show({
          content: 'Failed to delete employee',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'right', vertical: 'top' },
          type: { style: 'error', icon: true },
          // closable: true,
          hideAfter: 2000
        });
        this.showDialog = false;
        console.error(err);
      }
    });
  }
  cancelDelete() {
    this.showDialog = false;
  }

  loadAllResources() {
    this.httpClientService.getAllEmployees().subscribe({
      next: (data) => {
        this.resourcesArray = data as Resource[];  // replace with your actual variable
      },
      error: (err) => {
        console.error('Failed to load resources', err);
      }
    });
  }


  editableFields = [
    { key: 'designationId', label: 'Designation', selected: false, value: '', dataLabel: 'designation_Name' },
    { key: 'managerId', label: 'Reporting To', selected: false, value: '', dataLabel: 'manager_Name' },
    { key: 'billable', label: 'Billable', selected: false, value: '', dataLabel: '' },
    { key: 'projectIds', label: 'Project Allocation', selected: false, value: [], dataLabel: 'project_Name' },
    { key: 'locationId', label: 'Location', selected: false, value: '', dataLabel: 'location_Name' },
  ];


  submitBulkUpdate() {
    console.log("Inside Submit Bulk Update Button");
    const updatedFields = this.editableFields
      .filter(f => f.selected)
      .reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {} as any);

    this.confirmationData = {
      empIds: this.selectedEmpIds,
      updatedFields: updatedFields
    };
    this.showConfirmationDialog = true;
  }

  objectKeys = Object.keys;

  cancelConfirmation() {
    this.showConfirmationDialog = false;
  }

  confirmBulkUpdate() {
    console.log("ConfirmationData", this.confirmationData);
    const payload = {
      empIds: this.confirmationData.empIds,
      ...this.confirmationData.updatedFields
    };

    this.httpClientService.bulkUpdateEmployeeDetails(payload).subscribe({
      next: () => {
        this.notificationService.show({
          content: 'Bulk updated successfully',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'right', vertical: 'top' },
          type: { style: 'success', icon: true },
          hideAfter: 2000
        });
        this.showConfirmationDialog = false;
        this.showBulkEditDialog = false;
        this.loadAllResources(); // or your refresh function
        this.resetEditableFields();
        this.selectedEmpIds = [];

      },
      error: err => {
        this.notificationService.show({
          content: 'Bulk update failed',
          cssClass: 'button-notification',
          animation: { type: 'fade', duration: 200 },
          position: { horizontal: 'right', vertical: 'top' },
          type: { style: 'error', icon: true },
          hideAfter: 2000
        });
        console.error('Bulk update failed', err);
        this.showConfirmationDialog = false;
      }
    });
  }

  resetEditableFields() {
    this.editableFields = this.editableFields.map(field => ({
      ...field,
      selected: false,
      value: ''
    }));
  }

  getFieldLabel(key: string): string {
    const fieldLabels: { [key: string]: string } = {
      designation: 'Designation',
      reportingTo: 'Reporting To',
      billable: 'Billable',
      project_Allocate: 'Project Allocation',
      location: 'Location'
    };
    return fieldLabels[key] || key;
  }

  isDropdown(fieldKey: string): boolean {
    return ['designationId', 'managerId', 'projectIds', 'locationId'].includes(fieldKey);
  }

  getOptions(fieldKey: string): any[] {
    switch (fieldKey) {
      case 'designationId':
        return this.designations;
      case 'managerId':
        return this.reportingTo;
      case 'projectIds':
        return this.projects;
      case 'locationId':
        return this.locations;
      default:
        return [];
    }
  }


}









