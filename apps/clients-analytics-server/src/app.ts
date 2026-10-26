import express, { type ErrorRequestHandler, type Request } from 'express';
import type { ApiError } from '@app/lib/http/error';
import type { Company } from '@app/domain/clients';
// Validated against the shared schema on import: a broken data file fails at startup.
import { companyPayload } from '@app/domain/clients/fixtures';

const companiesById = new Map<string, Company>([[companyPayload.id, companyPayload]]);

export interface AppOptions {
  debugKnobs?: boolean;
  /** Production: the built web app, served next to the API from one origin. */
  webDir?: string;
}

const MAX_DELAY_MS = 10_000;

function sendError(res: express.Response, status: number, code: string, message: string) {
  res.status(status).json({ error: { code, message } } satisfies ApiError);
}

function readDebugKnobs(req: Request) {
  const delay = Math.min(Number(req.query.delay) || 0, MAX_DELAY_MS);
  const fail = Number(req.query.fail) || 0;
  return { delay, fail: fail >= 400 && fail <= 599 ? fail : 0 };
}

export function createApp({ debugKnobs = false, webDir }: AppOptions = {}) {
  const app = express();
  app.disable('x-powered-by');

  if (debugKnobs) {
    app.use((req, res, next) => {
      const start = performance.now();
      res.on('finish', () => {
        const ms = Math.round(performance.now() - start);
        console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
      });
      next();
    });
  }

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/companies/:id', async (req, res) => {
    if (debugKnobs) {
      const { delay, fail } = readDebugKnobs(req);
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      if (fail) return sendError(res, fail, 'SIMULATED_FAILURE', `Simulated ${fail} response`);
    }
    const found = companiesById.get(req.params.id);
    if (!found) return sendError(res, 404, 'COMPANY_NOT_FOUND', 'Company not found');
    res.json(found);
  });

  app.use('/api', (_req, res) => {
    sendError(res, 404, 'NOT_FOUND', 'Route not found');
  });

  if (webDir) {
    app.use(express.static(webDir));
    // Any other path is the single-page app.
    app.get('/{*path}', (_req, res) => res.sendFile('index.html', { root: webDir }));
  }

  app.use((_req, res) => {
    sendError(res, 404, 'NOT_FOUND', 'Route not found');
  });

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    sendError(res, 500, 'INTERNAL_ERROR', 'Unexpected server error');
  };
  app.use(onError);

  return app;
}
