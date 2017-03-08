import axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { IDrug, IDrugInteraction } from './lib/parser/interfaces/Models.d';
import { Parser } from './lib/parser/parser';
dotenv.config();

function main() {
  const inFile = path.join(__dirname, '..', 'data', 'fullDatabase.xml');
  // const outFile = path.join(__dirname, '..', 'fixtures', 'sampleParseData.json');
  const p = new Parser(inFile);
  const config: AxiosRequestConfig = {
    auth: {
      password: process.env.API_KEY,
      username: process.env.API_USERNAME,
    },
  };
  let ended = false;
  p.emitter.on('end', () => ended = true);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    // p.pause();
    const entryIds = entries.map((entry) => entry.drugbankId);
    console.log(`adding ${entries.length} drugs: ${entryIds.join(' ')}`);
    const saved = entries.map((entry) => {
      const res = axios.post('http://druginteractions.azurewebsites.net/apiV1/drugs', entry, config);
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
          if (ended) {
            return;
          } else {
            p.resume();
          }
        }
      })
      .catch((err) => console.log(err));
  });
  p.readXml();
}

main();
