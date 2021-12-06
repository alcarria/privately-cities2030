import { DeadDropContact, Message } from "./chat.entities";

// @ts-ignore
import DeadDropContract from '../../assets/contracts/DeadDrop.json'
import { environment } from "src/environments/environment";
import { Store } from "./store";
import { ChangeDetectorRef } from "@angular/core";
import { decrypt, encrypt } from "./encryption.module";
import getToken from "totp-generator";

declare let window: any;

export class DeadDropController {

    private contract: any;

    private contacts: DeadDropContact[] = [];
    private shareSeedSubscriber: any;

    private sendMessageSubscriptions: Map<string, any> = new Map<string, any>()
    
    constructor(private currentAddress: string, private cdr: ChangeDetectorRef) {
        this.contract = new window.web3.eth.Contract(
            DeadDropContract.abi,
            environment.deaddrop_address
        )
        
        // Get list  of all contacts
        this.shareSeedSubscriber = this.contract.events.ShareSeed({
            fromBlock: 0
          }, (error: any, event: any) => this.onShareSeed(error, event))
    }

    destroy() {
        // Unsubscribe contact messages
        for (const contact of this.contacts) {
            contact.unsubscribe();
        }

        // Unsubscribe ShareSeed event
        if (this.shareSeedSubscriber != undefined) {
            this.shareSeedSubscriber.unsubscribe()
        }
    }

    // Cuando llega una semilla la añadimos a la lista de semillas
    private async onShareSeed(error: any, event: any): Promise<void> {
        if (error !== null)
        throw error

        // Check if the message is for me
        if (event.returnValues.to.toLowerCase() == this.currentAddress.toLowerCase()) {
        const from = String(event.returnValues.from)
        const encrypted_seed = event.returnValues.to_seed
        this.contacts.push(new DeadDropContact(from, encrypted_seed))
        } else if (event.returnValues.from.toLowerCase() == this.currentAddress.toLowerCase()) {
        const to = String(event.returnValues.to)
        const encrypted_seed = event.returnValues.from_seed
        this.contacts.push(new DeadDropContact(to, encrypted_seed))
        }
        this.cdr.detectChanges();
    }

    async sendMessage(selectedContact: DeadDropContact, message: any): Promise<void> {
        let contactPublicKey = await this.contract.methods.getPublicKey(selectedContact.getAddress()).call()
        let encryptedMessage = encrypt(message, contactPublicKey, 'x25519-xsalsa20-poly1305')
        const timestamp = Date.now()
    
        const decrypted_seed: string = await selectedContact.getDecryptedSeed()
        const token = getToken(decrypted_seed, {
          digits: 128,
          algorithm: 'SHA-512',
          period: 60,
          // @ts-ignore
          timestamp: Number(timestamp)
        })
        // Enviarlo a la red
        this.contract.methods.sendMessage(token, timestamp, encryptedMessage).send({from: this.currentAddress})
          .then((receipt: any) => {
    
        })
    }

    subscribeToSendMessage(address: string): void {
        if (this.sendMessageSubscriptions.has(address))
            this.sendMessageSubscriptions.get(address).unsubscribe();
        
        this.sendMessageSubscriptions.set(
            address,
            this.contract.events.SendMessage({
                filter: {'from': address},
                fromBlock: 0
              }, (error: any, event: any) => this.onMessageEvent(error, event))
        )
    }

    private async onMessageEvent(error: any, event: any): Promise<void> {
        // Check errors
        if (error !== null)
          throw error
    
        // Check if the message is for me
        if (!this.isTheMessageForMe(event)) return
    
        // Decrypt message
        console.log(event.returnValues.message)
        let message = await decrypt(event.returnValues.message, 'x25519-xsalsa20-poly1305')
    
        // Add message to the corresponding chat
        let from = event.returnValues.from
    
        const contact = this.getContact(from)
    
        if (contact == undefined)
          throw 'contact is undefined'
    
        contact.addMessage(new Message(from, new Date(Number(event.returnValues.timestamp)), message))
    }

    private isTheMessageForMe(event: any): boolean {
        const from = String(event.returnValues.from)
    
        if (this.getContact(from) == undefined) return false;
    
          // @ts-ignore
        const token = getToken(this.contacts.get(from)?.decrypted_seed, {
          digits: 64,
          algorithm: 'SHA-512',
          period: 60,
          // @ts-ignore
          timestamp: Number(event.returnValues.timestamp)
        })
    
        return event.returnValues.totp == token
    }

    getContacts(): DeadDropContact[] {
        return this.contacts
    }

      // Create a new chat
    async newChat(address: any): Promise<void> {
        const destinationAddress = address.value
        const token_seed: string = 'ALFABETO' // todo hacer semilla aleatoria

        let myPublicKey = await this.contract.methods.getPublicKey(this.currentAddress).call()
        let contactPublicKey = await this.contract.methods.getPublicKey(destinationAddress).call()

        const from_seed = encrypt(token_seed, myPublicKey, 'x25519-xsalsa20-poly1305')
        const to_seed = encrypt(token_seed, contactPublicKey, 'x25519-xsalsa20-poly1305')

        this.contract.methods.shareSeed(destinationAddress, from_seed, to_seed).send({from: this.currentAddress})
        .then(((receipt: any) => {
            
        }))
    }

    getContact(address: string): DeadDropContact|undefined {
        for (let contact of this.contacts) {
          if (contact.getAddress() == address)
            return contact
        }
        return undefined
      }
}