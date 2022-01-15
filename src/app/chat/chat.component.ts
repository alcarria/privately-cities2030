import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, TemplateRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../modules/chat.entities';
import {Store} from '../modules/store';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {

  @Input() public title: string = ''
  @Input() public messagesObservable: Observable<Message[]> = new Observable<Message[]>()

  @Input() public toolbarOptions: TemplateRef<any> | null = null

  @Output() public onMessage = new EventEmitter<string>()

  public messages: Message[] = []
  private subscription: any;

  constructor(public store: Store, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.subscription = this.subscribeToMessages();
  }

  ngOnChanges(): void {
    if (this.subscription != undefined)
      this.subscription.unsubscribe()
    this.subscription = this.subscribeToMessages();
  }

  subscribeToMessages() {
    return this.messagesObservable.subscribe(value => {
      this.messages = value
    })
  }

  sendMessage($event: any, message: any): void {
    $event.preventDefault()
    this.onMessage.emit(message.value)
    message.value = ""
  }

}
