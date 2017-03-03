import test from 'ava';
import path = require('path');
import fs = require('fs');
import { IDrug, IDrugInteraction} from '../../../lib/parser/interfaces/Models.d';
import { Parser } from '../../../lib/parser/parser';

const dataFile = path.normalize(`${__dirname}/../../fixtures/sampleSet.xml`);

test.cb('data file exists', (t) => {
  fs.access(dataFile, t.end);
});

test.cb('"parse" event emitted after parsing', (t) => {
  t.plan(1);
  const p = new Parser(dataFile);
  p.readXml(1);
  p.emitter.on('parsed', () => {
    t.pass();
    t.end();
  });
});

test.cb('Parse Lepirudin', (t) => {
  t.plan(4);
  const p = new Parser(dataFile);
  p.readXml(1);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    t.is(entries.length, 1);
    const e = entries[0];
    t.is(e.drugbankId, 'DB00001');
    t.is(e.name, 'Lepirudin');
    t.is(e.description, 'Lepirudin is identical to natural hirudin except for ' +
    'substitution of leucine for isoleucine at the N-terminal end of the ' +
    'molecule and the absence of a sulfate group on the tyrosine at position 63. ' +
    'It is produced via yeast cells. Bayer ceased the production of lepirudin (Refludan) effective May 31, 2012.');
    t.end();
  });
});

test.cb('parse 1 entry', (t) => {
  t.plan(5);
  const p = new Parser(dataFile);
  p.readXml(1);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    t.is(entries.length, 1);
    const e = entries[0];
    t.true(typeof(e.description) === 'string');
    t.true(typeof(e.drugbankId) === 'string');
    t.true(Array.isArray(e.interactions));
    t.true(typeof(e.name) === 'string');
    t.end();
  });
});

test.cb('split into two equal parts', (t) => {
  t.plan(3);
  const p = new Parser(dataFile);
  const results: IDrug[][] = [];
  p.readXml(20, 10);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    results.push(entries);
  });
  p.emitter.on('end', () => {
    t.is(results.length, 2);
    t.is(results[0].length, 10);
    t.is(results[1].length, 10);
    t.end();
  });
});

test.cb('default split: 10 entries per event', (t) => {
  const p = new Parser(dataFile);
  const results: IDrug[][] = [];
  p.readXml(20);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    results.push(entries);
  });
  p.emitter.on('end', () => {
    t.is(results[0].length, 10);
    t.end();
  });
});

test.cb('split into whole and remainder', (t) => {
  t.plan(3);
  const p = new Parser(dataFile);
  const results: IDrug[][] = [];
  p.readXml(15, 10);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    results.push(entries);
  });
  p.emitter.on('end', () => {
    t.is(results.length, 2);
    t.is(results[0].length, 10);
    t.is(results[1].length, 15 % 10);
    t.end();
  });
});

test.cb('parse 50 entries', (t) => {
  const p = new Parser(dataFile);
  const results: IDrug[][] = [];
  t.plan(6);
  p.readXml(50, 10);
  p.emitter.on('parsed', (entries: IDrug[]) => {
    results.push(entries);
    t.pass();
  });
  p.emitter.on('end', () => {
    t.is(results.length, 50 / 10);
    t.end();
  });
});

test.cb('"end" event emitted after finishing', (t) => {
  t.plan(2);
  const p = new Parser(dataFile);
  p.readXml(1);
  p.emitter.on('parsed', (data: any) => {
    t.pass();
  });
  p.emitter.on('end', (data: any) => {
    t.pass();
    t.end();
  });
});
