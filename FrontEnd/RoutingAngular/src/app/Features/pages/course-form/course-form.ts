import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { Course, CourseFormValue } from '../../interfaces/courses.interface';

@Component({
  selector: 'app-course-form',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './course-form.html',
  styleUrl: './course-form.scss',
})
export class CourseForm {
  @Input() set course(value: Course | null | undefined) {
    if (!value) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      name: value.name,
      description: value.description,
      level: value.level,
      instructor: value.instructor,
    });
  }

  @Input() loading = false;
  @Input() submitLabel = 'Guardar';

  @Output() formSubmit = new EventEmitter<CourseFormValue>();
  @Output() formCancel = new EventEmitter<void>();

  readonly levels = ['Basico', 'Intermedio', 'Avanzado'];

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
    level: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    instructor: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.formCancel.emit();
  }
}
