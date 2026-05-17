import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Student } from '../../interfaces/students.interface';
import { StudentService } from '../../services/student-service';
import { StudentDialog } from '../student-dialog/student-dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-student-list',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, RouterLink],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss',
})
export class StudentList implements OnInit {
  readonly students = signal<Student[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  constructor(
    private readonly dialog: MatDialog,
    private readonly studentService: StudentService,
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this.students.set(students);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los estudiantes...');
        this.isLoading.set(false);
      },
    });
  }

  openStudentDialog(student: Student | null = null): void {
    const dialogRef = this.dialog.open(StudentDialog, {
      width: '480px',
      data: { student },
    });

    dialogRef.afterClosed().subscribe((hasChanges) => {
      if (hasChanges) {
        this.loadStudents();
      }
    });
  }

  deleteStudent(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '180ms',
      data: {
        title: 'Eliminar estudiante',
        message: `Deseas eliminar a ${student.name}?`,
        cancelText: 'No',
        confirmText: 'Aceptar',
      },
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (!shouldDelete) {
        return;
      }

      this.studentService.deleteStudent(student.id).subscribe({
        next: () => this.loadStudents(),
        error: () => this.errorMessage.set('No se pudo eliminar el estudiante...'),
      });
    });
  }
}
