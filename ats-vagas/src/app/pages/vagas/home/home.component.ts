import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PoPageModule, PoWidgetModule, PoButtonModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PoPageModule, PoWidgetModule, PoButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  // Função para navegar para a página de vagas
  navigateToVagas() {
    this.router.navigate(['/vagas']);
  }
}
