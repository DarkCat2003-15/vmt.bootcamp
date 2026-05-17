import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Student, StudentFormValue } from '../../interfaces/students.interface';

@Component({
  selector: 'app-student-form',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export class StudentForm {
  @Input() set student(value: Student | null | undefined) {
    if (!value) {
      this.form.reset();
      return;
    }

    this.form.patchValue({
      name: value.name,
      email: value.email,
      courseId: value.courseId,
    });
  }

  @Input() loading = false;
  @Input() submitLabel = 'Guardar';

  @Output() formSubmit = new EventEmitter<StudentFormValue>();
  @Output() formCancel = new EventEmitter<void>();

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    courseId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
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



