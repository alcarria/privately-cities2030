# Privately
Project that implements a messaging application using blockchain to keep user data safe.
This project is an adaptation of the initial work of GISAI-UPM collaborators: Arturo Holgado Moreno and Diego Gutierrez Santamarta.

## Requisitos de instalación
Before running the repository, the following tools must be installed::
* Node.js: is developed in version 14.18.0 Link: <https://nodejs.org/download/release/v14.18.0/>
* Ganache: developed in version 2.5.4. Link: Enlace: <https://github.com/trufflesuite/ganache-ui/releases/tag/v2.5.4>
* Metamask: to manage Ganache ethereum accounts. Link: <https://metamask.io/download/>

Once the above tools have been installed, run Ganache and create a new ethereum space. After that, open a command console and execute the following commands:
```bash 
npm install -g truffle@5.4.29
git clone https://github.com/alcarria/privately-cities2030
cd privately
npm install
cd truffle
truffle migrate
```
* When you finish migrating the contracts to the blockchain, go to the folder `src/environment` and copy the file `environment.temp.ts` in the same folder and rename to `environment.ts`. Within `environment.ts`, copy the addresses of the contracts that have been migrated in their respective variables.
* Finally, you have to copy the `json` from the folder `truffle/build/contracts` to the folder `src/assets/contracts`. 
After all these steps, it would be enough to execute:
```bash
ng serve --open
```
And the application will open in the browser. Now all that remains is to connect Metamask to the Ganache blockchain and register one of the accounts that appear in Metamask.
