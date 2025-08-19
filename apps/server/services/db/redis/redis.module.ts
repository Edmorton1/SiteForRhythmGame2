import { RedisService } from "@server/services/db/redis/redis.service";
import { Module } from "@nestjs/common";

@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
