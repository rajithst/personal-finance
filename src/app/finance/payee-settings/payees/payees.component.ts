import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DestinationMap } from '../../../model/payee';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../../../service/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrl: './payees.component.css',
})
export class PayeesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<DestinationMap>;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<DestinationMap>;
  selection = new SelectionModel<DestinationMap>(true, []);
  displayedColumns: string[] = [
    'select',
    'Payee',
    'Alias',
    'Category',
    'SubCategory',
    'Actions',
  ];
  protected readonly destroyed$ = new ReplaySubject<void>(1);
  protected readonly faPencil = faPencil;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private dataService = inject(DataService);

  ngOnInit(): void {
    this.preparePayeeTable();
    this.dataService.searchBar$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.dataSource.filter = value ? value.trim().toLowerCase() : '';
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  preparePayeeTable() {
    this.dataSource = new MatTableDataSource<DestinationMap>(
      this.dataService.getPayees(),
    );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  editPayee(payee: DestinationMap) {
    const dialog = this.dialog.open(PayeeEditComponent, {
      width: '850px',
      height: '600px',
      position: {
        top: '100px',
      },
      data: { payee },
    });
    dialog
      .afterClosed()
      .subscribe(
        (result: {
          payee: DestinationMap | null;
          mergeIds: number[] | null;
        }) => {
          if (result.payee) {
            const updatedPayee = result.payee;
            const id = this.dataSource.data.findIndex(
              (x) => x.id === updatedPayee.id,
            );
            if (id !== -1) {
              this.dataSource.data[id] = updatedPayee;
            }
            if (result.mergeIds) {
              result.mergeIds.forEach((mergeId: number) => {
                const idx = this.dataSource.data.findIndex(
                  (x) => x.id === mergeId,
                );
                this.dataSource.data.splice(idx, 1);
              });
            }
            this.dataSource.paginator = this.paginator;
            this.snackBar.open('Updated!', 'Success', {
              duration: 3000,
            });
          }
        },
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
