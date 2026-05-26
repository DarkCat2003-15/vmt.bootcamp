import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { Product } from '../../../Features/interfaces/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, MatCard, MatCardContent, MatCardImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
}
