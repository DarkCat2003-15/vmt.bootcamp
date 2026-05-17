import { Component, Inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Course, CourseFormValue } from '../../interfaces/courses.interface';
import { CourseService } from '../../services/course-service';
import { CourseForm } from '../course-form/course-form';

export interface CourseDialogData {
  course?: Course | null;
}

@Component({
  selector: 'app-course-dialog',
  imports: [CourseForm, MatDialogModule, MatIconModule],
  templateUrl: './course-dialog.html',
  styleUrl: './course-dialog.scss',
})
export class CourseDialog {
  readonly course: Course | null;
  readonly loading = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private readonly dialogRef: MatDialogRef<CourseDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) private readonly data: CourseDialogData,
    private readonly courseService: CourseService,
  ) {
    this.course = this.data.course ?? null;
  }

  save(value: CourseFormValue): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const request$ = this.course
      ? this.courseService.updateCourse(this.course.id, value)
      : this.courseService.createCourse(value);

    request$.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.errorMessage.set('No se pudo guardar el curso.');
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
