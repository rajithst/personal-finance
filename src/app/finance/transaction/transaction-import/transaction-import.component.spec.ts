import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionImportComponent } from './transaction-import.component';
import { ApiService } from '../../../core/api.service';
import { DataService } from '../../../service/data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { accounts } from '../../../mock-data/init_settings';

describe('TransactionImportComponent', () => {
  let component: TransactionImportComponent;
  let fixture: ComponentFixture<TransactionImportComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let dataService: jasmine.SpyObj<DataService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TransactionImportComponent>>;

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'uploadTransactions',
    ]);
    const dataServiceSpy = jasmine.createSpyObj('DataService', ['getAccounts']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
      imports: [TransactionImportComponent, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignore irrelevant child components
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionImportComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<TransactionImportComponent>
    >;

    dataService.getAccounts.and.returnValue(accounts);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChange', () => {
    it('should add files to the files array', () => {
      const file = new File([''], 'test-file.txt');
      const event = { target: { files: [file] } };

      component.onChange(event as any);
      expect(component.files.length).toBe(1);
      expect(component.files[0].name).toBe('test-file.txt');
    });
  });

  describe('import', () => {
    it('should call uploadTransactions and close dialog on success', () => {
      const file = new File(['content'], 'test-file.txt');
      component.files = [file];
      component.accountForm.get('account')?.setValue(1);
      apiService.uploadTransactions.and.returnValue(of());

      component.import();
      expect(apiService.uploadTransactions).toHaveBeenCalled();
      expect(dialogRef.close).toHaveBeenCalledWith({
        refresh: true,
        data: null,
        action: 'SUCCESS_ACTION',
      });
    });

    it('should handle error and set status to "fail" on failure', () => {
      component.files = [new File(['content'], 'test-file.txt')];
      component.accountForm.get('account')?.setValue(1);
      apiService.uploadTransactions.and.returnValue(
        throwError(() => new Error('Upload failed')),
      );

      component.import();
      expect(component.status).toBe('fail');
    });
  });

  describe('deleteAttachment', () => {
    it('should remove specified file from files array', () => {
      component.files = [
        new File(['content'], 'file1.txt'),
        new File(['content'], 'file2.txt'),
      ];

      component.deleteAttachment('file1.txt');
      expect(component.files.length).toBe(1);
      expect(component.files[0].name).toBe('file2.txt');
    });
  });

  describe('getLastImportDate', () => {
    it('should return last import date for selected account', () => {
      component.accountForm.get('account')?.setValue(1);
      const lastDate = component.getLastImportDate();
      expect(lastDate).toBe('2023-01-01');
    });

    it('should return undefined if no account is selected', () => {
      component.accountForm.get('account')?.setValue(null);
      const lastDate = component.getLastImportDate();
      expect(lastDate).toBeUndefined();
    });
  });

  describe('isValidToSubmit', () => {
    it('should return true if form is valid and files are present', () => {
      component.files = [new File(['content'], 'file.txt')];
      component.accountForm.get('account')?.setValue(1);

      expect(component.isValidToSubmit()).toBeTrue();
    });

    it('should return false if form is invalid or files are absent', () => {
      component.files = [];
      component.accountForm.get('account')?.setValue(null);

      expect(component.isValidToSubmit()).toBeFalse();
    });
  });

  describe('cancel', () => {
    it('should close the dialog with cancel action', () => {
      component.cancel();
      expect(dialogRef.close).toHaveBeenCalledWith({
        refresh: false,
        data: null,
        action: 'CANCEL_ACTION',
      });
    });
  });
});
