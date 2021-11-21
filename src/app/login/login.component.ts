import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
// @ts-ignore
import DeadDrop from "../../assets/contracts/DeadDrop.json";
import {environment} from "../../environments/environment";

declare let window: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private contract = new window.web3.eth.Contract(
    DeadDrop.abi,
    environment.deaddrop_address
  )

  metamask_accounts = ""
  loading = false
  error = ""

  constructor(private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const permissions = await window.ethereum.request({method: 'wallet_getPermissions'});
    this.metamask_accounts = await window.ethereum.request({method: 'eth_accounts'});

    if (Array.isArray(permissions) && permissions.length) {
      console.log('DApp permissions:')
      console.log(permissions[0])
    }
  }

  onLogin(): void {
    //TODO: añadir demas contratos
    this.loading = true

    //Solicitamos que inicie sesion con Metamask
    window.ethereum
      .request({
        method: 'eth_requestAccounts'
      })
      .then((result: any) => {
        let publicKey = ""
        // Cuando ha iniciado sesion le pedimos permiso para añadir la publica al contrato
        window.ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [this.metamask_accounts[0]]
        })
          .then((result: any) => {
            publicKey = result;
            //Comprobamos si la clave publica esta en el contrato
            this.contract.methods.getPublicKey(this.metamask_accounts[0]).call().then((result: any) => {
              console.log(result)
              if (result !== publicKey) {
                //Si no esta, la añadimos
                this.contract.methods.setPublicKey(this.metamask_accounts[0], publicKey).send({from: this.metamask_accounts[0]})
                  .then((result: any) => {
                    //Cuando se ha añadido su clave publica al contrato se sigue adelante en el proceso de login
                    this.router.navigate(['dead-drop'])
                  })
              } else {
                //Si esta, no la añadimos
                this.router.navigate(['dead-drop'])
              }
            })

          })
      })
      .catch((error: any) => {
        console.log(error)
        this.error = "No se ha podido conectar con MetaMask."
      })
      .finally(() => {
        this.loading = false
      });
  }
}
