import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PayeeDetailComponent } from './payee-detail.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TransactionExpand } from '../../model/transactions';
import { Payee } from '../../model/payee';
import { payees } from '../../../mock-data/payees';
import { transactions } from '../../../mock-data/transactions';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PayeeDetailComponent', () => {
  let component: PayeeDetailComponent;
  let fixture: ComponentFixture<PayeeDetailComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(waitForAsync(() => {
    // Mock data for payee and transactions
    const mockPayee = payees[0] as Payee;
    const mockTransactions: TransactionExpand[] = transactions;

    // Mock ActivatedRoute to provide test data
    activatedRouteStub = {
      data: of({ payee: { payee: mockPayee, transactions: mockTransactions } }),
    };

    // Mock MatDialog and MatSnackBar
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [PayeeDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set payeeInfo and payeeTransactions from route data on init', () => {
    expect(component.payeeInfo).toEqual(payees[0]);
    expect(component.payeeTransactions.length).toBe(5);
  });

  it('should calculate totalPayment correctly', () => {
    component.ngOnInit(); // Ensure ngOnInit is called to calculate totalPayment
    expect(component.totalPayment()).toBe(2650.75);
  });

  it('should initialize dataSource with payeeTransactions', () => {
    expect(component.dataSource instanceof MatTableDataSource).toBeTrue();
    expect(component.dataSource.data).toEqual(component.payeeTransactions);
  });

  it('should open dialog and handle result in editPayee method', () => {
    const mockDialogRef = {
      afterClosed: () => {
        const updatedPayee: Payee = payees[0];
        updatedPayee.destination = 'updated destination';
        return of({ payee: updatedPayee, mergeIds: null });
      },
    };
    dialogSpy.open.and.returnValue(mockDialogRef as any);

    component.editPayee();

    expect(dialogSpy.open).toHaveBeenCalled();
    fixture.detectChanges();
    const updatedPayee: Payee = payees[0];
    updatedPayee.destination = 'updated destination';
    expect(component.payeeInfo).toEqual(updatedPayee);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Updated!', 'Success', {
      duration: 3000,
    });
  });
});
