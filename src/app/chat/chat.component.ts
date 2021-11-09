import {Component, OnInit} from '@angular/core';
import {DataExchangeService} from "../data-exchange.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  public message_list = ['Here going your', 'messages'];
  public address = 'TITULO';
  private first = true;

  constructor(public observable: DataExchangeService) {
  }

  ngOnInit(): void {
    this.observable.data$.subscribe(res => {
      if (res.to === 'chat') {
        console.log('Refresco happen para chat');
        console.log(res);
        this.address = res.title;
        if (this.first) {
          this.message_list = res.message_list;
        } else {
          for (let message in res.message_list) {
            this.message_list.push(message);
          }
        }
        console.log(this.message_list);
      }
    })
  }

}
