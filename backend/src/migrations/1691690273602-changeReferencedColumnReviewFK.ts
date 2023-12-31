import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReferencedColumnReviewFK1691690273602 implements MigrationInterface {
    name = 'ChangeReferencedColumnReviewFK1691690273602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91e9f1b8dc312a944c2dc3e271"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "movie_tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "movie_tmdb_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_91e9f1b8dc312a944c2dc3e271" ON "review" ("movie_tmdb_id") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718" FOREIGN KEY ("movie_tmdb_id") REFERENCES "movie"("tmdb_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91e9f1b8dc312a944c2dc3e271"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "movie_tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "movie_tmdb_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_91e9f1b8dc312a944c2dc3e271" ON "review" ("movie_tmdb_id") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718" FOREIGN KEY ("movie_tmdb_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
