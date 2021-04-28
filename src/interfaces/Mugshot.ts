export interface Mugshot {
  id: string;
  officer_id: string;
  full_date: string;

  /**
   * urls to mugshots
   */
  data: string[];
}
