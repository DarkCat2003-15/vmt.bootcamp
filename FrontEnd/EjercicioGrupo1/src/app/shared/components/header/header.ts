import { Component, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-header',
  imports: [FaIconComponent, MatToolbarModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input({ required: true }) appName = '';

  readonly faFacebook = faFacebook;
  readonly faGithub = faGithub;
  readonly faInstagram = faInstagram;
}
