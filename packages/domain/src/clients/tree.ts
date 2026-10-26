/** Any node of the payload: company, branch, employee or channel. */
export interface PayloadNode {
  id: string;
  name: string;
  values: readonly number[];
  branches?: readonly PayloadNode[];
  employees?: readonly PayloadNode[];
  channels?: readonly PayloadNode[];
}

/** Each level names its children differently; this hides it. */
export const childrenOf = (node: PayloadNode): readonly PayloadNode[] =>
  node.branches ?? node.employees ?? node.channels ?? [];
