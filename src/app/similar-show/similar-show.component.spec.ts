import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarShowComponent } from './similar-show.component';

describe('SimilarShowComponent', () => {
  let component: SimilarShowComponent;
  let fixture: ComponentFixture<SimilarShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
