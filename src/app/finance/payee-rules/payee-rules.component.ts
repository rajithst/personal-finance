import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestinationMap } from '../model/payee';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayeeEditComponent } from './payee-edit/payee-edit.component';
import {SessionService} from "../service/session.service";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-payee-rules',
  templateUrl: './payee-rules.component.html',
  styleUrl: './payee-rules.component.css',
})
export class PayeeRulesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<DestinationMap>;
  @ViewChild(MatSort) sort: MatSort;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private activatedRoute = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  protected readonly faPencil = faPencil;
  sessionData = this.sessionService.getData();

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
      this.sessionService.setPayeeSessionData(payeeData);
      this.sessionData = this.sessionService.getData();
      this.dataSource = new MatTableDataSource<DestinationMap>(this.sessionData.payees);
      this.dataSource.sort = this.sort;
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
      if (result.refresh) {
        this.sessionData = this.sessionService.getData();
        this.dataSource = new MatTableDataSource<DestinationMap>(this.sessionData.payees);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }
}
