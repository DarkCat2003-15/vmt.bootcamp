import { Component, Inject, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Book, BookFormValue } from '../../interfaces/book.interface';
import { BookService } from '../../services/book-service';

export interface BookDialogData {
  book?: Book | null;
}

@Component({
  selector: 'app-book-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './book-dialog.html',
  styleUrl: './book-dialog.scss',
})
export class BookDialog {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly book: Book | null;
  readonly loading = signal(false);
  readonly form = this.fb.group({
    name: ['', Validators.required],
    author: ['', Validators.required],
    publishedAt: ['', Validators.required],
  });

  constructor(
    private readonly bookService: BookService,
    private readonly dialogRef: MatDialogRef<BookDialog, boolean>,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private readonly data: BookDialogData,
  ) {
    this.book = this.data.book ?? null;

    if (this.book) {
      this.form.patchValue({
        name: this.book.name,
        author: this.book.author,
        publishedAt: this.book.publishedAt,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const value: BookFormValue = this.form.getRawValue();
    const request$ = this.book ? this.bookService.update(this.book.id, value) : this.bookService.create(value);

    request$.subscribe({
      next: () => {
        this.snackBar.open('Libro guardado correctamente.', 'Cerrar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('No se pudo guardar el libro.', 'Cerrar', { duration: 3000 });
        this.loading.set(false);
      },
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
