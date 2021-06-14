[![Build Status](https://travis-ci.org/gfviegas/scout-cms.svg?branch=master)](https://travis-ci.org/gfviegas/express-rest-api)
[![Dependency Status](https://gemnasium.com/badges/github.com/gfviegas/express-rest-api.svg)](https://gemnasium.com/github.com/gfviegas/express-rest-api)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
# RESTful API.

# Scripts

Os seguintes scripts estão disponiveis com `yarn run SCRIPT` ou `npm run SCRIPT`

| Script | Descrição |
| ------ | ------ |
| test | Roda o linter, roda os testes unitários e os testes de integração, em sequência |
| start | Inicia o servidor com hot auto-reload utilizando o nodemon |
| dev | Inicia o servidor de desenvolvimento com hot auto-reload utilizando o nodemon |
| dev-win | Inicia o servidor de desenvolvimento com hot auto-reload utilizando o nodemon em legacy mode para windows |
| lint | Roda o ESLINT para conferir o styleguide do código |
| prod | Inicia o servidor de produção com hot auto-reload utilizando o nodemon |
| seed | Alimenta o banco de dados através das estratégias na pasta seed |
| test:integration | Roda apenas os testes de integração, uma única vez |
| test:integration-server | Inicia o servidor de desenvolvimento dos testes de integração, com auto-reload |
| test:unit | Roda apenas os testes unitários, uma única vez |
| test:unit-server | Inicia o servidor de desenvolvimento dos testes unitários, com auto-reload |
| test:report | Gera o relatório de cobertura dos testes |

# Sobre este projeto

## Organização de Pastas
Vamos seguir um padrão de organização de pastas para ficar cada coisa em seu lugar e clean.

### ./
Temos nosso entry point `index.js` que vai inicializar nossa aplicação.

Também temos o nosso arquivo `.env` que abriga as variáveis de ambiente que usaremos

### ./config
A pasta config abriga os scripts pra inicializar o server e a conexão do mongoose. A medida que precisarmos de novos scripts de configuração ou conexão da API, coloque-os aqui.

### ./actions
Sabe aquele GET `api/v1/module` que só tem a função de dar um GET da entidade e retornar? Muitas vezes você vai utilizar métodos que são idênticos em múltiplos models. É pra isso que essa folder existe. Ela abriga pequenas **ações** reaproveitáveis ao invés de poluir os controllers com códigos iguais. Utilize quantas e quais sentir necessidade, a maioria das vezes serão operações com o mongoose.

### ./models
Pasta para armazenar as models

### ./helpers
Coloque aqui os arquivos helpers, funcões modularizadas que vão facilitar a manutenção do seu código. Diferente do actions as funções aqui abrigadas não tem relação com controllers, elas podem fazer simples operações como criptografar uma string ou calcular uma média.

Divida os helpers em folders como achar conveniente (ex: `helpers/math` para operações matemáticas, `helpers/string` para manipulação de strings, etc).

### ./modules
Aqui é onde vive a lógica e as rotas de sua API. Antes de cada módulo em si, precisamos versioná-los, abrigando as pastas `v1`, `v2`, e etc.

### ./modules/v1
Módulos da versão 1 da nossa API. As APIs simples e com poucos clientes terão, na maioria das vezes, apenas uma versão. Ainda sim deveremos versioná-los.

Pra cada módulo de nossa API, criaremos uma pasta aqui dentro.

Além disso também temos um arquivo routes.js que "aplicam" as rotas dos módulos de sua versão. Por quê um routes.js por versão? Porque em uma determinada versão você pode não possuir uma rota X, ou possuir uma Y com nome diferente, ou até uma Z nova. É bom fazer as coisas dinâmicas, mas não dá pra pensar em muita mágica em uma situação dessas.


### ./modules/v1/nomeDoModulo
Para cada módulo nós vamos possuir os seguintes files:
#### routes.js
É aqui que definimos nossos endpoints desse módulo. Alguns módulos não possuem criação ou delete por exemplo. Outros possuem alguns sub-documentos que devem ser servidos. Declare todas as rotas nesse arquivo.

#### controller.js
Quando cairmos nas rotas, o que a API deve fazer? Essa responsabilidade é de nosso controller, que vai utilizar actions comuns do mongoose e/ou outros métodos que você vai cadastrar nesse file.

#### validators.js
Você diversas vezes vai precisar validar parâmetros de criação e edição de dados, além de algumas lógicas customizadas (Ex: não pode possuir mais de uma moto vermelha no sistema). É aqui que você vai criar essas validações. Elas rodam no formato de middleware do express, o que significa que a sua rota só vai chegar ao controller se passar no validator cadastrado.
