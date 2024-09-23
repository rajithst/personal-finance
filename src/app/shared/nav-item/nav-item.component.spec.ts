import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavItemComponent } from './nav-item.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterModule} from "@angular/router";

describe('NavItemComponent', () => {
  let component: NavItemComponent;
  let fixture: ComponentFixture<NavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavItemComponent],
      imports: [RouterModule.forRoot([]), NoopAnimationsModule, FaIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render menu items', () => {
    const menuItems = fixture.nativeElement.querySelectorAll('a');
    expect(menuItems.length).toBe(component.menuItems.length);

    menuItems.forEach((menuItem: HTMLElement, index: number) => {
      expect(menuItem.textContent).toContain(component.menuItems[index].label);
      expect(menuItem.getAttribute('routerLink')).toBe(component.menuItems[index].link);
    });
  });

});
