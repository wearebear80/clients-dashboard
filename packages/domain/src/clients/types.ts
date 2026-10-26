import type { z } from 'zod';
import type { branchSchema, channelSchema, companySchema, employeeSchema } from './schemas.ts';

export type Channel = z.infer<typeof channelSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type Branch = z.infer<typeof branchSchema>;
export type Company = z.infer<typeof companySchema>;

export interface Inconsistency {
  nodeId: string;
  monthIndex: number;
  reported: number;
  sumOfChildren: number;
}

export interface RequestOptions {
  signal?: AbortSignal;
  searchParams?: URLSearchParams;
}
