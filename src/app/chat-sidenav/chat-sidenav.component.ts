import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Store} from '../modules/store';

interface CardInfo {
  title: string
  data: any
}

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  @Input() cards: CardInfo[] = [];
  @Input() selected: any = undefined;

  @Output() changeAddress = new EventEmitter<string>();
  @Output() newChat = new EventEmitter<string>();

  constructor(public store: Store) {
  }

  ngOnInit(): void {
  }

  public onClick(address: string) {
    this.changeAddress.emit(address)
  }

  onNewChat(): void {
    this.newChat.emit()
  }
}
