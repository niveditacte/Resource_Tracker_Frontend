import { Injectable } from '@angular/core';  
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeDataService {
  private refreshNeededSource = new Subject<void>();
  refreshNeeded$ = this.refreshNeededSource.asObservable();

  triggerRefresh() {
    this.refreshNeededSource.next();
  }
}
