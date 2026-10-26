import { ApiRequestError, http } from '@app/lib/http';
import { companySchema } from './schemas.ts';
import type { Company, RequestOptions } from './types.ts';

export async function getCompany(id: string, options: RequestOptions = {}): Promise<Company> {
  const body: unknown = await http.get(`companies/${encodeURIComponent(id)}`, options).json();

  const parsed = companySchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiRequestError(200, 'INVALID_PAYLOAD', 'Unexpected response format');
  }
  return parsed.data;
}
