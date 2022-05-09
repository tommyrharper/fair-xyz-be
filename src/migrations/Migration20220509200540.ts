import { Migration } from '@mikro-orm/migrations';

export class Migration20220509200540 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "nftcollection" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "launch_date" timestamptz(0) null);',
    );
    this.addSql(
      'alter table "nftcollection" add constraint "nftcollection_pkey" primary key ("id");',
    );

    this.addSql(
      'create table "reminder" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "collection_id" varchar(255) not null);',
    );
    this.addSql(
      'alter table "reminder" add constraint "reminder_pkey" primary key ("id");',
    );

    this.addSql(
      'alter table "reminder" add constraint "reminder_collection_id_foreign" foreign key ("collection_id") references "nftcollection" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "reminder" drop constraint "reminder_collection_id_foreign";',
    );

    this.addSql('drop table if exists "nftcollection" cascade;');

    this.addSql('drop table if exists "reminder" cascade;');
  }
}
