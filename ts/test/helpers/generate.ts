import * as fs from 'fs';
import * as path from 'path';
import { DataGenerator } from './DataGenerator';

async function main(): Promise<void> {
  const inFile = path.join(__dirname, '..', '..', '..', 'data', 'fullDatabase.xml');
  const outFile = path.join(__dirname, '..', 'fixtures', 'sampleParseData.json');
  const gen = new DataGenerator(inFile);
  const data = await gen.generate();
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(outFile, JSON.stringify(data, null, 2), (err) => {
      err ? reject(err) : resolve();
    });
  });
}

main();
