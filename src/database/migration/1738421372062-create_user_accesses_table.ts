import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAccessesTable1738421372062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."user_accesses"(
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "password"      VARCHAR(200) NULL,
        "user_id"       UUID NOT NULL,
        "created_at"     TIMESTAMP,
        "updated_at"     TIMESTAMP NULL,
        "last_login"     TIMESTAMP NULL,
        CONSTRAINT fk_users_user_access FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."user_accesses";');
  }
}
