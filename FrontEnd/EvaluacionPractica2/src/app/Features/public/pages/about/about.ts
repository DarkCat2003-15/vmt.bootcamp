import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { COMPANY_NAME } from '../../../../Core/constants/app.constants';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MatCard],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly companyName = COMPANY_NAME;
}
