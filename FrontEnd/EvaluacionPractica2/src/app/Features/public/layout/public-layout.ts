import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_NAME } from '../../../Core/constants/app.constants';
import { Footer } from '../../../shared/components/footer/footer';
import { Header } from '../../../shared/components/header/header';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Navbar, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  readonly appName = APP_NAME; 
}
