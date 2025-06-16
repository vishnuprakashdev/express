// src/config/data.js
import { Sequelize } from 'sequelize';

const DB_NAME = process.env.DB_NAME || 'your_db_name';
const DB_USER = process.env.DB_USER || 'your_db_user';
const DB_PASS = process.env.DB_PASS || 'your_db_password';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306; // Change for other DBs

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql', // Change to 'postgres', 'sqlite', etc. if needed
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true,
    underscored: true,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

export default sequelize;
