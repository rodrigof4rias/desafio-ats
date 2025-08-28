import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    RouterOutlet
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  readonly menus: Array<PoMenuItem> = [
    {label: 'Home', link: '/', icon: 'po-icon-home'},
    {label: 'Vagas', link: 'vagas', icon: 'po-icon-job'},
    {label: 'Portal do Candidato', icon: 'po-icon-job'},
    {label: 'Área CIEE', icon: 'po-icon-job'},
    {label: 'Cursos profissionalizantes', icon: 'po-icon-job'}
  ];

  private onClick() {
    alert('Clicked in menu item');
  }
}
