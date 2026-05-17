import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Author } from '../../interfaces/author.interface';
import { AuthorService } from '../../services/author-service';
import { AuthorDialog } from '../author-dialog/author-dialog';

@Component({
  selector: 'app-author-list',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, RouterLink],
  templateUrl: './author-list.html',
  styleUrl: './author-list.scss',
})
export class AuthorList implements OnInit {
  readonly authors = signal<Author[]>([]);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  constructor(
    private readonly authorService: AuthorService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authorService.getAll().subscribe({
      next: (authors) => {
        this.authors.set(authors);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los autores.');
        this.snackBar.open('Error al cargar autores.', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      },
    });
  }

  openAuthorDialog(author: Author | null = null): void {
    const dialogRef = this.dialog.open(AuthorDialog, {
      width: '520px',
      data: { author },
    });

    dialogRef.afterClosed().subscribe((hasChanges) => {
      if (hasChanges) {
        this.loadAuthors();
      }
    });
  }

  deleteAuthor(author: Author): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Eliminar autor',
        message: `Deseas eliminar a ${author.name}?`,
        cancelText: 'Cancelar',
        confirmText: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (!shouldDelete) {
        return;
      }

      this.authorService.delete(author.id).subscribe({
        next: () => {
          this.snackBar.open('Autor eliminado correctamente.', 'Cerrar', { duration: 3000 });
          this.loadAuthors();
        },
        error: () => this.snackBar.open('No se pudo eliminar el autor.', 'Cerrar', { duration: 3000 }),
      });
    });
  }
}
