import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DatabaseService } from './services/database';
import { OrderService } from './services/orders';
import { AuthService } from './services/auth';
import { SettingsService } from './services/settings';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    FormsModule,
  ],
  providers: [SettingsService, OrderService, AuthService, DatabaseService],
  bootstrap: [AppComponent],
})
export class AppModule {}
