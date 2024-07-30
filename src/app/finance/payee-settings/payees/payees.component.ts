import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DestinationMap } from '../../model/payee';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../service/data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PayeeEditComponent } from '../payee-edit/payee-edit.component';

@Component({
  selector: 'app-payees',
  templateUrl: './payees.component.html',
  styleUrl: './payees.component.css',
})
export class PayeesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<DestinationMap>;
  @ViewChild(MatSort) sort: MatSort;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private activatedRoute = inject(ActivatedRoute);
  private dataService = inject(DataService);

  protected readonly faPencil = faPencil;
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

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payeeData }) => {
      this.dataService.setPayees(payeeData);
      this.dataSource = new MatTableDataSource<DestinationMap>(payeeData);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    dialog.afterClosed().subscribe((result) => {
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
            const idx = this.dataSource.data.findIndex((x) => x.id === mergeId);
            this.dataSource.data.splice(idx, 1);
          });
        }
        this.dataSource.paginator = this.paginator;
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }
}
