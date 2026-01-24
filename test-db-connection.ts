import connectDB from './src/config/db';

console.log('Testing database connection with global caching...');
try {
  connectDB()
    .then(conn => {
      console.log('Database connected successfully with global caching.');
      console.log('Connection host:', conn.connection.host);
    })
    .catch(err => {
      console.error('Database connection failed:', err);
    });
} catch (error) {
  console.error('Error during connection:', error);
}