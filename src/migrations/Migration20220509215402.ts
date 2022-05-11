import { Migration } from '@mikro-orm/migrations';

export class Migration20220509215402 extends Migration {
  async up(): Promise<void> {
    this.addSql('create extension "uuid-ossp";');

    this.addSql(
      'create table "nftcollection" ("uuid" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "launch_date" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "nftcollection" add constraint "nftcollection_name_unique" unique ("name");',
    );
    this.addSql(
      'alter table "nftcollection" add constraint "nftcollection_pkey" primary key ("uuid");',
    );

    this.addSql(
      'create table "reminder" ("uuid" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "collection_uuid" uuid not null);',
    );
    this.addSql(
      'alter table "reminder" add constraint "reminder_email_collection_uuid_unique" unique ("email", "collection_uuid");',
    );
    this.addSql(
      'alter table "reminder" add constraint "reminder_pkey" primary key ("uuid");',
    );

    this.addSql(
      'alter table "reminder" add constraint "reminder_collection_uuid_foreign" foreign key ("collection_uuid") references "nftcollection" ("uuid") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "reminder" drop constraint "reminder_collection_uuid_foreign";',
    );

    this.addSql('drop table if exists "nftcollection" cascade;');

    this.addSql('drop table if exists "reminder" cascade;');

    this.addSql('drop extension "uuid-ossp";');
  }
}
