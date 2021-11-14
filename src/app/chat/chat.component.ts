import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @Input() public message_list = ['Here going your', 'messages'];

  @Output() public onMessage = new EventEmitter<string>()

  public address = 'TITULO';
  private parent = ''

  constructor() {
  }

  ngOnInit(): void { }

  sendMessage($event: any, message: any): void {
    $event.preventDefault()
    this.onMessage.emit(message.value)
    message.value = ""
  }

}
