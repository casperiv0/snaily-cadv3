export interface Base {
  id: string;
  name: string;
  data: string;
  postal: string;
  notes: string;
  officer_name: string;
}

export interface Warrant {
  id: string;
  name: string;
  reason: string;
  statues: string;
}

export interface Ticket extends Base {
  violations: string;
}

export interface ArrestReport extends Base {
  charges: string;
}

export interface WrittenWarning extends Base {
  infractions: string;
}
