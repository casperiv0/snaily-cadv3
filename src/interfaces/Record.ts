export interface Base {
  id: string;
  name: string;
  date: string;
  postal: string;
  notes: string;
  officer_name: string;
  citizen_id: string;
  user_id: string;
}

export interface Warrant {
  id: string;
  name: string;
  reason: string;
  status: string;
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
