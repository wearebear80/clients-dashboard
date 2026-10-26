import { childrenOf, type PayloadNode } from './tree.ts';
import type { Company, Inconsistency } from './types.ts';

/** Domain rule: a parent's value equals the sum of its children's values, per month. */
export function findInconsistencies(company: Company): Inconsistency[] {
  const check = (node: PayloadNode): Inconsistency[] => {
    const children = childrenOf(node);
    if (children.length === 0) return [];

    const own = node.values.flatMap((reported, monthIndex) => {
      const sumOfChildren = children.reduce(
        (sum, child) => sum + (child.values[monthIndex] ?? 0),
        0,
      );
      return reported === sumOfChildren
        ? []
        : [{ nodeId: node.id, monthIndex, reported, sumOfChildren }];
    });
    return [...own, ...children.flatMap(check)];
  };

  return check(company);
}
