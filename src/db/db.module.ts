import { Module } from '@nestjs/common';
import { PGDatabaseProvider } from '../providers/postgresql.db.provider';

@Module({
  providers: [...PGDatabaseProvider],
  exports: [...PGDatabaseProvider],
})
export class DatabaseModule {}
