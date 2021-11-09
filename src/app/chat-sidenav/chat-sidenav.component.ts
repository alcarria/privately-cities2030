import {Component, OnInit} from '@angular/core';
import {DataExchangeService} from "../data-exchange.service";

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  public addresses = ['PEDRO', 'SERGIO', 'PACO'];
  private parent = ''

  constructor(public observable: DataExchangeService) {
  }

  ngOnInit(): void {
    this.observable.data$.subscribe(resul => {
      if (resul.to === 'sidebar') {
        this.parent = resul.parent;
      }
    })
  }

  public onClick(address: string) {
    this.observable.notify({'to': this.parent, 'address': address});
  }

}
