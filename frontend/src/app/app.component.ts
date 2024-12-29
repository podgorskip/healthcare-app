import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { APP_PROVIDERS } from './providers/Providers';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [APP_PROVIDERS],
  imports: [NavbarComponent, RouterOutlet, FormsModule, HttpClientModule]

})
export class AppComponent {
  title = 'Med-help';

}
