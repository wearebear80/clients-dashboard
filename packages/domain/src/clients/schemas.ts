import { z } from 'zod';

export const MONTHS_COUNT = 12;

/**
 * First month of every node's `values`. Not in the payload: "Feb 2024 – Jan 2025" comes from the
 * brief and the design.
 */
export const PERIOD_START = '2024-02';

const nodeBase = {
  id: z.string().min(1),
  name: z.string().min(1),
  values: z.array(z.number()).length(MONTHS_COUNT),
};

export const channelSchema = z.object(nodeBase);

// Nesting is not uniform: employees and channels are optional.
export const employeeSchema = z.object({
  ...nodeBase,
  channels: z.array(channelSchema).optional(),
});

export const branchSchema = z.object({
  ...nodeBase,
  employees: z.array(employeeSchema).optional(),
});

export const companySchema = z.object({
  ...nodeBase,
  branches: z.array(branchSchema),
});
