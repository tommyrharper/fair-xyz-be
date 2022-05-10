<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Steps I used to set this up

- nodejs version `v16.14.0`

```
npm i -g @nestjs/cli
nest new project-name
npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm i -s @mikro-orm/core @mikro-orm/nestjs @mikro-orm/postgresql
npm i -D ts-morph
npm i @mikro-orm/reflection
docker run --name fair-xyz --publish 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker container ls # to check the db has been setup
npm i @mikro-orm/cli
npm i @mikro-orm/migrations
npm i nodemailer
npm install --save @types/nodemailer
npm i cron
npm install --save -D @types/cron
npm i date-fns
```

Then I opened up pgAdmin. Created a new server:
```
General => Name: fair-xyz
Connection => Host name/address: localhost. Port => 5432. Password: postgres. Save password => true.
```

The db is here: Servers -> fair-xyz -> Databases -> postgres;
Next I created a db using the GUI:
- Right click Databases -> Create -> Database: fair-xyz -> Save.

```
npx nest g module student
npx nest g service student
```

- Then I setup the entities, modules and resolvers. Now it is running you can access the playground: `http://localhost:3000/graphql`

Now I can query:
```graphql
query {
  getStuff
}
```

- Next I created migrations:
```
npx mikro-orm migration:create

```
- I added the following code to the start of the first migration to support our primary key creation:
```
this.addSql('create extension "uuid-ossp";');
```

- Then I ran the migrations:
```
npx mikro-orm migration:up
```

- Should now be able to see in pgAdmin: fair-xyz => Databases => fair-xyz => Schemas => Tables => student => Columns (6)
- Now you can boot the server and execute a mutation

```
npm run start:dev
```

- Mutations:
```graphql
mutation {
  updateNFTCollection(uuid: "112f7f68-a519-445d-beaf-52e21a2d5f6d", launchDate: "2022-05-14 22:11:44+00") {
    uuid
    name
    launchDate
  }
}
```

```graphql
mutation {
  createReminder(email: "example@gmail.com", collection: "f8f454c9-531b-4984-971d-a432a5991cc9") {
    uuid
		email
    collection {
      uuid
      name
      launchDate
    }
  }
}
```

- Queries:
```graphql
query {
  getNFTCollections {
    uuid
    name
    launchDate
  }
}
```

## Quick Start

```
docker start fair-xyz
npm run start:dev
```

## Reminder functionality

Table of emails:
- id: ID
- email: String
- collection: ID


Table of collections:
- id: ID
- name: String
- launchDate: Date | null

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
