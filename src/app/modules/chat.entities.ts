import {decrypt} from './encryption.module';
import {BehaviorSubject, Observable} from "rxjs";
import {ChangeDetectorRef} from '@angular/core';

export class DeadDropContact {

  private decrypted_seed: string | undefined

  private subscription: any | undefined;
  private messages: BehaviorSubject<MessageDeadDrop[]> = new BehaviorSubject<MessageDeadDrop[]>([]);

  constructor(private address: string, private encrypted_seed: string) {
  }

  public getAddress(): string {
    return this.address
  }

  public async getDecryptedSeed(): Promise<string> {
    if (this.decrypted_seed != undefined)
      return this.decrypted_seed
    this.decrypted_seed = await decrypt(this.encrypted_seed, '', 'x25519-xsalsa20-poly1305')
    return this.decrypted_seed
  }

  public getMessages(): Observable<MessageDeadDrop[]> {
    return this.messages.asObservable();
  }

  public addMessage(message: MessageDeadDrop): void {
    this.messages.next(
      [...this.messages.getValue(), message]
    )
  }

  public isSubscribed(): boolean {
    return this.subscription != undefined
  }

  public subscribe(eventEmitter: any): void {
    if (!this.isSubscribed()) {
      this.subscription = eventEmitter
    } else {
      throw 'A subcription already exists. Use isSubscribed() before attemping to subscribe'
    }
  }

  public unsubscribe(): void {
    if (this.isSubscribed()) {
      this.subscription.unsubscribe()
      this.subscription = undefined
    }
  }
}

export class GroupContact {

  private decrypted_pass: string | undefined

  private subscription: any | undefined;
  private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  constructor(private groupAddress: string, private encrypted_pass: string, private groupName: string) {
  }

  public getAddress(): string {
    return this.groupAddress
  }

  public getGroupName(): string {
    return this.groupName
  }

  public async getDecryptedKey(): Promise<string> {
    if (this.decrypted_pass != undefined)
      return this.decrypted_pass
    this.decrypted_pass = await decrypt(this.encrypted_pass, '', 'x25519-xsalsa20-poly1305')
    return this.decrypted_pass
  }

  public getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  public addMessage(message: Message): void {
    console.log('Añadir mensaje')
    this.messages.next(
      [...this.messages.getValue(), message]
    )
  }

  public isSubscribed(): boolean {
    return this.subscription != undefined
  }

  public subscribe(eventEmitter: any): void {
    if (!this.isSubscribed()) {
      this.subscription = eventEmitter
    } else {
      throw 'A subcription already exists. Use isSubscribed() before attemping to subscribe'
    }
  }

  public unsubscribe(): void {
    if (this.isSubscribed()) {
      this.subscription.unsubscribe()
      this.subscription = undefined
    }
  }
}

export class PrivateContact {

  private decrypted_pass: string | undefined

  private subscription: any | undefined;
  private messages: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>([]);

  constructor(private contactAddress: string, private encrypted_pass: string, private contactName: string) {
  }

  public getAddress(): string {
    return this.contactAddress
  }

  public async getDecryptedKey(): Promise<string> {
    if (this.decrypted_pass != undefined)
      return this.decrypted_pass
    this.decrypted_pass = await decrypt(this.encrypted_pass, '', 'x25519-xsalsa20-poly1305')
    return this.decrypted_pass
  }

  public getMessages(): Observable<Message[]> {
    return this.messages.asObservable();
  }

  public addMessage(message: Message): void {
    this.messages.next(
      [...this.messages.getValue(), message]
    )
  }

  public isSubscribed(): boolean {
    return this.subscription != undefined
  }

  public subscribe(eventEmitter: any): void {
    if (!this.isSubscribed()) {
      this.subscription = eventEmitter
    } else {
      throw 'A subcription already exists. Use isSubscribed() before attemping to subscribe'
    }
  }

  public unsubscribe(): void {
    if (this.isSubscribed()) {
      this.subscription.unsubscribe()
      this.subscription = undefined
    }
  }
}

export class Message {

  constructor(protected sender: string, protected timestamp: Date, protected message: string) {
  }

  public getSender(): string {
    return this.sender
  }

  public getTimestamp(): Date {
    return this.timestamp
  }

  public getMessage(): string {
    return this.message
  }

  public isEncrypted(): boolean {
    return false
  }

  public getTitle():string{
    return this.sender;
  }
}

export class MessageDeadDrop extends Message {

  private decryptedMessage: string | undefined = undefined

  constructor(sender: string, timestamp: Date, message: string, private cdr: ChangeDetectorRef) {
    super(sender, timestamp, message);
  }

  public getMessage(): string {
    return this.decryptedMessage ?? "Encrypted message (click)"
  }

  public async decryptMessage(): Promise<void> {
    if (this.decryptedMessage != undefined) return

    this.decryptedMessage = await decrypt(this.message, "", "x25519-xsalsa20-poly1305")
    this.cdr.detectChanges();
  }

  public isEncrypted(): boolean {
    return this.decryptedMessage == undefined
  }

  public getTitle():string{
    return this.timestamp.toDateString();
  }
}
