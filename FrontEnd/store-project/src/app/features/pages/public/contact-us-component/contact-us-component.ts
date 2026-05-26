import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface ContactInfo {
    icon: string;
    label: string;
    value: string;
    color: string;
}

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        MatCardModule,
        MatIconModule,
        MatDividerModule,
    ],
    templateUrl: './contact-us-component.html',
    styleUrl: './contact-us-component.scss',
})
export class ContactComponent {

    contactInfo: ContactInfo[] = [
        { icon: 'location_on', label: 'Dirección', value: 'Av. Principal 123, Guayaquil, Ecuador', color: '#1976d2' },
        { icon: 'phone', label: 'Teléfono', value: '+593 99 123 4567', color: '#388e3c' },
        { icon: 'email', label: 'Correo', value: 'contacto@tiendamia.com', color: '#f57c00' },
        { icon: 'schedule', label: 'Horario', value: 'Lunes a Viernes, 9:00 – 18:00', color: '#7b1fa2' },
    ];

    socialLinks = [
        { icon: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
        { icon: 'photo_camera', label: 'Instagram', url: 'https://instagram.com' },
        { icon: 'alternate_email', label: 'Twitter/X', url: 'https://twitter.com' },
    ];
}