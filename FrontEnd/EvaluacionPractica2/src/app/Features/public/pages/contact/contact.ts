import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MatButtonModule, MatCard, MatFormFieldModule, MatInputModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {}
