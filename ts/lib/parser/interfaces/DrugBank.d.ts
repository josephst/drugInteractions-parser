export interface IDrugBankInteraction {
  name: string;
  'drugbank-id': string[];
  description: string;
}

export interface IDrugPrimaryId {
  $text: string;
  [index: string]: string;
}

export interface IDrugBankEntry {
  absorption: string;
  'affected-organisms': any;
  'ahfs-codes': any;
  'atc-codes': any;
  carriers: any;
  'cas-number': string;
  categories: any;
  classification: any;
  clearance: string;
  description: string;
  'drug-interactions': { 'drug-interaction': IDrugBankInteraction[] };
  'drugbank-id': Array<(string | IDrugPrimaryId)>;
  enzymes: any;
  'experimental-properties': any;
  'external-identifiers': any;
  'external-links': any;
  'fda-label': URL;
  'food-interactions': any;
  'general-references': any;
  groups: any;
  'half-life': string;
  indication: string;
  'international-brands': any;
  manufacturers: any;
  'mechanism-of-action': string;
  metabolism: string;
  mixtures: any;
  msds: URL;
  name: string;
  packages: any;
  patents: any;
  pathways: any;
  'pdb-entries': any;
  pharmacodynamics: string;
  prices: any;
  products: any;
  'protein-binding': any;
  reactions: any;
  'route-of-elimination': string;
  salts: any;
  sequences: any;
  'snp-adverse-drug-reactions': any;
  'snp-effects': any;
  state: string;
  synonyms: any;
  'synthesis-reference': any;
  targets: any;
  toxicity: string;
  transporters: any;
  unii: string;
  'volume-of-distribution': string;
}
