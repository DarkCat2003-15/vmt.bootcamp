import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './public-footer-component.html',
  styleUrl: './public-footer-component.scss',
})
export class PublicFooterComponent {
  year = new Date().getFullYear();
}