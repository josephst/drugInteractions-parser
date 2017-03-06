import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { IDrug, IDrugInteraction } from './lib/parser/interfaces/Models.d';
import { Parser } from './lib/parser/parser';

function main() {
  const inFile = path.join(__dirname, '..', 'data', 'fullDatabase.xml');
  const outFile = path.join(__dirname, '..', 'fixtures', 'sampleParseData.json');
  const p = new Parser(inFile);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    // p.pause();
    const saved = entries.map((entry) => {
      const res = axios.post('http://localhost:3000/apiV1/drugs', entry);
      return res;
    });
    Promise.all(saved)
      .catch((err) => console.log(err))
      .then((responses) => {
        if (responses === undefined) {
          throw new Error('Could not read axios responses');
        } else {
          responses.forEach((response) => {
            if (response.status !== 201) {
              throw new Error(`Get HTML status ${response.status} while saving`);
            }
          });
          p.resume();
        }
      });
  });
  p.readXml(500);
}

main();
