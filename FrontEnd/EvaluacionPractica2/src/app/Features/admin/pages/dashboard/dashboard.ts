import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { Cart } from '../../../interfaces/cart.interface';
import { Product } from '../../../interfaces/product.interface';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly currentUser = this.authService.currentUser;
  readonly products = signal<Product[]>([]);
  readonly carts = signal<Cart[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly inventoryValue = computed(() =>
    this.products().reduce(
      (total, product) => total + product.price * (product.stock ?? 0),
      0,
    ),
  );

  readonly lowStockProducts = computed(() =>
    this.products().filter((product) => (product.stock ?? 0) < 25).length,
  );

  readonly cartRevenue = computed(() =>
    this.carts().reduce((total, cart) => total + (cart.total ?? 0), 0),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    forkJoin({
      products: this.productService.getAll({ limit: 50 }),
      carts: this.cartService.getAll({ limit: 30 }),
    }).subscribe({
      next: ({ products, carts }) => {
        this.products.set(products.products ?? []);
        this.carts.set(carts.carts ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los indicadores del dashboard.');
        this.loading.set(false);
      },
    });
  }
}
