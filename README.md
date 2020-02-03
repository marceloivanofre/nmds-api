# Network Management and Documentation System

API para documentação e gerenciamento de redes desenvolvido como projeto de conclusão de curso

## Links do projeto

- [Documentação](https://drive.google.com/file/d/1E-xCKeuRSV4p7K2-oApVmnzPl70ssTTW/)

## Links de configuração do ambiente e documentações

- [Node.js (versão LTS) / npmjs](https://nodejs.org/en/download/)
- [Docker / Docker Compose](https://docs.docker.com/compose/install/)
- [MongoDB](https://docs.mongodb.com/)
- [Mongoose](https://mongoosejs.com/docs/)
- [Express](https://expressjs.com/en/5x/api.html#app)
- [JWT](https://jwt.io/)

## Padrões adotados

- [Guia de estilo Airbnb(Javascript)](https://github.com/airbnb/javascript)
- [Mensagens de commit](http://karma-runner.github.io/0.10/dev/git-commit-msg.html)
- [Design de modelagem NoSQL](https://docs.mongodb.com/manual/core/data-model-design/index.html)
- [Relacionamento NoSql](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-one-relationships-between-documents/#data-modeling-example-one-to-one)

## Instalando e iniciando o projeto

- Inicia o banco de dados em background

```
# docker-compose up -d
```

- Instala os módulos no diretório raiz

```
$ npm install
```

- Inicia a API em modo de desenvolvimento

```
$ npm run dev
```

- Inicia a API em produção

```
$ npm start
```

## Dicas

- Gerando um segredo de acesso

```
$ node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```
