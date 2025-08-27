import "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { registry } from "../src/config/server/swagger/registry";

extendZodWithOpenApi(z);

registry.registerPath({});
