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
import { Product, ProductPayload } from '../../../interfaces/product.interface';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-products-management',
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
  templateUrl: './products-management.html',
  styleUrl: './products-management.scss',
})
export class ProductsManagement implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly searchTerm = signal('');
  readonly categoryFilter = signal('all');
  readonly formOpen = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.categoryFilter();

    return this.products().filter((product) => {
      const matchesTerm =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesTerm && matchesCategory;
    });
  });

  readonly totalStock = computed(() =>
    this.products().reduce((total, product) => total + (product.stock ?? 0), 0),
  );

  readonly inventoryValue = computed(() =>
    this.products().reduce(
      (total, product) => total + product.price * (product.stock ?? 0),
      0,
    ),
  );

  readonly productForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(8)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['electronics', [Validators.required]],
    thumbnail: ['https://picsum.photos/seed/novamarket-new/300/300', [Validators.required]],
    stock: [1, [Validators.required, Validators.min(0)]],
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService.getAll({ limit: 100 }).subscribe({
      next: (response) => {
        const products = response.products ?? [];
        this.products.set(products);
        this.categories.set(this.extractCategories(products));
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudieron cargar los productos.');
        this.loading.set(false);
      },
    });

    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.value?.length) {
          this.categories.set(response.value);
        }
      },
    });
  }

  startCreate(): void {
    this.editingProduct.set(null);
    this.productForm.reset({
      title: '',
      description: '',
      price: 0,
      category: this.categories()[0] ?? 'electronics',
      thumbnail: 'https://picsum.photos/seed/novamarket-new/300/300',
      stock: 1,
    });
    this.formOpen.set(true);
    this.clearMessages();
  }

  startEdit(product: Product): void {
    this.editingProduct.set(product);
    this.productForm.reset({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      thumbnail: product.thumbnail,
      stock: product.stock ?? 0,
    });
    this.formOpen.set(true);
    this.clearMessages();
  }

  cancelForm(): void {
    this.formOpen.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
    this.clearMessages();
  }

  submitProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    const editing = this.editingProduct();
    this.saving.set(true);
    this.clearMessages();

    if (editing) {
      this.productService.update(editing.id, payload).subscribe({
        next: (response) => {
          const updated: Product = { ...editing, ...payload, ...response, id: editing.id };
          this.products.update((products) =>
            products.map((product) => (product.id === editing.id ? updated : product)),
          );
          this.afterSave('Producto actualizado correctamente.');
        },
        error: () => this.failSave('No se pudo actualizar el producto.'),
      });
      return;
    }

    this.productService.create(payload).subscribe({
      next: (response) => {
        const id = Number(response.id) || Date.now();
        const created: Product = { ...payload, ...response, id };
        this.products.update((products) => [created, ...products]);
        this.categories.set(this.extractCategories(this.products()));
        this.afterSave('Producto creado correctamente.');
      },
      error: () => this.failSave('No se pudo crear el producto.'),
    });
  }

  deleteProduct(product: Product): void {
    const confirmed = window.confirm(`Eliminar "${product.title}" del catalogo?`);
    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.clearMessages();

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products.update((products) => products.filter((item) => item.id !== product.id));
        this.categories.set(this.extractCategories(this.products()));
        this.successMessage.set('Producto eliminado correctamente.');
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('No se pudo eliminar el producto.');
        this.loading.set(false);
      },
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  setCategoryFilter(category: string): void {
    this.categoryFilter.set(category);
  }

  stockLabel(product: Product): string {
    const stock = product.stock ?? 0;
    if (stock === 0) {
      return 'Sin stock';
    }
    if (stock < 25) {
      return 'Stock bajo';
    }
    return 'Disponible';
  }

  stockClass(product: Product): string {
    const stock = product.stock ?? 0;
    if (stock === 0) {
      return 'danger';
    }
    if (stock < 25) {
      return 'warning';
    }
    return 'success';
  }

  private buildPayload(): ProductPayload {
    const value = this.productForm.getRawValue();
    return {
      title: value.title.trim(),
      description: value.description.trim(),
      price: Number(value.price),
      category: value.category,
      thumbnail: value.thumbnail.trim(),
      stock: Number(value.stock),
    };
  }

  private afterSave(message: string): void {
    this.successMessage.set(message);
    this.saving.set(false);
    this.formOpen.set(false);
    this.editingProduct.set(null);
    this.productForm.reset();
  }

  private failSave(message: string): void {
    this.errorMessage.set(message);
    this.saving.set(false);
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private extractCategories(products: Product[]): string[] {
    return Array.from(new Set(products.map((product) => product.category))).sort();
  }
}
