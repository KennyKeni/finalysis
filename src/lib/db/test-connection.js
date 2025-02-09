import 'dotenv/config';
import dbConnect from './db.js';

async function testConnection() {
  try {
    const conn = await dbConnect();
    console.log('MongoDB Connected Successfully!');
    console.log('Connection Details:', {
      host: conn.connection.host,
      port: conn.connection.port,
      name: conn.connection.name
    });
    
    // Close the connection after testing
    await conn.disconnect();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
  }
}

// Run the test
testConnection(); 