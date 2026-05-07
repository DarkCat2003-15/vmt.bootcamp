import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { PatientService } from '../Servicios/patient-service';
import { Patients } from '../interfaces/patients.interface';

@Component({
  selector: 'app-patients-component',
  imports: [],
  templateUrl: './patients-component.html',
  styleUrl: './patients-component.scss',
})
export class PatientsComponent implements OnInit {
  private patientService = inject(PatientService);

  patients = signal<Patients[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal('');

  filteredPatients = computed(() => {
    const value = this.search().toLowerCase().trim();

    if (!value) {
      return this.patients();
    }

    return this.patients().filter((patient) => patient.name.toLowerCase().includes(value));
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading.set(true);
    this.error.set('');

    this.patientService.getAll().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar los pacientes');
        this.loading.set(false);
      },
    });
  }

  addPatient(): void {
    const patientNumber = this.patients().length + 1;
    const payload: Partial<Patients> = {
      createdAt: new Date().toISOString(),
      name: `mb-paciente${patientNumber}`,
      avatar: 'https://i.pravatar.cc/150?img=12',
      age: '22',
      phone: '0996101033',
    };

    this.patientService.create(payload).subscribe({
      next: (newPatient) => {
        this.patients.update((patients) => [newPatient, ...patients]);
      },
      error: () => {
        this.error.set('Error al crear el paciente');
      },
    });
  }

  editFirstPatient(): void {
    const patient = this.patients()[0];

    if (!patient) {
      return;
    }

    const payload: Partial<Patients> = {
      name: patient.name.endsWith('-editado') ? patient.name : `${patient.name}-editado`,
      avatar: patient.avatar,
      age: patient.age,
      phone: patient.phone,
    };

    this.patientService.update(patient.id, payload).subscribe({
      next: (updated) => {
        this.patients.update((patients) =>
          patients.map((item) => (item.id === patient.id ? updated : item)),
        );
      },
      error: () => {
        this.error.set('Error al editar el paciente');
      },
    });
  }

  deletePatient(id: string): void {
    this.patientService.delete(id).subscribe({
      next: () => {
        this.patients.update((patients) => patients.filter((patient) => patient.id !== id));
      },
      error: () => {
        this.error.set('Error al eliminar el paciente');
      },
    });
  }
}
