import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Book } from '../../interfaces/book.interface';
import { BookService } from '../../services/book-service';
import { BookDialog } from '../book-dialog/book-dialog';

@Component({
  selector: 'app-book-list',
  imports: [MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, RouterLink],
  templateUrl: './book-list.html',
  styleUrl: './book-list.scss',
})
export class BookList implements OnInit {
  readonly books = signal<Book[]>([]);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  private readonly bookService = inject(BookService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los libros.');
        this.snackBar.open('Error al cargar libros.', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      },
    });
  }

  openBookDialog(book: Book | null = null): void {
    const dialogRef = this.dialog.open(BookDialog, {
      width: '520px',
      data: { book },
    });

    dialogRef.afterClosed().subscribe((hasChanges) => {
      if (hasChanges) {
        this.loadBooks();
      }
    });
  }

  deleteBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar libro',
        message: `Deseas eliminar "${book.name}"?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (!shouldDelete) {
        return;
      }

      this.bookService.delete(book.id).subscribe({
        next: () => {
          this.snackBar.open('Libro eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.loadBooks();
        },
        error: () => this.snackBar.open('No se pudo eliminar el libro.', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
