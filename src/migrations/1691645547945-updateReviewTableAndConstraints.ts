import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReviewTableAndConstraints1691645547945 implements MigrationInterface {
    name = 'UpdateReviewTableAndConstraints1691645547945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_81446f2ee100305f42645d4d6c"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "CHK_5f8cdef771c3e623bcee4ac405"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "user_id" TO "username"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`CREATE INDEX "IDX_e07711717f71083f97fef1d68d" ON "review" ("username") `);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "CHK_a483c3db380184625a9f6a5ec4" CHECK (rating >= 1.0 AND rating <= 10.0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "CHK_a483c3db380184625a9f6a5ec4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e07711717f71083f97fef1d68d"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "review" RENAME COLUMN "username" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "CHK_5f8cdef771c3e623bcee4ac405" CHECK (((rating >= (1.0)::numeric) AND (rating <= (10.0)::numeric)))`);
        await queryRunner.query(`CREATE INDEX "IDX_81446f2ee100305f42645d4d6c" ON "review" ("user_id") `);
    }

}
