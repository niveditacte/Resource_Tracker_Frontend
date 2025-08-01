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

@Component({
  selector: 'app-maincomp',
  standalone: true,
  imports: [KENDO_BUTTON, RouterOutlet, MatIconModule],
  templateUrl: './maincomp.component.html',
  styleUrl: './maincomp.component.scss'
})
export class MaincompComponent {
  resourcesArray: Array<Resource> = [];
  constructor(private httpClientService: HttpClientService, private router: Router) { }
  NavigateTab(route: string) {
    this.router.navigate([route]);
  }

  ngOnInit() {
    this.httpClientService.getAllEmployees().subscribe((response) => {
      this.resourcesArray = (response as Array<Resource>)
      console.log(this.resourcesArray)
    })
  }

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
    debugger
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      alert('Please upload a single Excel file.');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const binaryData = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      const resources: any[] = jsonData.map((row: any) => ({
        empId: String(row.empId ?? ''),
        resource_Name: row.resource_Name,
        designation: row.designation,
        reportingTo: row.reportingTo,
        billable: row.billable,
        technology_Skill: row.technology_Skill,
        project_Allocate: row.project_Allocate,
        location: row.location,
        emailId: row.emailId,
        ctE_DOJ: this.parseDate(row.ctE_DOJ),
        remarks: row.remarks,
        exportedAt: this.parseDate(row.exportedAt)
      }));

      // Send parsed data to API
      debugger
      this.httpClientService.importParsedResources(resources).subscribe({
        next: (res) => {
          alert('Data imported successfully!');
          this.fetchEmployeeData();
        },
        error: (err) => {
          console.error('Import failed', err);
          let errorMsg = 'Unknown error occurred';
          if (err?.error?.message) {
            errorMsg = err.error.message;
          } else if (typeof err?.error === 'string') {
            errorMsg = err.error;
          } else if (err?.message) {
            errorMsg = err.message;
          }
          debugger

          alert('Import failed: ' + errorMsg);
        }
      });
    };

    reader.readAsBinaryString(target.files[0]);
  }

  parseDate(value: any): Date | null {
    // Handle both Excel and ISO dates
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed ;
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









