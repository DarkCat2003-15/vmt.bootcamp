import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Course } from '../../interfaces/courses.interface';
import { CourseService } from '../../services/course-service';
import { CourseDialog } from '../course-dialog/course-dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-course-list',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, RouterLink],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  readonly courses = signal<Course[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  constructor(
    private readonly courseService: CourseService,
    private readonly dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los cursos.');
        this.isLoading.set(false);
      },
    });
  }

  openCourseDialog(course: Course | null = null): void {
    const dialogRef = this.dialog.open(CourseDialog, {
      width: '520px',
      data: { course },
    });

    dialogRef.afterClosed().subscribe((hasChanges) => {
      if (hasChanges) {
        this.loadCourses();
      }
    });
  }

  deleteCourse(course: Course): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '180ms',
      data: {
        title: 'Eliminar curso',
        message: `Deseas eliminar el curso ${course.name}?`,
        cancelText: 'No',
        confirmText: 'Aceptar',
      },
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (!shouldDelete) {
        return;
      }

      this.courseService.deleteCourse(course.id).subscribe({
        next: () => this.loadCourses(),
        error: () => this.errorMessage.set('No se pudo eliminar el curso.'),
      });
    });
  }
}
