import { createConnection } from "typeorm";

before(async function() {
  await createConnection();
});