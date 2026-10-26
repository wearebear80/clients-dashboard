export const CLIENT_LEVEL = { company: 0, branch: 1, adviser: 2, channel: 3 } as const;

/** One row of the dashboard: a node of the payload with its depth and its child rows. */
export interface ClientRow {
  id: string;
  name: string;
  /** Depth from the company, see `CLIENT_LEVEL`. */
  level: number;
  values: number[];
  children: ClientRow[];
}
