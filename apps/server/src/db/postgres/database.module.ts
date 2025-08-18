import { DatabaseService } from "@apps/server/db/postgres/database.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [DatabaseService],
	exports: [DatabaseService],
})
class DatabaseModule {}

export default DatabaseModule;
