import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Designation, Manager, Project, Resource, Skills, Location } from '../interfaces';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../Services/http-client.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '@progress/kendo-angular-notification';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, NgSelectModule],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AddEditComponent {

  selectedEmpIds: string[] = [];
  isBulkEdit: boolean = false;

  // myForm: FormGroup = new FormGroup({
  //   employee_Name: new FormControl('', [Validators.required]),
  //   designation_Name: new FormControl('', [Validators.required]),
  //   reportingToName: new FormControl('', [Validators.required]),
  //   billable: new FormControl('', [Validators.required]),
  //   skills: new FormControl([], [Validators.required]),
  //   projects: new FormControl([], [Validators.required]),
  //   location_Name: new FormControl('', [Validators.required]),
  //   emailId: new FormControl('', [Validators.required, Validators.email]),
  //   ctE_DOJ: new FormControl('', [Validators.required]),
  //   remarks: new FormControl('')

  // })

  myForm: FormGroup = new FormGroup({
    employee_Name: new FormControl('', [Validators.required]),
    designationId: new FormControl<number | null>(null, [Validators.required]),
    managerId: new FormControl<number | null>(null, [Validators.required]),
    billable: new FormControl('', [Validators.required]),
    skillsIds: new FormControl<number[]>([], [Validators.required]),
    projectsIds: new FormControl<number[]>([], [Validators.required]),
    locationId: new FormControl<number | null>(null, [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    ctE_DOJ: new FormControl('', [Validators.required]),
    remarks: new FormControl('')
  })

  constructor(private httpclientService: HttpClientService, private router: Router, private activatedroute: ActivatedRoute, private notificationService: NotificationService) { }

  empId?: string;
  empDetails!: Resource;
  selectedFields: { [key: string]: boolean } = {};

  designations: Designation[] = [];
  locations: Location[] = [];
  skills_array: Skills[] = [];
  projects_array: Project[] = [];
  ManagerList: Manager[] = [];




  // ngOnInit() {
  //   this.empId = this.activatedroute.snapshot.paramMap.get('empId')!;
  //   console.log(this.empId);
  //   if (this.empId) {
  //     this.httpclientService.getEmployeeDetailsById(this.empId).subscribe((response) => {

  //       console.log(response)
  //       this.myForm.patchValue(response)
  //     })
  //   }
  // }

  ngOnInit() {
    const ids = this.activatedroute.snapshot.queryParamMap.get('ids');
    if (ids) {
      this.selectedEmpIds = ids.split(',');
      this.isBulkEdit = true;
    } else {
      this.empId = this.activatedroute.snapshot.paramMap.get('empId')!;
      if (this.empId) {
        this.httpclientService.getEmployeeById(this.empId).subscribe((response: any) => {
          console.log(response);
          response.skillsIds = response.skillIds;
          response.projectsIds = response.projectIds;
          this.myForm.patchValue(response);
        });
      }
    }


    this.httpclientService.getDesignations().subscribe(data => {
      this.designations = data;
    });

    this.httpclientService.getLocations().subscribe(data => {
      this.locations = data;
    });

    this.httpclientService.getSkills().subscribe({
      next: (data) => {
        this.skills_array = data;
      },
      error: (err) => {
        console.error("Error loading skills:", err);
      }

    });

    this.httpclientService.getProjects().subscribe(data => {
      this.projects_array = data;
    });

    this.httpclientService.getReportingTo().subscribe(data => {
      this.ManagerList = data;
    });
  }





  // onSubmit() {
  //   if (this.empId) {
  //     this.httpclientService.updateEmployeeDetails(this.empId, this.myForm.value).subscribe({
  //       next: () => {
  //         this.notificationService.show({
  //           content: 'Employee updated successfully!',
  //           cssClass: 'button-notification',
  //           animation: { type: 'fade', duration: 200 },
  //           position: { horizontal: 'right', vertical: 'top' },
  //           type: { style: 'success', icon: true },
  //           hideAfter: 2000
  //         });
  //         this.router.navigate(['/Home'])
  //         this.myForm.reset();
  //       },
  //       error: (err) => {
  //         console.error("Error while adding Resource!", err);
  //         this.notificationService.show({
  //           content: 'Error while updating employee!',
  //           cssClass: 'button-notification',
  //           animation: { type: 'fade', duration: 200 },
  //           position: { horizontal: 'right', vertical: 'top' },
  //           type: { style: 'error', icon: true },
  //           hideAfter: 2000
  //         });
  //       }
  //     })
  //   }
  //   else {
  //     this.httpclientService.addEmployeeeDetails(this.myForm.value).subscribe({
  //       next: () => {
  //         this.notificationService.show({
  //           content: 'New employee added successfully!',
  //           cssClass: 'button-notification',
  //           animation: { type: 'fade', duration: 200 },
  //           position: { horizontal: 'right', vertical: 'top' },
  //           type: { style: 'success', icon: true },
  //           hideAfter: 2000
  //         });
  //         this.router.navigate(['/Home'])
  //         this.myForm.reset();
  //       },
  //       error: (err) => {
  //         console.log("Errow while adding new employee", err)
  //         this.notificationService.show({
  //           content: 'Error while adding new employee!',
  //           cssClass: 'button-notification',
  //           animation: { type: 'fade', duration: 200 },
  //           position: { horizontal: 'right', vertical: 'top' },
  //           type: { style: 'error', icon: true },
  //           hideAfter: 2000
  //         });
  //       }
  //     })
  //   }
  // }

  onSubmit() {
    // const formData = { ...this.myForm.value };
    const formData: any = {
      employee_Name: this.myForm.value.employee_Name,
      designationId: this.myForm.value.designationId,
      locationId: this.myForm.value.locationId,
      emailId: this.myForm.value.emailId,
      ctE_DOJ: this.myForm.value.ctE_DOJ,
      remarks: this.myForm.value.remarks,
      managerId: this.myForm.value.managerId,
      billable: this.myForm.value.billable,
      skillIds: this.myForm.value.skillsIds,
      projectIds: this.myForm.value.projectsIds
    };

    console.log(formData);

    // Extract only selected fields
    const updatedFields: any = {};
    Object.keys(this.selectedFields).forEach(field => {
      if (this.selectedFields[field]) {
        updatedFields[field] = formData[field];
      }
    });

    const payload = this.selectedEmpIds.map(empId => ({
      empId,
      ...updatedFields
    }));

    if (this.isBulkEdit && this.selectedEmpIds.length > 0) {
      // Bulk update API call
      this.httpclientService.bulkUpdateEmployeeDetails(payload).subscribe({
        next: () => {
          this.notificationService.show({
            content: 'Employees updated successfully!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'success', icon: true },
            hideAfter: 2000
          });
          this.router.navigate(['/Home']);
        },
        error: (err) => {
          console.error("Error during bulk update!", err);
          this.notificationService.show({
            content: 'Error while updating employees!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'error', icon: true },
            hideAfter: 2000
          });
        }
      });

    } else if (this.empId) {
      // Existing single update
      this.httpclientService.updateEmployeeDetails(this.empId, formData).subscribe({
        next: () => {
          this.notificationService.show({
            content: 'Employee updated successfully!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'success', icon: true },
            hideAfter: 2000
          });
          this.router.navigate(['/Home'])
          this.myForm.reset();
        },
        error: (err) => {
          console.error("Error while adding Resource!", err);
          this.notificationService.show({
            content: 'Error while updating employee!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'error', icon: true },
            hideAfter: 2000
          });
        }
      });
    } else {
      // New employee addition
      // formData.skills = formData.skills.join(',');
      this.httpclientService.addEmployeeeDetails(formData).subscribe({
        next: () => {
          this.notificationService.show({
            content: 'New employee added successfully!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'success', icon: true },
            hideAfter: 2000
          });
          this.router.navigate(['/Home'])
          this.myForm.reset();
        },
        error: (err) => {
          console.log("Errow while adding new employee", err)
          this.notificationService.show({
            content: 'Error while adding new employee!',
            cssClass: 'button-notification',
            animation: { type: 'fade', duration: 200 },
            position: { horizontal: 'right', vertical: 'top' },
            type: { style: 'error', icon: true },
            hideAfter: 2000
          });
        }
      });
    }
  }
}
