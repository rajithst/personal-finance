import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayeesComponent } from './payees.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceStore } from '../../../core/store/finance.store';
import { Payee } from '../../model/payee';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PayeesComponent', () => {
  let component: PayeesComponent;
  let fixture: ComponentFixture<PayeesComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockStore: jasmine.SpyObj<typeof FinanceStore>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockStore = jasmine.createSpyObj('FinanceStore', ['getPayees', 'payees'], {
      payees: () => [{
        id: 1,
        destination: 'Walmart Supercenter',
        destination_original: 'Walmart Supercenter Original',
        destination_eng: 'Walmart Supercenter ENG',
        category: 101,
        category_type: 1,
        category_type_text: 'Retail',
        category_text: 'Groceries',
        subcategory: 1001,
        subcategory_text: 'Supermarket',
        keywords: 'groceries, food, market',
      }] as Payee[],
    });

    await TestBed.configureTestingModule({
      declarations: [PayeesComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: FinanceStore, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
