import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HomeModule } from './pages/home/home.module';
import { LoginModule } from './pages/login/login.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginModule, HomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fontend-angular-app';
}
