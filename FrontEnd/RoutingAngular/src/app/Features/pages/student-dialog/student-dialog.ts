import { Component, Inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Student, StudentFormValue } from '../../interfaces/students.interface';
import { StudentService } from '../../services/student-service';
import { StudentForm } from '../student-form/student-form';

export interface StudentDialogData {
  student?: Student | null;
}

@Component({
  selector: 'app-student-dialog',
  imports: [MatDialogModule, MatIconModule, StudentForm],
  templateUrl: './student-dialog.html',
  styleUrl: './student-dialog.scss',
})
export class StudentDialog {
  readonly student: Student | null;
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private readonly dialogRef: MatDialogRef<StudentDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) private readonly data: StudentDialogData,
    private readonly studentService: StudentService,
  ) {
    this.student = this.data.student ?? null;
  }

  save(value: StudentFormValue): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const request$ = this.student
      ? this.studentService.updateStudent(this.student.id, value)
      : this.studentService.createStudent(value);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.errorMessage.set('No se pudo guardar el estudiante.');
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
