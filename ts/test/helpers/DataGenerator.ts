import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import { IDrug, IDrugInteraction } from '../../lib/parser/interfaces/Models.d';
import {Parser} from '../../lib/parser/parser';

export class DataGenerator {
  private totalRecords: number;
  private parser: Parser;

  constructor(inputFile: string, totalRecords = 20) {
    this.parser = new Parser(inputFile);
    this.totalRecords = totalRecords;
  }

  public async generate(): Promise<IDrug[]> {
    this.parser.readXml(this.totalRecords, this.totalRecords);
    // TODO: casting to Promise<IDrug[]> seems sloppy.
    return new Promise((resolve) => this.parser.emitter.on('parsed', resolve)) as Promise<IDrug[]>;
  }
}
