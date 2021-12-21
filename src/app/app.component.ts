import {Component} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from '@angular/platform-browser';
import {Store} from './modules/store';

declare const window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'privately';

  constructor(private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer, private store: Store) {
    window.web3 = new window.Web3(window.ethereum);

    this.matIconRegistry.addSvgIcon(
      "metamask-fox-wordmark-stacked",
      sanitizer.bypassSecurityTrustResourceUrl("/assets/icons/metamask-fox-wordmark-stacked.svg")
    );


    // Load account
    window.ethereum.request({method: 'eth_accounts'}).then((accounts: any) => store.setCurrentAccountAddress(accounts[0]))
    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
      console.log('Accounts changed')
      console.log(accounts[0])
      store.setCurrentAccountAddress(accounts[0])
    });
  }
}
