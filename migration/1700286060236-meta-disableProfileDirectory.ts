import {MigrationInterface, QueryRunner} from "typeorm";

export class metaDisableProfileDirectory1700286060236 implements MigrationInterface {
    name = 'metaDisableProfileDirectory1700286060236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" ADD "authorizedProfileDirectory" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "meta"."authorizedProfileDirectory" IS 'Disallow unauthenticated access to the profile directory in web UI.'`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "disableProfileDirectory" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "meta"."disableProfileDirectory" IS 'Disable the profile directory in web UI.'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "authorizedProfileDirectory"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "disableProfileDirectory"`);
    }

}
