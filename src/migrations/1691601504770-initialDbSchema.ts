import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDbSchema1691601504770 implements MigrationInterface {
    name = 'InitialDbSchema1691601504770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tmdb_id" integer NOT NULL, "title" character varying(150) NOT NULL, "overview" text NOT NULL, "poster_path" character varying(100), "release_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" UNIQUE ("tmdb_id"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22cb43bb628a84676ad3a4c2a9" ON "movie" ("tmdb_id") `);
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" numeric(2,1) NOT NULL DEFAULT '1', "comment" text NOT NULL, "movie_tmdb_id" character varying NOT NULL, "user_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "movieTMDBId" uuid, CONSTRAINT "CHK_5f8cdef771c3e623bcee4ac405" CHECK (rating >= 1 AND rating <= 10), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_91e9f1b8dc312a944c2dc3e271" ON "review" ("movie_tmdb_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_81446f2ee100305f42645d4d6c" ON "review" ("user_id") `);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50), "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "role" "public"."user_role_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_5e99753778eb61089385dafd659" FOREIGN KEY ("movieTMDBId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_5e99753778eb61089385dafd659"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_81446f2ee100305f42645d4d6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91e9f1b8dc312a944c2dc3e271"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22cb43bb628a84676ad3a4c2a9"`);
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}
