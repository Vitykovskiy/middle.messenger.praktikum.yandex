import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { HTTPTransport } from './index.ts';
import { ContentTypes } from './constants.ts';

const BASE_URL = 'https://api';
const URL = '/users';
const QUERY = '?id=1&active=true';
const api = new HTTPTransport({ baseUrl: BASE_URL });

let server: sinon.SinonFakeServer;

describe('HTTPTransport', () => {
  beforeEach(() => {
    server = sinon.fakeServer.create();
    server.autoRespond = false;
  });

  it('should perform GET with query and parse JSON', async () => {
    const apiRequest = api.get<{ ok: boolean }>(URL, {
      data: { id: 1, active: true }
    });

    expect(server.requests.length, 'one request should be sent').to.equal(1);
    const req = server.requests[0];

    // проверяем URL
    expect(req.url, 'url should match').to.equal(BASE_URL + URL + QUERY);

    // отвечаем вручную
    req.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({ ok: true }));

    const res = await apiRequest;
    expect(res.code, 'status code').to.equal(200);
    expect(res.data, 'parsed data').to.deep.equal({ ok: true });
  });

  it('performs GET with query and parses JSON', async () => {
    const apiRequest = api.get<{ ok: boolean }>(URL, {
      data: { id: 1, active: true }
    });

    expect(server.requests.length, 'one request should be sent').to.equal(1);
    const req = server.requests[0];

    expect(req.method, 'method should be GET').to.equal('GET');
    expect(req.url, 'url should match').to.equal(BASE_URL + URL + QUERY);

    req.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({ ok: true }));

    const res = await apiRequest;
    expect(res.code, 'status code should be 200').to.equal(200);
    expect(res.data, 'parsed data should equal JSON body').to.deep.equal({ ok: true });
  });

  it('performs POST with JSON body', async () => {
    const payload = { name: 'John', age: 30 };

    const request = api.post(URL, { data: payload, contentType: ContentTypes.JSON });

    const req = server.requests[0];
    req.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify({ success: true }));

    const res = await request;

    expect(req.method, 'method should be POST').to.equal('POST');
    expect(req.requestBody, 'request body should equal JSON stringified payload').to.equal(
      JSON.stringify(payload)
    );
    expect(
      req.requestHeaders['Content-Type'],
      'Content-Type should start with application/json'
    ).to.satisfy((v: string) => v.startsWith(ContentTypes.JSON));
    expect(res.data, 'response data should match parsed JSON').to.deep.equal({ success: true });
  });

  it('handles HTTP error (4xx)', async () => {
    const request = api.get(URL);

    const req = server.requests[0];
    req.respond(
      404,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ error: 'Not found' })
    );

    try {
      await request;
      expect.fail('request should reject on 4xx error');
    } catch (err: unknown) {
      const error = err as { code: number; message: string; data: { error: string } };
      expect(error.code, 'error code should be 404').to.equal(404);
      expect(error.message, 'error message should be "Not Found"').to.equal('Not Found');
      expect(error.data, 'error data should contain response body').to.deep.equal({
        error: 'Not found'
      });
    }
  });

  it('handles network error', async () => {
    const request = api.get(URL);

    const req = server.requests[0];
    // имитируем сетевую ошибку
    req.onerror();

    try {
      await request;
      expect.fail('request should reject on network error');
    } catch (err: unknown) {
      const error = err as { code: number; message: string };
      expect(error.code, 'error code should be 0').to.equal(0);
      expect(error.message, 'error message should be "Network error"').to.equal('Network error');
    }
  });

  it('handles request timeout', async () => {
    const apiRequest = api.get(URL, { timeout: 10 });

    const req = server.requests[0];
    // вызываем таймаут вручную
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any).ontimeout?.();

    try {
      await apiRequest;
      expect.fail('request should reject on timeout');
    } catch (error: unknown) {
      const err = error as { code: number; message: string };
      expect(err.code, 'error code should be 0').to.equal(0);
      expect(err.message, 'error message should be "Request timeout"').to.equal('Request timeout');
    }
  });

  it('retries request specified number of times', async () => {
    const apiRequest = api.get<{ ok: boolean }>(URL, { retries: 2 });

    // Первая попытка — ошибка
    server.requests[0].onerror();

    // ждём появления второй
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(server.requests.length, 'should retry once after error').to.equal(2);

    // Вторая — успех
    server.requests[1].respond(
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ ok: true })
    );

    const res = await apiRequest;

    expect(res.code, 'final response code should be 200').to.equal(200);
    expect(res.data, 'final response body should match').to.deep.equal({ ok: true });
  });

  it('returns correct file src path from getFileSrc', () => {
    const transport = new HTTPTransport({ baseUrl: BASE_URL });

    const path = '/avatar.png';
    const full = transport.getFileSrc(path);

    expect(full, 'should prepend base URL and /resources prefix').to.equal(
      BASE_URL + '/resources' + path
    );

    expect(transport.getFileSrc(null), 'should return null for null path').to.equal(null);
  });
});
