import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from '../pages/home/home.component';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { DetailsComponent } from '../details/details.component';
import { HttpClientService } from '../Services/http-client.service';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { Resource } from '../interfaces';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from '@progress/kendo-angular-notification';
import { EmployeeDataService } from '../Services/employee-data.service';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-maincomp',
  standalone: true,
  imports: [KENDO_BUTTON, RouterOutlet, MatIconModule,CommonModule],
  templateUrl: './maincomp.component.html',
  styleUrl: './maincomp.component.scss'
})
export class MaincompComponent {

  isAdmin: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;
  isHR: boolean = false;

  resourcesArray: Array<Resource> = [];
  constructor(private httpClientService: HttpClientService, private router: Router, private cdr: ChangeDetectorRef, private notificationService: NotificationService, private employeeDataService: EmployeeDataService, private authService: AuthService) { }
  NavigateTab(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.loadEmployees();

    const role = this.authService.getUserRole();
    this.isAdmin = (role === 'Admin');
    this.isManager = (role === 'Manager');
    this.isUser = (role === 'User');  
    this.isHR = (role === 'HR');  
  }

   onLogout() {
    this.authService.logout();
  }

  loadEmployees() {
    this.httpClientService.getAllEmployees().subscribe((response) => {
      this.resourcesArray = [...(response as Resource[])];
      console.log(this.resourcesArray)
      this.cdr.detectChanges();
    })
  };


  onExcelUpload(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      alert('Please upload a single Excel file.');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = <any[]>XLSX.utils.sheet_to_json(ws);
      console.log('Parsed Data:', data);

      this.bulkUploadResources(data);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  bulkUploadResources(resourceArray: any[]): void {
    this.httpClientService.bulkImportResources(resourceArray).subscribe({
      next: (res) => {
        this.notificationService.show({
        content: 'Employees data imported successfully',
        cssClass: 'button-notification',
        animation: { type: 'fade', duration: 200 },
        position: { horizontal: 'right', vertical: 'top' },
        type: { style: 'success', icon: true },
        hideAfter: 2000
      });
        console.log('Bulk import successful', res);
        // this.loadEmployees();
        this.employeeDataService.triggerRefresh(); 
      },
      error: (err) => {
         this.notificationService.show({
        content: 'Failed to import employees data',
        cssClass: 'button-notification',
        animation: { type: 'fade', duration: 200 },
        position: { horizontal: 'right', vertical: 'top' },
        type: { style: 'error', icon: true },
        hideAfter: 2000
      });
        console.error('Bulk import failed', err);
      }
    });
  }

  parseDate(value: any): Date | null {
    // Handle both Excel and ISO dates
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  fetchEmployeeData(): void {
    this.httpClientService.getAllEmployees().subscribe({
      next: (data) => {
        this.resourcesArray = (data as Resource[]);
        // optionally trigger change detection if grid doesn't auto-update
      },
      error: (err) => console.error('Failed to load employees', err)
    });
  }

  exportEmployeesToCSV() {
    this.httpClientService.getEmployeesForExport().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'EmployeeExport.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error('Export failed:', err);
        alert('Failed to export employee data.');
      }
    });
  }


}









