import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input({ required: true }) appName = '';

  readonly currentYear = new Date().getFullYear();
}
