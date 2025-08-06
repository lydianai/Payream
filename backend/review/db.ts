import { SQLDatabase } from 'encore.dev/storage/sqldb';

// Use the 'user' database to allow foreign key constraints between reviews and users.
export const reviewDB = SQLDatabase.named("user");
