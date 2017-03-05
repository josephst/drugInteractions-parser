import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { IDrug, IDrugInteraction } from './lib/parser/interfaces/Models.d';
import { Parser } from './lib/parser/parser';

async function main(): Promise<void> {
  const inFile = path.join(__dirname, '..', '..', '..', 'data', 'fullDatabase.xml');
  const outFile = path.join(__dirname, '..', 'fixtures', 'sampleParseData.json');
  const p = new Parser(inFile);
  let stop = false;
  p.emitter.on('parsed', (entries: IDrug[]) => {
    entries.forEach(async (entry) => {
      if (stop === false) {
        const res = await axios.post('http://localhost:3000/apiV1/drugs', entry);
        if (res.status !== 201) {
          stop = true;
        }
      }
    });
  });
  p.readXml(50);
}

main();
