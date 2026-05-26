import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../../interfaces/public/public-interfaces';

@Component({
    selector: 'app-product-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './product-form.component.html',
    styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<ProductFormComponent>);
    data: Product = inject(MAT_DIALOG_DATA);

    isEdit = false;

    categories = [
        "men's clothing",
        "women's clothing",
        'electronics',
        'jewelery',
    ];

    form = this.fb.group({
        title: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0.01)]],
        description: ['', Validators.required],
        category: ['', Validators.required],
        image: ['', Validators.required],
    });

    ngOnInit() {
        if (this.data) {
            this.isEdit = true;
            this.form.patchValue(this.data);
        }
    }

    onSubmit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.dialogRef.close(this.form.value);
    }

    onCancel() {
        this.dialogRef.close();
    }
}