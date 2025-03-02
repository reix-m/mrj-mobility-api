import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetTokenColumnInUserAccessTable1740952394211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public."user_accesses"
            ADD COLUMN IF NOT EXISTS reset_token VARCHAR(200) NULL
        ;`);
    await queryRunner.query(`
        ALTER TABLE public."user_accesses"
            ADD COLUMN IF NOT EXISTS reset_token_expires_In TIMESTAMP NULL
        ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE public."user_accesses"
            DROP COLUMN IF EXISTS reset_token
        ;`);
    await queryRunner.query(`
        ALTER TABLE public."user_accesses"
            DROP COLUMN IF EXISTS reset_token_exipires_in
        ;`);
  }
}
