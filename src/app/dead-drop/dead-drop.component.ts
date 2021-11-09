import {Component, OnInit} from '@angular/core';
import {DataExchangeService} from "../data-exchange.service";

@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})
export class DeadDropComponent implements OnInit {

  private dummy = new Map([['PEDRO', ['HOLA PEDRO', 'que tal??']], ['SERGIO', ['HOLA SERGIO', 'que tal??']], ['PACO', ['HOLA PACO', 'que tal??']]])

  constructor(public observable: DataExchangeService) {
  }

  ngOnInit(): void {
    this.observable.notify({'to': 'chat', 'parent': 'dead'})
    this.observable.notify({'to': 'sidebar', 'parent': 'dead'})

    this.observable.data$.subscribe(res => {
      if (res.to === 'dead') {
        console.log('Refresco happen y es para dead');
        console.log(res)
        this.observable.notify({'to': 'chat', 'address': res.address, 'message_list': this.dummy.get(res.address)})
      }
    })
  }

}
