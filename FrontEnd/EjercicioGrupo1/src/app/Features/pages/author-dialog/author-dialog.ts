import { Component, Inject, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Author, AuthorFormValue } from '../../interfaces/author.interface';
import { AuthorService } from '../../services/author-service';

export interface AuthorDialogData {
  author?: Author | null;
}

@Component({
  selector: 'app-author-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './author-dialog.html',
  styleUrl: './author-dialog.scss',
})
export class AuthorDialog {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly author: Author | null;
  readonly loading = signal(false);
  readonly form = this.fb.group({
    name: ['', Validators.required],
    country: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  });

  constructor(
    private readonly authorService: AuthorService,
    private readonly dialogRef: MatDialogRef<AuthorDialog, boolean>,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private readonly data: AuthorDialogData,
  ) {
    this.author = this.data.author ?? null;

    if (this.author) {
      this.form.patchValue({
        name: this.author.name,
        country: this.author.country,
        phoneNumber: this.author.phoneNumber,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value: AuthorFormValue = this.form.getRawValue();
    const request$ = this.author ? this.authorService.update(this.author.id, value) : this.authorService.create(value);

    request$.subscribe({
      next: () => {
        this.snackBar.open('Autor guardado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('No se pudo guardar el autor.', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
