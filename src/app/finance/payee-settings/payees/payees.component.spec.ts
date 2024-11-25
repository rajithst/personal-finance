import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayeesComponent } from './payees.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { DataService } from '../../../service/data.service';
import { of } from 'rxjs';
import { DestinationMap } from '../../model/payee';
import { payees } from '../../../mock-data/payees';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('PayeesComponent', () => {
  let component: PayeesComponent;
  let fixture: ComponentFixture<PayeesComponent>;
  let dataService: jasmine.SpyObj<DataService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const dataServiceSpy = jasmine.createSpyObj('DataService', [
      'getPayees',
      'searchBar$',
    ]);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        PayeesComponent,
        NoopAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers: [
        provideRouter([]),
        { provide: DataService, useValue: dataServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PayeesComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    // Mock data for testing
    dataService.getPayees.and.returnValue(payees as DestinationMap[]);
    dataService.searchBar$ = of();
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create PayeesComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize dataSource with payees data from data service', () => {
    component.preparePayeeTable();
    expect(component.dataSource.data.length).toBe(5);
    expect(component.dataSource.data[0].destination).toBe('Tokyo');
  });

  it('should select all rows when toggleAllRows is called', () => {
    component.preparePayeeTable();
    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(5);
  });

  it('should clear all selected rows when toggleAllRows is called twice', () => {
    component.preparePayeeTable();
    component.toggleAllRows();
    component.toggleAllRows();
    expect(component.selection.selected.length).toBe(0);
  });

  it('should open edit dialog and update payee data when editPayee is called', () => {
    const payee = payees[0] as DestinationMap;
    const dialogRefSpyObj = jasmine.createSpyObj({
      afterClosed: of({
        payee: { id: 1, destination: 'Updated Payee 1' },
        mergeIds: null,
      }),
    });
    dialog.open.and.returnValue(dialogRefSpyObj);

    component.editPayee(payee);

    expect(dialog.open).toHaveBeenCalledWith(PayeeEditComponent, {
      width: '850px',
      position: { top: '5%' },
      data: { payee },
    });
    // @ts-ignore
    dialogRefSpyObj.afterClosed().subscribe((result) => {
      expect(component.dataSource.data[0].destination).toBe('Updated Payee 1');
      expect(snackBar.open).toHaveBeenCalledWith('Updated!', 'Success', {
        duration: 3000,
      });
    });
  });

  it('should unsubscribe destroyed$ on component destroy', () => {
    // @ts-ignore
    const spy = spyOn(component.destroyed$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
