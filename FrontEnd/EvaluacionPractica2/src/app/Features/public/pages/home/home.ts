import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Product } from '../../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCard, MatIconModule, ProductCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Productos destacados hardcodeados para el home
  readonly featuredProducts: Product[] = [
    {
      id: 1,
      title: 'Laptop Pro X15',
      description: 'Laptop para trabajo y estudio',
      price: 1299.99,
      category: 'laptops',
      thumbnail: 'https://picsum.photos/seed/featured1/300/300',
    },
    {
      id: 2,
      title: 'Auriculares Wireless',
      description: 'Sonido claro y batería de larga duración',
      price: 89.5,
      category: 'audio',
      thumbnail: 'https://picsum.photos/seed/featured2/300/300',
    },
    {
      id: 3,
      title: 'Smartwatch Fit',
      description: 'Monitorea tu actividad diaria',
      price: 199.0,
      category: 'wearables',
      thumbnail: 'https://picsum.photos/seed/featured3/300/300',
    },
    {
      id: 4,
      title: 'Monitor 27" 4K',
      description: 'Pantalla ideal para diseño y programación',
      price: 449.99,
      category: 'monitors',
      thumbnail: 'https://picsum.photos/seed/featured4/300/300',
    },
  ];

  readonly promotions = [
    {
      title: '20% en laptops',
      description: 'Válido hasta fin de mes en modelos seleccionados.',
      icon: 'laptop_mac',
    },
    {
      title: 'Envío gratis',
      description: 'En compras mayores a $150 en todo el catálogo.',
      icon: 'local_shipping',
    },
    {
      title: 'Combo gamer',
      description: 'Teclado + mouse + audífonos con precio especial.',
      icon: 'sports_esports',
    },
  ];
}
