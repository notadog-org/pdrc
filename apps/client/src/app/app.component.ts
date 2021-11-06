import { Component, OnInit } from '@angular/core';
import { Orders } from './services/orders';

@Component({
  selector: 'pdrc-offline-first-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(ordersService: Orders) {}
  title = 'client';

  ngOnInit() {}
}
