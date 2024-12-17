import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrl: './employee-table.component.scss'
})
export class EmployeeTableComponent implements OnInit {

  employees: any[] = [];
  displayedEmployees: any[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  sortColumn: string = '';
  sortDirection: boolean = true;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.totalItems = data.length;
      this.updateDisplayedEmployees();
    });
  }

  updateDisplayedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedEmployees = this.employees.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      this.updateDisplayedEmployees();
    }
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
      this.sortColumn = column;
    }

    this.employees.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      return this.sortDirection ? (valueA > valueB ? 1 : -1) : (valueA < valueB ? 1 : -1);
    });

    this.updateDisplayedEmployees();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const pages = [];
    for (let i = Math.max(1, this.currentPage - 1); i <= Math.min(totalPages, this.currentPage + 1); i++) {
      pages.push(i);
    }
    return pages;
  }

}
