import {Component, Input, OnInit} from '@angular/core';
import {DataExchangeService} from "../data-exchange.service";

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  @Input() addresses: string[] = [];

  constructor(public observable: DataExchangeService) {
  }

  ngOnInit(): void {
  }

  public onClick(address: string) {
    this.observable.notify({'to': 'dead', 'address': address});
  }

}
