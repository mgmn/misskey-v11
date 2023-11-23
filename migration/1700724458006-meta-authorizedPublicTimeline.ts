import {MigrationInterface, QueryRunner} from "typeorm";

export class metaDisablePublicTimeline1700724458006 implements MigrationInterface {
    name = 'metaDisablePublicTimeline1700724458006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" ADD "authorizedPublicTimeline" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "meta"."authorizedPublicTimeline" IS 'Disallow unauthenticated access to public timelines.'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "authorizedPublicTimeline"`);
    }

}
