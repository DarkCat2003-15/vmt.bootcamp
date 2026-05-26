import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface StatCard {
    icon: string;
    label: string;
    value: string;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MatCardModule,
        MatIconModule,
    ],
    templateUrl: './dashboard-component.html',
    styleUrl: './dashboard-component.scss',
})
export class DashboardComponent {

    stats: StatCard[] = [
        { icon: 'shopping_bag', label: 'Productos', value: '20', color: '#1976d2' },
        { icon: 'people', label: 'Usuarios', value: '10', color: '#388e3c' },
        { icon: 'receipt_long', label: 'Órdenes', value: '7', color: '#f57c00' },
        { icon: 'attach_money', label: 'Ventas del mes', value: '$1,240', color: '#7b1fa2' },
    ];
}