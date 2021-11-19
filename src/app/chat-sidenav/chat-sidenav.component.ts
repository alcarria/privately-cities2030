import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-chat-sidenav',
  templateUrl: './chat-sidenav.component.html',
  styleUrls: ['./chat-sidenav.component.css']
})
export class ChatSidenavComponent implements OnInit {

  @Input() addresses: string[] = [];

  @Output() changeAddress = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void { }

  public onClick(address: string) {
    this.changeAddress.emit(address)
  }

}
