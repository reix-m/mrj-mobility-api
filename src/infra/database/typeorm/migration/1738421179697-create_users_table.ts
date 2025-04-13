import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1738421179697 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public."users"(
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "first_name"    VARCHAR(100) NULL,
        "last_name"     VARCHAR(100) NULL,
        "email"         VARCHAR(320) NULL,
        "parent_id"     UUID NULL,
        "created_at"    TIMESTAMP,
        "updated_at"    TIMESTAMP NULL,
        "removed_at"    TIMESTAMP NULL,
        CONSTRAINT fk_users_user FOREIGN KEY (parent_id) REFERENCES public.users(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public."users";');
  }
}
