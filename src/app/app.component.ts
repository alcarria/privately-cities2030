import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from '@angular/platform-browser';
declare const window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'privately';

  constructor(private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    window.web3 = new window.Web3(window.ethereum);

    this.matIconRegistry.addSvgIcon(
      "metamask-fox-wordmark-stacked",
      sanitizer.bypassSecurityTrustResourceUrl("/assets/icons/metamask-fox-wordmark-stacked.svg")
    );
  }
}
