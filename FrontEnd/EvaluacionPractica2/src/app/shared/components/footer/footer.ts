import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY_NAME } from '../../../Core/constants/app.constants';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  @Input({ required: true }) appName = '';

  readonly companyName = COMPANY_NAME;
  readonly currentYear = new Date().getFullYear();
}
