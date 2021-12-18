import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Store } from '../modules/store';

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  @Input() addresses: string[] = [];
  @Input() selected: String|undefined = undefined;

  @Output() changeAddress = new EventEmitter<string>();
  @Output() newChat = new EventEmitter<string>();

  constructor(public store: Store) {
  }

  ngOnInit(): void { }

  public onClick(address: string) {
    this.changeAddress.emit(address)
  }

  onNewChat(): void {
    this.newChat.emit()
  }
}
