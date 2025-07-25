import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaincompComponent } from './maincomp.component';

describe('MaincompComponent', () => {
  let component: MaincompComponent;
  let fixture: ComponentFixture<MaincompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaincompComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaincompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
