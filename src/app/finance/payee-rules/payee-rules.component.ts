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
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PayeeEditComponent } from './payee-edit/payee-edit.component';

@Component({
  selector: 'app-payee-rules',
  templateUrl: './payee-rules.component.html',
  styleUrl: './payee-rules.component.css',
})
export class PayeeRulesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly faPencil = faPencil;

  dataSource: MatTableDataSource<DestinationMap>;
  selection = new SelectionModel<DestinationMap>(true, []);
  payeeList: DestinationMap[] = [];

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
      this.payeeList = payeeData;
      this.dataSource = new MatTableDataSource<DestinationMap>(this.payeeList);
    });
  }

  ngAfterViewInit() {
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
    console.log(payee);
    const dialog = this.dialog.open(PayeeEditComponent, {
      width: '850px',
      height: '500px',
      position: {
        top: '100px',
      },
      data: { payee },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Updated!', 'Success', {
          duration: 3000,
        });
      }
    });
  }
}
