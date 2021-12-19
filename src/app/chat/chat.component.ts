import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../modules/chat.entities';
import { Store } from '../modules/store';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @Input() public messagesObservable: Observable<Message[]> = new Observable<Message[]>()
  @Input() public address = 'Destination'

  @Output() public onMessage = new EventEmitter<string>()

  public messages: Message[] = []

  constructor(public store: Store, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscribeToMessages();
  }

  subscribeToMessages() {
    this.messagesObservable.subscribe(value => {
      this.messages = value
    })
  }

  sendMessage($event: any, message: any): void {
    $event.preventDefault()
    this.onMessage.emit(message.value)
    message.value = ""
  }

}
