import postgres from "postgres";

declare global {
  var mpampeSql: ReturnType<typeof postgres> | undefined;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  if (!process.env.DATABASE_URL) return null;

  if (!global.mpampeSql) {
    global.mpampeSql = postgres(process.env.DATABASE_URL, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return global.mpampeSql;
}
