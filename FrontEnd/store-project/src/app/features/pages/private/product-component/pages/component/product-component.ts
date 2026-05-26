import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { ProductPayload } from '../../../../../interfaces/private/product.interface';
import { Product } from '../../../../../interfaces/public/public-interfaces';
import { ProductService } from '../../../../../services/private/product.service';
import { ProductFormComponent } from '../form/product-form.component';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        CurrencyPipe,
        SlicePipe,
    ],
    templateUrl: './product-component.html',
    styleUrl: './product-component.scss',
})
export class ProductsComponent implements OnInit {
    private productService = inject(ProductService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    products = signal<Product[]>([]);
    loading = signal(true);

    displayedColumns = ['image', 'title', 'category', 'price', 'rating', 'actions'];

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts() {
        this.loading.set(true);
        this.productService.getAll().subscribe({
            next: (data) => { this.products.set(data); this.loading.set(false); },
            error: () => this.loading.set(false),
        });
    }

    openCreate() {
        const ref = this.dialog.open(ProductFormComponent, {
            data: null,
            width: '560px',
        });

        ref.afterClosed().subscribe((payload: ProductPayload) => {
            if (!payload) return;
            this.productService.create(payload).subscribe({
                next: (created) => {
                    this.products.update((list) => [...list, { ...created, id: Date.now() }]);
                    this.snackBar.open('Producto creado', 'Cerrar', { duration: 3000 });
                },
                error: () => this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 }),
            });
        });
    }

    openEdit(product: Product) {
        const ref = this.dialog.open(ProductFormComponent, {
            data: product,
            width: '560px',
        });

        ref.afterClosed().subscribe((payload: ProductPayload) => {
            if (!payload) return;
            this.productService.update(product.id, payload).subscribe({
                next: (updated) => {
                    this.products.update((list) =>
                        list.map((p) => (p.id === product.id ? { ...updated, id: product.id } : p))
                    );
                    this.snackBar.open('Producto actualizado', 'Cerrar', { duration: 3000 });
                },
                error: () => this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 }),
            });
        });
    }

    delete(product: Product) {
        if (!confirm(`¿Eliminar "${product.title}"?`)) return;
        this.productService.delete(product.id).subscribe({
            next: () => {
                this.products.update((list) => list.filter((p) => p.id !== product.id));
                this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
            },
            error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 }),
        });
    }
}