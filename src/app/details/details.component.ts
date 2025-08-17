import { Component } from '@angular/core';
import { HttpClientService } from '../Services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Resource } from '../interfaces';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatIconModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  isAdmin: boolean = false;
  isManager: boolean = false;
  isHR: boolean = false;

  constructor( private httpClientService:HttpClientService,private activatedRoute:ActivatedRoute, private router:Router, private authService : AuthService){}
  
  empId?: string;
  employeeDetails?: Resource;

  ngOnInit(){
    this.empId = this.activatedRoute.snapshot.paramMap.get('empId')!;
    if (this.empId){
      this.httpClientService.getEmployeeDetailsById(this.empId).subscribe((response: any) => {
        this.employeeDetails = (response as Resource);
      })
    }
    const role = this.authService.getUserRole();
    this.isAdmin = (role === 'Admin');
    this.isManager = (role === 'Manager');
    this.isHR = (role === 'HR');

  }
  // Helper method to convert skills string to array
getSkillsArray({ skills }: { skills: string; }): string[] {
  if (!skills) return [];
  return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
}

// Helper method to convert projects string to array
getProjectsArray(projects: string): string[] {
  if (!projects) return [];
  return projects.split(',').map(project => project.trim()).filter(project => project.length > 0);
}

// Navigation methods
onBack(): void {
  // Implement your back navigation logic
  this.router.navigate(['/Home']);
}

onEdit(): void {
  // Implement your edit navigation logic
  if (this.employeeDetails && this.employeeDetails.empId) {
    this.router.navigate(['/Add-Edit', this.employeeDetails.empId]);
  }
}

// Permission check (optional)
get canEdit(): boolean {
  // Return true/false based on user permissions
  return this.isAdmin || this.isManager || this.isHR;
}

}
