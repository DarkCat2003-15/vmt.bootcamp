import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../features/services/private/auth.service';

interface NavItem {
    icon: string;
    label: string;
    route: string;
}

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatTooltipModule,
    ],
    templateUrl: './private-layout.html',
    styleUrl: './private-layout.scss',
})
export class AdminLayoutComponent {
    private auth = inject(AuthService);
    private router = inject(Router);

    collapsed = signal(false);

    navItems: NavItem[] = [
        { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
        { icon: 'shopping_bag', label: 'Productos', route: '/admin/products' }
    ];

    toggle() {
        this.collapsed.set(!this.collapsed());
    }

    logout() {
        this.auth.logout(this.router);
    }
}