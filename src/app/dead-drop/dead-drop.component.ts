import {Component, OnInit} from '@angular/core';
declare const window: any;

@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})
export class DeadDropComponent implements OnInit {

  private selectedAddress = 'PEDRO'
  private dummy = new Map([['PEDRO', ['HOLA PEDRO', 'que tal??']], ['SERGIO', ['HOLA SERGIO', 'que tal??']], ['PACO', ['HOLA PACO', 'que tal??']]])

  constructor() {
  }

  async ngOnInit(): Promise<void> { 
    console.log('Esta Web3 cargado?: '+ window.web3);
  }

  newChat(): void {
    this.dummy.set('Chat ' + this.dummy.size, [])
  }

  getAddresses(): string[] {
    return [...this.dummy.keys()];
  }

  setSelectedAddress(address: string): void {
    this.selectedAddress = address
  }

  getMessagesSelected(): any {
    return this.dummy.get(this.selectedAddress)
  }

  sendMessage(message: any): void {
    // todo
    // Enviarlo a la red
    console.log(window.web3)
  }
}
