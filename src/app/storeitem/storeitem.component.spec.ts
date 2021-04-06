import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreitemComponent } from './storeitem.component';

describe('StoreitemComponent', () => {
  let component: StoreitemComponent;
  let fixture: ComponentFixture<StoreitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'angular-reactive-forms'`, () => {
    const fixture = TestBed.createComponent(StoreitemComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('angular-reactive-forms');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(StoreitemComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular-reactive-forms!');
  });
});
