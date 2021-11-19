import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @Input() public message_list = ['Here going your', 'messages'];
  @Input() public address = 'Destination'

  @Output() public onMessage = new EventEmitter<string>()

  constructor() {
  }

  ngOnInit(): void { }

  sendMessage($event: any, message: any): void {
    $event.preventDefault()
    this.onMessage.emit(message.value)
    message.value = ""
  }

}
