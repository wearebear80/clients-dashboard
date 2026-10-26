import { companySchema } from './schemas.ts';
import rawCompany from './company.json' with { type: 'json' };

export const companyPayload = companySchema.parse(rawCompany);
