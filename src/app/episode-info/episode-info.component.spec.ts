import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeInfoComponent } from './episode-info.component';

describe('EpisodeInfoComponent', () => {
  let component: EpisodeInfoComponent;
  let fixture: ComponentFixture<EpisodeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
