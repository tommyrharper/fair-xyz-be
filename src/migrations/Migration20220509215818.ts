import { Migration } from '@mikro-orm/migrations';

export class Migration20220509215818 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "INSERT INTO public.nftcollection(name, created_at, updated_at, launch_date) VALUES ('Beauty Embodied', current_timestamp, current_timestamp, current_timestamp + INTERVAL '5 DAYS');",
    );
    this.addSql(
      "INSERT INTO public.nftcollection(name, created_at, updated_at, launch_date) VALUES ('The Magic of Japan', current_timestamp, current_timestamp, current_timestamp + INTERVAL '2 DAYS');",
    );
    this.addSql(
      "INSERT INTO public.nftcollection(name, created_at, updated_at, launch_date) VALUES ('Crypto Wonders', current_timestamp, current_timestamp, current_timestamp + INTERVAL '7 DAYS');",
    );
    this.addSql(
      "INSERT INTO public.nftcollection(name, created_at, updated_at) VALUES ('One For All', current_timestamp, current_timestamp);",
    );
    this.addSql(
      "INSERT INTO public.nftcollection(name, created_at, updated_at) VALUES ('Fair Blockchain Magic', current_timestamp, current_timestamp);",
    );
  }
}
