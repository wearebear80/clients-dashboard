import { describe, expect, it } from 'vitest';
import { companyPayload } from './fixtures.ts';
import { findInconsistencies } from './validation.ts';

describe('findInconsistencies', () => {
  it('compares each parent with the sum of its children', () => {
    const issues = findInconsistencies(companyPayload);

    expect(issues).toContainEqual({
      nodeId: companyPayload.id,
      monthIndex: 3,
      reported: 301,
      sumOfChildren: 279,
    });
    // Company May, Branch 1 Aug, Anna May–Sep.
    expect(issues).toHaveLength(7);
  });

  it('flags a parent below its children too, and never a leaf', () => {
    const issues = findInconsistencies(companyPayload);
    const branch1 = companyPayload.branches[0]!;

    // Branch 1, Aug 2024: reported 214, advisers add up to 216.
    expect(issues).toContainEqual({
      nodeId: branch1.id,
      monthIndex: 6,
      reported: 214,
      sumOfChildren: 216,
    });
    const leafIds = branch1.employees?.[0]?.channels?.map((channel) => channel.id) ?? [];
    expect(issues.filter((issue) => leafIds.includes(issue.nodeId))).toEqual([]);
  });
});
