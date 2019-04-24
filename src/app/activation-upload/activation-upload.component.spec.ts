import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationUploadComponent } from './activation-upload.component';

describe('ActivationUploadComponent', () => {
  let component: ActivationUploadComponent;
  let fixture: ComponentFixture<ActivationUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivationUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
