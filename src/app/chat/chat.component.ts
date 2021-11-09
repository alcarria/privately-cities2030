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
  private parent = ''

  constructor(public observable: DataExchangeService) {
  }

  ngOnInit(): void {
    this.observable.data$.subscribe(resul => {
      if (resul.to === 'sidebar') {
        this.parent = resul.parent;
      }
    })

    this.observable.data$.subscribe(res => {
      if (res.to === 'chat') {
        console.log('Refresco happen para chat');
        console.log(res);

        // Si se detecta un cambio de conversacion entonces se reinician las variables
        if (this.address !== res.address) {
          this.message_list = [...res.message_list];
          this.address = res.address;
        } else {
          if (!Array.isArray(res.message_list))
            this.message_list.push(res.message_list);
          else
            res.message_list.forEach((message: string) =>{
              this.message_list.push(message);
            })
        }
      }
    })
  }

}
