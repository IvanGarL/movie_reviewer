import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrectionReviewFks1691687850860 implements MigrationInterface {
    name = 'CorrectionReviewFks1691687850860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_5e99753778eb61089385dafd659"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "movieTMDBId"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91e9f1b8dc312a944c2dc3e271"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "movie_tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "movie_tmdb_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "rating" SET DEFAULT '0'`);
        await queryRunner.query(`CREATE INDEX "IDX_91e9f1b8dc312a944c2dc3e271" ON "review" ("movie_tmdb_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_81446f2ee100305f42645d4d6c" ON "review" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_81446f2ee100305f42645d4d6c2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718" FOREIGN KEY ("movie_tmdb_id") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_91e9f1b8dc312a944c2dc3e2718"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_81446f2ee100305f42645d4d6c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_81446f2ee100305f42645d4d6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91e9f1b8dc312a944c2dc3e271"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "rating" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "movie_tmdb_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "movie_tmdb_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_91e9f1b8dc312a944c2dc3e271" ON "review" ("movie_tmdb_id") `);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "movieTMDBId" uuid`);
        await queryRunner.query(`ALTER TABLE "review" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_5e99753778eb61089385dafd659" FOREIGN KEY ("movieTMDBId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
