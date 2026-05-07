import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { DoctorService } from '../Servicios/doctor-service';
import { Doctors } from '../interfaces/doctors.interface';

@Component({
  selector: 'app-doctors-component',
  imports: [],
  templateUrl: './doctors-component.html',
  styleUrl: './doctors-component.scss',
})
export class DoctorsComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctors = signal<Doctors[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal('');

  filteredDoctors = computed(() => {
    const value = this.search().toLowerCase().trim();

    if (!value) {
      return this.doctors();
    }

    return this.doctors().filter((doctor) => doctor.name.toLowerCase().includes(value));
  });

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading.set(true);
    this.error.set('');

    this.doctorService.getAll().subscribe({
      next: (doctors) => {
        this.doctors.set(doctors);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los doctores');
        this.loading.set(false);
      },
    });
  }

  addDoctor(): void {
    const doctorNumber = this.doctors().length + 1;
    const payload: Partial<Doctors> = {
      createdAt: new Date().toISOString(),
      name: `mb-doctor${doctorNumber}`,
      lastName: 'Buenaño',
      gender: 'masculino',
      address: 'Galapagos',
    };

    this.doctorService.create(payload).subscribe({
      next: (newDoctor) => {
        this.doctors.update((doctors) => [newDoctor, ...doctors]);
      },
      error: () => {
        this.error.set('Error al crear el doctor');
      },
    });
  }

  editFirstDoctor(): void {
    const doctor = this.doctors()[0];

    if (!doctor) {
      return;
    }

    const payload: Partial<Doctors> = {
      name: doctor.name.endsWith('-editado') ? doctor.name : `${doctor.name}-editado`,
      lastName: doctor.lastName,
      gender: doctor.gender,
      address: doctor.address,
    };

    this.doctorService.update(doctor.id, payload).subscribe({
      next: (updated) => {
        this.doctors.update((doctors) =>
          doctors.map((item) => (item.id === doctor.id ? updated : item)),
        );
      },
      error: () => {
        this.error.set('Error al editar el doctor');
      },
    });
  }

  deleteDoctor(id: string): void {
    this.doctorService.delete(id).subscribe({
      next: () => {
        this.doctors.update((doctors) => doctors.filter((doctor) => doctor.id !== id));
      },
      error: () => {
        this.error.set('Error al eliminar el doctor');
      },
    });
  }
}
