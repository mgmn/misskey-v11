import {MigrationInterface, QueryRunner} from "typeorm";

export class metaAuthorizedPublicTimeline1701106923260 implements MigrationInterface {
    name = 'metaAuthorizedPublicTimeline1701106923260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" ADD "authorizedPublicTimeline" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`COMMENT ON COLUMN "meta"."authorizedPublicTimeline" IS 'Disallow unauthenticated access to public timelines.'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "authorizedPublicTimeline"`);
    }

}
