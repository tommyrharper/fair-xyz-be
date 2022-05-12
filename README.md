<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A Nest.js application for sending NFT Collection launch reminder emails.</p>
    <p align="center">
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_95.svg#9" alt="Coverage" /></a>
</p>

## Description

Based on the [Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Never forget your next NFT Collection launch again! Get emailed reminders just in time 😀  🎉  🎊  🍻  🎁

## Installation and Quick Start

1. Install all the dependencies:
```bash
$ npm install
```
2. Boot docker instances for databases:
```bash
docker run --name fair-xyz --publish 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker run --name redis-fair-xyz -d -p 6379:6379 redis:6.0
docker container ls # to check the dbs have been setup
```

3. Create two databases within `fair-xy`:
     - `fair-xyz`
     - `fair-xyz-test` (this is a test db, it is only needed for running the tests)

4. Now you have the databases up, you can run the migrations
```
npx mikro-orm migration:up
```
5. Now you are ready to go!
```bash
npm run start:dev
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

## Setting up the DBs


Then I opened up pgAdmin. Created a new server:
```
General => Name: fair-xyz
Connection => Host name/address: localhost. Port => 5432. Password: postgres. Save password => true.
```

The db is here: Servers -> fair-xyz -> Databases -> postgres;
Next I created a db using the GUI:
   - Right click Databases -> Create -> Database: fair-xyz -> Save.
   - Right click Databases -> Create -> Database: fair-xyz-test -> Save.


- Then I ran the migrations:
```
npx mikro-orm migration:up
```

- Should now be able to see in pgAdmin: fair-xyz => Databases => fair-xyz => Schemas => Tables => student => Columns (6)
- Now you can boot the server and execute a mutation

## Queries

```graphql
query {
  getNFTCollections {
    uuid
    name
    launchDate
  }
}
```

## Mutations:

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

## Quick Start - If already installed and setup before

```
docker start fair-xyz
docker start redis-fair-xyz
npm run start:dev
```

## Tables data structure

Table of emails:
- id: ID
- email: String
- collection: ID


Table of collections:
- id: ID
- name: String
- launchDate: Date | null

## Stay in touch

- Author - [Tom Harper](https://github.com/tommyrharper)
