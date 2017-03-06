import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import xmlStream = require('xml-stream');
import { IDrugBankEntry, IDrugBankInteraction, IDrugPrimaryId } from './interfaces/DrugBank.d';
import { IDrug, IDrugInteraction } from './interfaces/Models.d';

/**
 * Parser streams an XML file, extracting each Drug entry from the file and all interactions of that drug.
 * Emits events as entries are parsed.
 */
export class Parser {
  /**
   * Extract description, id, interactions, and name from a single parsed XML entity.
   */
  private static makeSingleEntry(drug: IDrugBankEntry): IDrug {
    let interactions: IDrugInteraction[] = [];
    if (drug['drug-interactions'] &&
      drug['drug-interactions']['drug-interaction'] &&
      drug['drug-interactions']['drug-interaction'].length > 0) {
      interactions = drug['drug-interactions']['drug-interaction'].map((interaction) => {
        return {
          description: interaction.description,
          targetId: interaction['drugbank-id'][0],
          targetName: interaction.name,
        } as IDrugInteraction;
      });
    }
    const ids = drug['drugbank-id'];
    let id: string;
    if (typeof ids[0] === 'string') {
      id = ids[0] as string;
    } else {
      /* tslint:disable no-string-literal */
      id = (ids[0] as IDrugPrimaryId)['$text'];
      /* tslint:enable no-string-literal */
    }
    return {
      description: drug.description,
      drugbankId: id,
      interactions,
      name: drug.name,
    };
  };

  private _emitter: EventEmitter;
  private fileName: string;
  private inputStream: fs.ReadStream;
  private xml: any;

  constructor(fileName: string) {
    this._emitter = new EventEmitter();
    this.fileName = fileName;
    this.inputStream = fs.createReadStream(this.fileName);
    this.xml = new xmlStream(this.inputStream);
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  /**
   * Create arrays of IDrug objects, putting them into an array and emitting a 'parsed' event
   * each time 'split' records have been parsed.
   * Stops when 'totalRecords' have been parsed, or when file ends.
   * Emits 'end' event on finishing.
   */
  public readXml(totalRecords?: number, split = 10) {
    let entries: IDrug[] = [];
    let totalCount = 0;
    let splitCount = 0;

    // collect all interactions and ids
    this.xml.collect('drug-interaction');
    this.xml.collect('drugbank-id');

    this.xml.on('updateElement: drugbank > drug', (drug: IDrugBankEntry) => {
      const entry = Parser.makeSingleEntry(drug);
      entries.push(entry);
      if (totalRecords && ++totalCount === totalRecords) {
        this.xml.pause();
        this._emitter.emit('parsed', entries);
        this._emitter.emit('end');
        this.inputStream.close();
      } else if (++splitCount === split) {
        this._emitter.emit('parsed', entries);
        this.xml.pause();
        entries = [];
        splitCount = 0;
      }
    });
    this.xml.on('end', () => {
      this._emitter.emit('parsed', entries);
      this._emitter.emit('end');
      this.inputStream.close();
    });
  }

  public pause() {
    this.xml.pause();
  }

  public resume() {
    this.xml.resume();
  }
};
