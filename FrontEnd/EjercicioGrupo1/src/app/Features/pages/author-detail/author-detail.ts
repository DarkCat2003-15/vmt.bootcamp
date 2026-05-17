import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Author } from '../../interfaces/author.interface';
import { AuthorService } from '../../services/author-service';

@Component({
  selector: 'app-author-detail',
  imports: [DatePipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.scss',
})
export class AuthorDetail implements OnInit {
  readonly author = signal<Author | null>(null);
  readonly errorMessage = signal('');
  readonly isLoading = signal(true);

  constructor(
    private readonly authorService: AuthorService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.errorMessage.set('No se encontro el autor solicitado.');
      this.isLoading.set(false);
      return;
    }

    this.authorService.getById(id).subscribe({
      next: (author) => {
        this.author.set(author);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo cargar el detalle del autor.');
        this.snackBar.open('Error al cargar el autor.', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      },
    });
  }
}
