import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotetypesComponent } from './notetypes.component';

describe('NotetypesComponent', () => {
  let component: NotetypesComponent;
  let fixture: ComponentFixture<NotetypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotetypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
