import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubscribedInfoComponent } from './view-subscribed-info.component';

describe('ViewSubscribedInfoComponent', () => {
  let component: ViewSubscribedInfoComponent;
  let fixture: ComponentFixture<ViewSubscribedInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubscribedInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSubscribedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
