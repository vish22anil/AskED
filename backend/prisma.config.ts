export default {
  schema: {
    kind: 'single',
    filePath: 'prisma/schema.prisma',
  },
  migrate: {
    connection: {
      url: process.env.DATABASE_URL,
    }
  }
}
