import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { Cart, CartProduct, CartPayload } from '../../../interfaces/cart.interface';
import { Product } from '../../../interfaces/product.interface';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-carts-management',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './carts-management.html',
  styleUrl: './carts-management.scss',
})
export class CartsManagement implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);

  readonly carts = signal<Cart[]>([]);
  readonly products = signal<Product[]>([]);
  readonly selectedCart = signal<Cart | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly cartTotal = computed(() =>
    this.carts().reduce((total, cart) => total + (cart.total ?? 0), 0),
  );

  readonly totalItems = computed(() =>
    this.carts().reduce((total, cart) => total + (cart.totalQuantity ?? 0), 0),
  );

  readonly createCartForm = this.fb.nonNullable.group({
    userId: [1, [Validators.required, Validators.min(1)]],
    productId: [1, [Validators.required, Validators.min(1)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  readonly addProductForm = this.fb.nonNullable.group({
    productId: [1, [Validators.required, Validators.min(1)]],
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.clearMessages();

    forkJoin({
      carts: this.cartService.getAll({ limit: 30 }),
      products: this.productService.getAll({ limit: 100 }),
    }).subscribe({
      next: ({ carts, products }) => {
        this.carts.set(carts.carts ?? []);
        this.products.set(products.products ?? []);
        this.resetProductControls();
        this.selectedCart.set(this.carts()[0] ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los carritos.');
        this.loading.set(false);
      },
    });
  }

  selectCart(cart: Cart): void {
    this.selectedCart.set(cart);
    this.clearMessages();
  }

  createCart(): void {
    if (this.createCartForm.invalid) {
      this.createCartForm.markAllAsTouched();
      return;
    }

    const value = this.createCartForm.getRawValue();
    const payload: CartPayload = {
      userId: Number(value.userId),
      products: [{ id: Number(value.productId), quantity: Number(value.quantity) }],
    };

    this.saving.set(true);
    this.clearMessages();

    this.cartService.create(payload).subscribe({
      next: (response) => {
        const cart = this.buildCartFromPayload(payload, Number(response.id) || Date.now());
        this.carts.update((carts) => [cart, ...carts]);
        this.selectedCart.set(cart);
        this.createCartForm.patchValue({ quantity: 1 });
        this.afterSave('Carrito creado correctamente.');
      },
      error: () => this.failSave('No se pudo crear el carrito.'),
    });
  }

  addProductToCart(): void {
    const cart = this.selectedCart();
    if (!cart) {
      this.errorMessage.set('Selecciona un carrito para agregar productos.');
      return;
    }

    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }

    const value = this.addProductForm.getRawValue();
    const productId = Number(value.productId);
    const quantity = Number(value.quantity);
    const mergedProducts = this.mergeProduct(cart.products, productId, quantity);
    const recalculatedCart = this.recalculateCart({ ...cart, products: mergedProducts });
    const payload: CartPayload = {
      userId: recalculatedCart.userId,
      products: recalculatedCart.products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    };

    this.saving.set(true);
    this.clearMessages();

    this.cartService.update(cart.id, payload).subscribe({
      next: () => {
        this.replaceCart(recalculatedCart);
        this.selectedCart.set(recalculatedCart);
        this.addProductForm.patchValue({ quantity: 1 });
        this.afterSave('Producto agregado al carrito.');
      },
      error: () => this.failSave('No se pudo agregar el producto al carrito.'),
    });
  }

  deleteCart(cart: Cart): void {
    const confirmed = window.confirm(`Eliminar el carrito #${cart.id}?`);
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.clearMessages();

    this.cartService.delete(cart.id).subscribe({
      next: () => {
        this.carts.update((carts) => carts.filter((item) => item.id !== cart.id));
        this.selectedCart.set(this.carts()[0] ?? null);
        this.successMessage.set('Carrito eliminado correctamente.');
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo eliminar el carrito.');
        this.loading.set(false);
      },
    });
  }

  productName(productId: number): string {
    return this.products().find((product) => product.id === productId)?.title ?? `Producto #${productId}`;
  }

  private mergeProduct(products: CartProduct[], productId: number, quantity: number): CartProduct[] {
    const exists = products.some((product) => product.id === productId);
    if (exists) {
      return products.map((product) =>
        product.id === productId
          ? this.enrichProduct({ ...product, quantity: product.quantity + quantity })
          : product,
      );
    }

    return [...products, this.enrichProduct({ id: productId, quantity })];
  }

  private buildCartFromPayload(payload: CartPayload, id: number): Cart {
    return this.recalculateCart({
      id,
      userId: payload.userId,
      products: payload.products.map((product) => this.enrichProduct(product)),
    });
  }

  private enrichProduct(product: Pick<CartProduct, 'id' | 'quantity'>): CartProduct {
    const catalogProduct = this.products().find((item) => item.id === product.id);
    const price = catalogProduct?.price ?? 0;

    return {
      id: product.id,
      title: catalogProduct?.title ?? `Producto #${product.id}`,
      price,
      quantity: product.quantity,
      discountPercentage: catalogProduct?.discountPercentage ?? 0,
      total: price * product.quantity,
    };
  }

  private recalculateCart(cart: Cart): Cart {
    const products = cart.products.map((product) => this.enrichProduct(product));
    const total = products.reduce((sum, product) => sum + (product.total ?? 0), 0);
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
    const discountedTotal = products.reduce((sum, product) => {
      const discount = product.discountPercentage ?? 0;
      return sum + (product.total ?? 0) * (1 - discount / 100);
    }, 0);

    return {
      ...cart,
      products,
      total,
      discountedTotal,
      totalProducts: products.length,
      totalQuantity,
    };
  }

  private replaceCart(cart: Cart): void {
    this.carts.update((carts) => carts.map((item) => (item.id === cart.id ? cart : item)));
  }

  private resetProductControls(): void {
    const firstProduct = this.products()[0];
    if (!firstProduct) {
      return;
    }

    this.createCartForm.patchValue({ productId: firstProduct.id });
    this.addProductForm.patchValue({ productId: firstProduct.id });
  }

  private afterSave(message: string): void {
    this.successMessage.set(message);
    this.saving.set(false);
  }

  private failSave(message: string): void {
    this.errorMessage.set(message);
    this.saving.set(false);
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
