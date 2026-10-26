import ky, { HTTPError } from 'ky';
import { ApiRequestError, apiErrorSchema } from './error.ts';

export const http = ky.create({
  prefix: '/api',
  retry: 0,
  fetch: (input, init) => globalThis.fetch(input, init),
  hooks: {
    beforeError: [
      ({ error }) => {
        if (!(error instanceof HTTPError)) return error;
        const { status } = error.response;
        const parsed = apiErrorSchema.safeParse(error.data);
        return parsed.success
          ? new ApiRequestError(status, parsed.data.error.code, parsed.data.error.message)
          : new ApiRequestError(status, 'HTTP_ERROR', `Request failed with status ${status}`);
      },
    ],
  },
});
