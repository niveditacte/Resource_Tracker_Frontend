import { Component } from '@angular/core';
import { HttpClientService } from '../Services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Resource } from '../interfaces';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  constructor( private httpClientService:HttpClientService,private activatedRoute:ActivatedRoute){}
  
  empId?: string;
  employeeDetails?: Resource;

  ngOnInit(){
    this.empId = this.activatedRoute.snapshot.paramMap.get('empId')!;
    if (this.empId){
      this.httpClientService.getEmployeeDetailsById(this.empId).subscribe((response: any) => {
        this.employeeDetails = (response as Resource);
      })
    }
  }

}
