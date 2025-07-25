import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Resource } from '../interfaces';
import { CommonModule } from '@angular/common';
import { HttpClientService } from '../Services/http-client.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '@progress/kendo-angular-notification';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, MatChipsModule, MatAutocompleteModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.scss'
})
export class AddEditComponent {

  selectedEmpIds: string[] = [];
  isBulkEdit: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectable = true;
  removable = true;
  filteredSkills!: Observable<string[]>;
  // allSkills: string[] = [];  // filled via API
  selectedSkills: string[] = [];
  skillCtrl = new FormControl('');

  myForm: FormGroup = new FormGroup({
    resource_Name: new FormControl('', [Validators.required]),
    designation: new FormControl('', [Validators.required]),
    reportingTo: new FormControl('', [Validators.required]),
    billable: new FormControl('', [Validators.required]),
    technology_Skill: new FormControl([], Validators.required),
    project_Allocate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    ctE_DOJ: new FormControl('', [Validators.required]),
    remarks: new FormControl('')

  })
  constructor(private httpclientService: HttpClientService, private router: Router, private activatedroute: ActivatedRoute, private notificationService: NotificationService) { }

  empId?: string;
  empDetails!: Resource;
  selectedFields: { [key: string]: boolean } = {};

  designations: string[] = [];
  locations: string[] = [];
  skills: string[] = [];
  projects: string[] = [];
  reportingToList: string[] = [];




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
        this.httpclientService.getEmployeeDetailsById(this.empId).subscribe((response) => {
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

    this.httpclientService.getSkills().subscribe(data => {
      this.skills = data;
      this.filteredSkills = this.skillCtrl.valueChanges.pipe(
        startWith(null),
        map((skill: string | null) => skill ? this._filter(skill) : this.skills.slice())
      );
    });
    if (this.empId) {
      this.httpclientService.getEmployeeDetailsById(this.empId).subscribe((response) => {
        this.myForm.patchValue(response);
        this.selectedSkills = response.technology_Skill?.split(',') || [];
        this.myForm.get('technology_Skill')?.setValue(this.selectedSkills);
      });
    }

    this.httpclientService.getProjects().subscribe(data => {
      this.projects = data;
    });

    this.httpclientService.getReportingTo().subscribe(data => {
      this.reportingToList = data;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.skills.filter((skill) =>
      skill.toLowerCase().includes(filterValue) &&
      !this.selectedSkills.includes(skill));
  }

  addSkillFromInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.selectedSkills.includes(value)) {
      this.selectedSkills.push(value);
      this.updateSkillFormValue();
    }
    event.chipInput!.clear();
    this.skillCtrl.setValue(null);
  }

  removeSkill(skill: string): void {
    const index = this.selectedSkills.indexOf(skill);
    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
      this.updateSkillFormValue();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if (!this.selectedSkills.includes(value)) {
      this.selectedSkills.push(value);
      this.updateSkillFormValue();
    }
    this.skillCtrl.setValue(null);
  }

  updateSkillFormValue(): void {
    this.myForm.get('technology_Skill')?.setValue(this.selectedSkills);
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
    const formData = { ...this.myForm.value };

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
      formData.technology_Skill = formData.technology_Skill.join(',');
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
