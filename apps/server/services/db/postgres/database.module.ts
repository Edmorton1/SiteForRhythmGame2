import { Module } from "@nestjs/common";
import { DatabaseService } from "@server/services/db/postgres/database.service";

@Module({
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
