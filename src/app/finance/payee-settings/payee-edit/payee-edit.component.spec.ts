import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayeeEditComponent } from './payee-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import { DataService } from '../../service/data.service';
import { Payee } from '../../model/payee';
import { payees } from '../../../mock-data/payees';
import {
  transaction_categories,
  transaction_subcategories,
} from '../../../mock-data/init_settings';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  TRANSACTION_TYPE_EXPENSE_ID,
  TRANSACTION_TYPE_INCOME_ID,
  TRANSACTION_TYPE_PAYMENTS_ID,
  TRANSACTION_TYPE_SAVINGS_ID,
} from '../../data/client.data';

describe('PayeeEditComponent', () => {
  let component: PayeeEditComponent;
  let fixture: ComponentFixture<PayeeEditComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PayeeEditComponent>>;

  const mockData: Payee = payees[0] as Payee;
  const expenseCategoryType = TRANSACTION_TYPE_EXPENSE_ID;
  const incomeCategoryType = TRANSACTION_TYPE_INCOME_ID;
  const savingsCategoryType = TRANSACTION_TYPE_SAVINGS_ID;
  const paymentCategoryType = TRANSACTION_TYPE_PAYMENTS_ID;

  const mockExpenseCategories = transaction_categories.filter(
    (x) => x.category_type === expenseCategoryType,
  );
  const mockIncomeCategories = transaction_categories.filter(
    (x) => x.category_type === incomeCategoryType,
  );
  const mockSavingsCategories = transaction_categories.filter(
    (x) => x.category_type === savingsCategoryType,
  );
  const mockPaymentCategories = transaction_categories.filter(
    (x) => x.category_type === paymentCategoryType,
  );

  beforeEach(async () => {
    const apiServiceMock = jasmine.createSpyObj('ApiService', [
      'updatePayeeRules',
    ]);
    const dataServiceMock = jasmine.createSpyObj('DataService', [
      'getAllCategories',
      'getAllSubCategories',
      'getExpenseCategories',
      'getIncomeCategories',
      'getSavingsCategories',
      'getPaymentCategories',
      'getPayees',
    ]);
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [PayeeEditComponent, NoopAnimationsModule, ReactiveFormsModule],
      declarations: [],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { payee: mockData } },
      ],
    }).compileComponents();

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<PayeeEditComponent>
    >;

    dataServiceSpy.getAllCategories.and.returnValue(transaction_categories);
    dataServiceSpy.getAllSubCategories.and.returnValue(
      transaction_subcategories,
    );
    dataServiceSpy.getExpenseCategories.and.returnValue(mockExpenseCategories);
    dataServiceSpy.getIncomeCategories.and.returnValue(mockIncomeCategories);
    dataServiceSpy.getSavingsCategories.and.returnValue(mockSavingsCategories);
    dataServiceSpy.getPaymentCategories.and.returnValue(mockPaymentCategories);
    dataServiceSpy.getPayees.and.returnValue(payees);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with data', () => {
    expect(component.payeeForm.value).toEqual({
      id: mockData.id,
      category_type: mockData.category_type,
      category: mockData.category,
      subcategory: mockData.subcategory,
      category_text: mockData.category_text,
      subcategory_text: mockData.subcategory_text,
      destination: mockData.destination,
      destination_original: mockData.destination_original,
      destination_eng: mockData.destination_eng,
    });
    expect(component.keywords).toEqual(['keyword1', 'example1']);
  });

  it('should add a keyword', () => {
    component.add({
      value: 'newKeyword',
      chipInput: { clear: () => {} },
    } as any);
    expect(component.keywords).toContain('newKeyword');
  });

  it('should not add a duplicate keyword', () => {
    component.add({ value: 'keyword1', chipInput: { clear: () => {} } } as any);
    expect(component.keywords.filter((k) => k === 'keyword1').length).toBe(1);
  });

  it('should remove a keyword', () => {
    component.remove('keyword1');
    expect(component.keywords).not.toContain('keyword1');
  });

  it('should submit and close dialog with correct data', () => {
    const updatedPayee = payees[0] as Payee;
    updatedPayee.keywords = 'k1, k2, k3';
    apiServiceSpy.updatePayeeRules.and.returnValue(of(updatedPayee));

    component.submit();
    expect(apiServiceSpy.updatePayeeRules).toHaveBeenCalledWith(
      jasmine.objectContaining({ keywords: 'keyword1,example1' }),
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      payee: updatedPayee,
      mergeIds: [],
    });
  });

  it('should close dialog without changes on cancel', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      payee: null,
      mergeIds: null,
    });
  });

  it('should set transaction categories based on category type', () => {
    // @ts-ignore
    component.setTransactionCategories(expenseCategoryType);
    expect(component.transactionCategories).toEqual(mockExpenseCategories);
    // @ts-ignore
    component.setTransactionCategories(incomeCategoryType);
    expect(component.transactionCategories).toEqual(mockIncomeCategories);
    // @ts-ignore
    component.setTransactionCategories(savingsCategoryType);
    expect(component.transactionCategories).toEqual(mockSavingsCategories);
    // @ts-ignore
    component.setTransactionCategories(paymentCategoryType);
    expect(component.transactionCategories).toEqual([
      ...mockPaymentCategories,
      ...mockExpenseCategories, // Should also include expense categories
    ]);
  });

  it('should update related payees based on keywords', () => {
    dataServiceSpy.getPayees.and.returnValue(payees);
    component.keywords = ['London'];

    component.updateRelatedPayees();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data).toEqual(
      jasmine.arrayContaining([payees[3]]),
    );
  });
});
