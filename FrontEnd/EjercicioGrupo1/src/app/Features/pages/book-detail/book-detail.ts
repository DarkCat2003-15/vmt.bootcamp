import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Book } from '../../interfaces/book.interface';
import { BookService } from '../../services/book-service';

@Component({
  selector: 'app-book-detail',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
  readonly book = signal<Book | null>(null);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  constructor(
    private readonly bookService: BookService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('No se encontro el libro solicitado.');
      this.isLoading.set(false);
      return;
    }

    this.bookService.getById(id).subscribe({
      next: (book) => {
        this.book.set(book);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el detalle del libro.');
        this.snackBar.open('Error al cargar el libro.', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      },
    });
  }
}
