import { Module } from '@nestjs/common';
import { DatabaseProvider } from '../providers/test.db.provider';

@Module({
  providers: [...DatabaseProvider],
  exports: [...DatabaseProvider],
})
export class TestDatabaseModule {}
