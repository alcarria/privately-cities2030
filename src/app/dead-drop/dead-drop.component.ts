import {Component, OnInit} from '@angular/core';
// @ts-ignore
import DeadDrop from '../../assets/contracts/DeadDrop.json'
declare const window: any;

@Component({
  selector: 'app-dead-drop',
  templateUrl: './dead-drop.component.html',
  styleUrls: ['./dead-drop.component.css']
})
export class DeadDropComponent implements OnInit {

  private selectedAddress = 'PEDRO'
  private dummy = new Map([['PEDRO', ['HOLA PEDRO', 'que tal??']], ['SERGIO', ['HOLA SERGIO', 'que tal??']], ['PACO', ['HOLA PACO', 'que tal??']]])

  private contract = new window.web3.eth.Contract(
    DeadDrop.abi,
    '0x489aDF7082939e60b407C8E75c472D7e3500832e'
  )

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    
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

  async sendMessage(message: any): Promise<void> {
    // todo
    // Enviarlo a la red
    let addresses = await window.ethereum.request({ method: 'eth_accounts' });
    this.contract.methods.sendMessage(this.selectedAddress, message).send({from: addresses[0]})
      .then((receipt: any) => {
        console.log(receipt)
      })
  }
}
