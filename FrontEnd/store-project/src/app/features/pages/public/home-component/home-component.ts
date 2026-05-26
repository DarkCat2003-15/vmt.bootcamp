import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Feature, Product } from '../../../interfaces/public/public-interfaces';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatChipsModule,
        CurrencyPipe,
        SlicePipe,
    ],
    templateUrl: './home-component.html',
    styleUrl: './home-component.scss',
})
export class HomeComponent {

    features: Feature[] = [
        { icon: 'local_shipping', title: 'Envío rápido', desc: 'Recibe tus pedidos en tiempo récord.', color: '#1976d2' },
        { icon: 'verified', title: 'Calidad garantizada', desc: 'Todos los productos verificados.', color: '#388e3c' },
        { icon: 'support_agent', title: 'Soporte 24/7', desc: 'Estamos aquí para ayudarte siempre.', color: '#f57c00' },
        { icon: 'lock', title: 'Pagos seguros', desc: 'Transacciones 100% protegidas.', color: '#7b1fa2' },
    ];

    products = signal<Product[]>([
        {
            id: 1,
            title: 'Mochila Urbana Impermeable',
            price: 49.99,
            description: 'Mochila resistente al agua ideal para el día a día.',
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/81fAn2X7mL._AC_UY879_.jpg',
            rating: { rate: 4.5, count: 120 },
        },
        {
            id: 2,
            title: 'Auriculares Bluetooth Pro',
            price: 89.99,
            description: 'Sonido de alta fidelidad con cancelación de ruido.',
            category: 'electronics',
            image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
            rating: { rate: 4.7, count: 340 },
        },
        {
            id: 3,
            title: 'Reloj Minimalista Acero',
            price: 129.99,
            description: 'Diseño elegante con correa de acero inoxidable.',
            category: 'jewelery',
            image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg',
            rating: { rate: 4.3, count: 95 },
        },
        {
            id: 4,
            title: 'Camiseta Premium Algodón',
            price: 19.99,
            description: 'Algodón 100% orgánico, suave y transpirable.',
            category: "men's clothing",
            image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
            rating: { rate: 4.1, count: 200 },
        },
        {
            id: 5,
            title: 'Lámpara de Escritorio LED',
            price: 34.99,
            description: 'Luz ajustable con puerto USB de carga integrado.',
            category: 'electronics',
            image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg',
            rating: { rate: 4.6, count: 178 },
        },
        {
            id: 6,
            title: 'Collar Dorado Minimalista',
            price: 24.99,
            description: 'Chapado en oro de 18k, hipoalergénico.',
            category: 'jewelery',
            image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg',
            rating: { rate: 4.2, count: 60 },
        },
        {
            id: 7,
            title: 'Vestido Floral Verano',
            price: 39.99,
            description: 'Tela liviana con estampado floral, talla única.',
            category: "women's clothing",
            image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg',
            rating: { rate: 4.4, count: 145 },
        },
        {
            id: 8,
            title: 'Disco Duro Externo 1TB',
            price: 64.99,
            description: 'Almacenamiento portátil USB 3.0 de alta velocidad.',
            category: 'electronics',
            image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
            rating: { rate: 4.8, count: 412 },
        },
    ]);
}