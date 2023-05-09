import {Component, OnInit, AfterViewInit, ViewChild, Injectable} from '@angular/core';
import {EmpAddEditComponent} from "./components/emp-add-edit/emp-add-edit.component";
import {EmployeeService} from "./services/employee.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  displayedColumns: string[] = ['id', 'firstName', 'lastName',
    'email', 'dob','gender','education','company',
    'experience','package','action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _dialog:MatDialog,
              private _empService:EmployeeService,) {
  }
  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm(){
    let dialogRef = this._dialog.open(EmpAddEditComponent);//esto agrega

    //refrescar la pantalla
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res)=>{
        console.log(res)
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.sort=this.sort;
        this.dataSource.paginator=this.paginator;
      },
      error:console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id:number){
    this._empService.deleteEmployee(id).subscribe({
      next:(res)=>{
        alert("Employee deleted");
        this.getEmployeeList();
      },
      error:console.log,
    })
  }


  openEditEmpForm(data:any){
    const dialogRef =this._dialog.open(EmpAddEditComponent,{
      data,
    })

    //refrescar la pantalla
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList();
        }
      },
    });

  }
}
