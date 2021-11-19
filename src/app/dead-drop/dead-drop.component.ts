import {Component, OnInit} from '@angular/core';
import { environment } from '../../environments/environment';

import { encrypt, decrypt } from '../modules/encryption.module'

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
  private dummy: Map<string, string[]> = new Map([['PEDRO', ['HOLA PEDRO', 'que tal??']], ['SERGIO', ['HOLA SERGIO', 'que tal??']], ['PACO', ['HOLA PACO', 'que tal??']]])

  private contract = new window.web3.eth.Contract(
    DeadDrop.abi,
    environment.deaddrop_address
  )

  constructor() { }

  ngOnInit(): void {
    console.log('onInit: ' + this.dummy)
    console.log('Holaaaa')
    this.contract.events.SendMessage({
      fromBlock: 0
    }, (error: any, event: any) => this.onMessageEvent(error, event))
  }

  onMessageEvent(error: any, event: any): void {
    let to = String(event.returnValues.to)
    
    // @ts-ignore
    let messages: string[] = this.dummy.get(to) == undefined ? [] : this.dummy.get(to)

    if (messages == undefined) messages = []

    messages.push(event.returnValues.message)

    this.dummy.set(to, messages)
    console.log(event.returnValues.message)
  }

  newChat(): void {
    console.log(this.dummy)
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
    let encryptedMessage = encrypt(message, '', {})
    // Enviarlo a la red
    let addresses = await window.ethereum.request({ method: 'eth_accounts' });
    this.contract.methods.sendMessage(this.selectedAddress, encryptedMessage).send({from: addresses[0]})
      .then((receipt: any) => {
        console.log(receipt)
      })
  }
}
