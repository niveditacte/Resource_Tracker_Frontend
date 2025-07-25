import { Component } from '@angular/core';
import { Resource } from '../interfaces';
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
  }
  onEdit(empId: any) {
    debugger
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
    { key: 'designation', label: 'Designation', selected: false, value: '' },
    { key: 'reportingTo', label: 'Reporting To', selected: false, value: '' },
    { key: 'billable', label: 'Billable', selected: false, value: '' },
    { key: 'project_Allocate', label: 'Project Allocation', selected: false, value: '' },
    { key: 'location', label: 'Location', selected: false, value: '' },
  ];

  // editSelected(){
  //   if(this.selectedEmpIds.length >0){
  //     const empIdsParam = this.selectedEmpIds.join(',');
  //     this.router.navigate(['/Add-Edit'], {queryParams:{empIds:empIdsParam}})
  //   }
  // }

  submitBulkUpdate() {
    // const updatedFields: any = {};
    debugger
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

    // this.editableFields.forEach(field => {
    //   if (field.selected) {
    //     updatedFields[field.key] = field.value;
    //   }
    // });

    const payload = this.selectedEmpIds.map(empId => ({
      EmpId: empId,
      ...updatedFields
    }));
    console.log('Payload being sent:', payload);
    this.httpClientService.bulkUpdateEmployeeDetails(payload).subscribe({
      next: () => {
        this.showBulkEditDialog = false;

        // Refresh data
        this.loadAllResources(); // if you have a method for this
      },
      error: err => {
        console.error('Bulk update failed', err);
      }
    });
  }

  objectKeys = Object.keys;

  cancelConfirmation() {
    this.showConfirmationDialog = false;
  }

  confirmBulkUpdate() {
    const payload = this.confirmationData.empIds.map(empId => ({
      EmpId: empId,
      ...this.confirmationData.updatedFields
    }));

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



}









