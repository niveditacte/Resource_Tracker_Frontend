import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from '../home/home.component';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { DetailsComponent } from '../details/details.component';
import { HttpClientService } from '../Services/http-client.service';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { Resource } from '../interfaces';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-maincomp',
  standalone: true,
  imports: [KENDO_BUTTON, RouterOutlet, MatIconModule],
  templateUrl: './maincomp.component.html',
  styleUrl: './maincomp.component.scss'
})
export class MaincompComponent {
  resourcesArray: Array<Resource> = [];
  constructor(private httpClientService: HttpClientService, private router: Router, private cdr: ChangeDetectorRef) { }
  NavigateTab(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.httpClientService.getAllEmployees().subscribe((response) => {
      this.resourcesArray = [...(response as Resource[])];
      console.log(this.resourcesArray)
      this.cdr.detectChanges();
    })
  };

  exportToCSV() {

    this.httpClientService.getAllEmployeesDownload().subscribe(response => {
      const data = response as Resource[];
      if (!data || data.length === 0) {
        alert("No data to export.");
        return;
      }

      const csvRows: string[] = [];
      const headers = [
        'Employee ID',
        'Name',
        'Designation',
        'Reporting To',
        'Billable',
        'Tech Skill',
        'Project Allocation',
        'Location',
        'Email ID',
        'CTE DOJ',
        'Remarks',
        'Exported At'
      ];

      csvRows.push(headers.join(','));

      data.forEach(item => {
        const row = [
          `E${item.empId.toString().padStart(4, '0')}`,
          item.employee_Name,
          item.designation_Name,
          item.reportingToName,
          item.billable,
          item.skills,
          item.projects,
          item.location_Name,
          item.emailId,
          item.ctE_DOJ,
          item.remarks,
          item.exportedAt ? new Date(item.exportedAt).toISOString().slice(0, 19).replace('T', ' ') : ''

        ].map(field => `"${(field ?? '').toString().replace(/"/g, '""')}"`); // Escape quotes
        csvRows.push(row.join(','));
      });
      // console.log('Exporting:', this.resourcesArray);

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ResourceDetails.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    // this.httpClientService.getAllEmployeesDownload().subscribe({
    //   next: (response: Blob) => {
    //     const url = window.URL.createObjectURL(response);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'ResourceDetails.csv');
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //   },
    //   error: (err) => {
    //     alert("Failed to download CSV.");
    //     console.error(err);
    //   }
    // });
  }

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
        console.log('Bulk import successful', res);
        this.loadEmployees();
      },
      error: (err) => {
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

}









