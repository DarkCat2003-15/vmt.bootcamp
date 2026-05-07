import { Component, signal } from '@angular/core';
import { PatientsComponent } from './patients-component/patients-component';
import { DoctorsComponent } from './doctors-component/doctors-component';

@Component({
  selector: 'app-root',
  imports: [PatientsComponent, DoctorsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Práctica 1 - Clínica');
}
