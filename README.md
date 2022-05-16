<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_95.svg#9" alt="Coverage" /></a>

# FAIR-XYZ Take Home Challenge BE

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

3. Now you have the databases up, you can run the migrations
```bash
npx mikro-orm migration:up
```
4. Now you are ready to go!
```bash
npm run start:dev
```
- Now you can connect the FE or execute a query or mutation at `http://localhost:8000/graphql`

## Notes

I have added some thoughts here on different decisions I made when building this system.

## Testing

I decided to create a test PostgreSQL database for testing purposes.

I didn't add a test database for Redis just to save time, so the tests and the app use the same redis store.

I wrote most of the tests as either unit tests for specific important functionality and integration tests at the level of the resolver.

I didn't write any tests at the e2e level, which is something I would do if I was going to invest more time into this.

I still managed to achieve `95%` test coverage across the application, and almost all the most important core functionality is well tested.

![](2022-05-13-00-39-02.png)

### Queue System

The next main design decision I made was to use [BULL](https://optimalbits.github.io/bull/) with Redis to handle the email reminder queue.

Using Redis allows jobs to be persisted in the case of a server restart, and bull has a pretty nice api for handling queues and processes.

I chose to use `bulkAdd` when adding reminders for a particular email, though I am not sure this efficiency benefit is really needed, and it comes at a risk as BULL handles failures by cancelling all jobs within a single `bulkAdd` operation.

I didn't add any failure protection for this scenario.

For this reason I decided not to `bulkAdd` to update all reminders at once when updating a collection launch date or name.

Instead the reminder jobs are chunked at the level of per email. This way if there was a failure, it would just be for a single user.

### Object Relational Mapping

I decided to use [MikroORM](https://mikro-orm.io/) for an ORM as they have a nice [integration with Nest.js](https://docs.nestjs.com/recipes/mikroorm) and a cool feature where the GraphQL schema can be inferred from the MikroORM Entitys, so you don't have to write it out explicitly.

You can also see [details on the integration from MikroORM's docs here](https://mikro-orm.io/docs/usage-with-nestjs).

[TypeORM](https://typeorm.io/) is much more popular, but I wanted to try out the alternative.

## Running the Tests

```bash
$ npm run test

# test coverage
$ npm run test:cov
```

## Quick Start - If already installed and setup before

```
docker start fair-xyz
docker start redis-fair-xyz
npm run start:dev
```
