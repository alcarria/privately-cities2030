# Privately

## Configuración

Para que el proyecto funcione es necesario:

- Instalar truffle y ganache
- Abrir ganache y configurar un proyecto de ethereum
- Acceder a la carpeta truffle y ejecutar `truffle migrate`
- Copiar los `.json` de `truffle/build/contracts` a la carpeta `src/assets/contracts`
- En la carpeta `src/environment` copiar el fichero `environment.temp.ts` en la misma carpeta y renombrar a `environment.ts`
- Dentro de `environment.ts` pegar la address de cada uno de los contratos en su lugar correspondiente

# Ejecutar proyecto

Para ejecutar la aplicación, desde la raíz del proyecto ejecutamos:

- npm install
- ng serve --open
