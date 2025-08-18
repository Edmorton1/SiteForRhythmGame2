import { Module } from "@nestjs/common";
import { RedisService } from "@server/services/db/redis/redis.service";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
