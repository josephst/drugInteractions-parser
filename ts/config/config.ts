import * as dotenv from 'dotenv';
dotenv.config();

const dataFile = `${__dirname}/../../data/fullDatabase.xml`;
const username = '44dd4d5f-bf99-45b4-978f-837203f06b54';
const password = process.env.KEY;

export { dataFile, username, password };
