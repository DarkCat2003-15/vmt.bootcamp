import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductCard } from '../../../../shared/components/product-card/product-card';
import { Product } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [MatProgressSpinnerModule, ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);


  readonly products = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getAll().subscribe({
      next: (response) => {
        this.products.set(response.products ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los productos. Intenta de nuevo más tarde.');
        this.loading.set(false);
      },
    });
  }
}
