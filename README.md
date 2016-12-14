[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
# API RESTful em Express, Mongoose, Mocha e Chai.

## Organização de Pastas
Vamos seguir um padrão de organização de pastas para ficar cada coisa em seu lugar e clean.

### ./
Temos nosso entry point `index.js` que vai inicializar nossa aplicação.

Também temos o nosso arquivo `.env` que abriga as variáveis de ambiente que usaremos

### ./config
A pasta config abriga os scripts pra inicializar o server e a conexão do mongoose. A medida que precisarmos de novos scripts de configuração ou conexão da API, coloque-os aqui.

### ./helpers
Coloque aqui os arquivos helpers, funcões modularizadas que vão facilitar a manutenção do seu código

### ./modules
Aqui é onde vive a lógica e as rotas de sua API. Antes de cada módulo em si, precisamos versioná-los, abrigando as pastas `v1`, `v2`, e etc.

### ./modules/v1
Módulos da versão 1 da nossa API. As APIs simples e com poucos clientes terão, na maioria das vezes, apenas uma versão. Ainda sim deveremos versioná-los.

Pra cada módulo de nossa API, criaremos uma pasta aqui dentro.
