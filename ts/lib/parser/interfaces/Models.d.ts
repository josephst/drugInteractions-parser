export interface IDrug {
  description: string;
  drugbankId: string;
  interactions: IDrugInteraction[];
  name: string;
}

export interface IDrugInteraction {
  description: string;
  targetId: string;
  targetName: string;
}
