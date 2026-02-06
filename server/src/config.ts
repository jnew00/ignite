export const config = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    name: process.env.DB_NAME ?? 'ignite',
    user: process.env.DB_USER ?? 'ignite',
    password: process.env.DB_PASS ?? 'ignite',
  },
};
