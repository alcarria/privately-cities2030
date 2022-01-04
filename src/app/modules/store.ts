import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {environment} from "../../environments/environment";
// @ts-ignore
import Contact from "../../assets/contracts/Contact.json";

declare let window: any

@Injectable({
    providedIn: 'root'
})

// Store de address of the current user
export class Store {
    private currentAccountAddress: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

    getCurrentAccountAddress(): Observable<string|undefined> {
        return this.currentAccountAddress.asObservable()
    }

    getCurrentAccountAddressValue(): string {
        return this.currentAccountAddress.getValue() ?? ''
    }

    setCurrentAccountAddress(address: string|undefined): void {
        this.currentAccountAddress.next(address)
    }

    private async getCurrentAccountContactInfo(): Promise<any> {
        let contactContract = new window.web3.eth.Contract(
            Contact.abi,
            environment.contact_address
        )

        return await contactContract.methods.getContact(this.getCurrentAccountAddressValue()).call()
    }

    async hasValidAccount(): Promise<boolean> {
        let contactInfo = await this.getCurrentAccountContactInfo()
        return contactInfo.nickname != "" && contactInfo.publicKey != ""
    }

    async getCurrentAccountNickname(): Promise<string> {
        let contactInfo = await this.getCurrentAccountContactInfo()
        return contactInfo.nickname
    }

    async getCurrentAccountPublicKey(): Promise<string> {
        let contactInfo = await this.getCurrentAccountContactInfo()
        console.log(contactInfo)
        return contactInfo.publicKey
    }
}
