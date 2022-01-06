import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {environment} from "../../environments/environment";
// @ts-ignore
import Contact from "../../assets/contracts/Contact.json";

declare let window: any

interface Account {
    address: string,
    nickname: string,
    publicKey: string
}

// Store de address of the current user
@Injectable({
    providedIn: 'root'
})
export class Store {

    private currentAccount: BehaviorSubject<Account> = new BehaviorSubject<Account>({
        address: '',
        nickname: '',
        publicKey: ''
    });

    getCurrentAccount(): Observable<Account> {
        return this.currentAccount
    }

    getCurrentAccountValue(): Account {
        return this.currentAccount.getValue()
    }

    getCurrentAccountAddressValue(): string {
        return this.currentAccount.getValue()?.address ?? ''
    }

    async setCurrentAccount(address: string) {
        if (address == '') {
            this.currentAccount.next({
                address: '',
                nickname: '',
                publicKey: ''
            })
        } else {
            console.log(address)
            let contactContract = new window.web3.eth.Contract(
                Contact.abi,
                environment.contact_address
            )
    
            let contactInfo = await contactContract.methods.getContact(address).call()
            this.currentAccount.next({
                address: address,
                nickname: contactInfo.nickname,
                publicKey: contactInfo.publicKey
            })
        }
    }

    hasValidAccount(): boolean {
        console.log("pepe1: " + this.currentAccount.getValue().address)

        if (this.currentAccount.getValue().address == "")
            return false
        
        if ( this.currentAccount.getValue().nickname == "")
            return false

        console.log("pepe2: " + this.currentAccount.getValue().nickname)
        
        if (this.currentAccount.getValue().publicKey == "")
            return false

        console.log("pepe3: " + this.currentAccount.getValue().publicKey)

        return true
    }
}
