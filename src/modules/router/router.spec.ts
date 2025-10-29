import { beforeEach, describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { Router } from './index.ts';
import type { RouteRecord } from './types.ts';
import Block from '@/modules/block/index.ts';

class MockComponent extends Block {
  name = 'MockComponent';
  public render(): DocumentFragment {
    return this.compile('', this.props);
  }
}

class DefaultMockComponent extends Block {
  name = 'DefaultMockComponent';
  public render(): DocumentFragment {
    return this.compile('', this.props);
  }
}

const TEST_ROUTE_NAME = 'TestRouteName';
const TEST_ROUTE_PATH = '/test-route';
const DEFAULT_ROUTE_NAME = 'DefaultRouteName';
const DEFAULT_ROUTE_PATH = '/';
const TEST_PARAMETERS = { id: 123, user: 'test-user' };
const TEST_QUERY_PARAMS = { id: 12345, block: 'test', 'test-boolean': true };
const TEST_ROUTE_META = { testMeta: true };

const ROUTES: RouteRecord[] = [
  {
    name: TEST_ROUTE_NAME,
    path: TEST_ROUTE_PATH,
    paramKeys: ['user', 'id'],
    meta: TEST_ROUTE_META,
    component: MockComponent
  },
  {
    name: DEFAULT_ROUTE_NAME,
    path: DEFAULT_ROUTE_PATH,
    component: DefaultMockComponent
  }
];

let router: Router;

describe('Router', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    router = new Router('');
    router.registerRoutes(ROUTES);
  });

  it('should navigates by route name', function () {
    router.go({ name: TEST_ROUTE_NAME });

    expect(window.location.pathname, `location pathname should be ${TEST_ROUTE_PATH}`).to.be.equal(
      TEST_ROUTE_PATH
    );
  });

  it('should navigates by route name with params', function () {
    router.go({ name: TEST_ROUTE_NAME, params: TEST_PARAMETERS });

    expect(
      window.location.pathname,
      `location pathname should be ${TEST_ROUTE_PATH}/${TEST_PARAMETERS.user}/${TEST_PARAMETERS.id}`
    ).to.be.equal(`${TEST_ROUTE_PATH}/${TEST_PARAMETERS.user}/${TEST_PARAMETERS.id}`);
  });

  it('should redirect to default route', function () {
    router.go({ name: TEST_ROUTE_NAME + '_wrong_key', params: TEST_PARAMETERS });

    expect(window.location.pathname, `location pathname should`).to.be.equal(DEFAULT_ROUTE_PATH);
  });

  it('should navigates by path with query', function () {
    router.go({
      name: TEST_ROUTE_NAME,
      query: TEST_QUERY_PARAMS
    });

    expect(window.location.search, `location pathname should`).to.be.equal(
      '?id=12345&block=test&test-boolean=true'
    );
  });

  it('should navigates by path', function () {
    router.go({ path: TEST_ROUTE_PATH });

    expect(window.location.pathname, `location pathname should be ${TEST_ROUTE_PATH}`).to.be.equal(
      TEST_ROUTE_PATH
    );
  });

  it('should registers routes', function () {
    const testRoute = router.getRoute(TEST_ROUTE_PATH);
    const defaultRoute = router.getRoute(DEFAULT_ROUTE_PATH);

    expect(testRoute, 'getRoute(TEST_ROUTE_PATH) should return valid route').to.not.be.null;
    expect(defaultRoute, 'getRoute(DEFAULT_ROUTE_PATH) should return default route').to.not.be.null;

    expect(testRoute?.name, 'returned route name should equal TEST_ROUTE_NAME').to.equal(
      TEST_ROUTE_NAME
    );
    expect(defaultRoute?.name, 'returned route name should equal DEFAULT_ROUTE_NAME').to.equal(
      DEFAULT_ROUTE_NAME
    );
  });

  it('should gets route by path', function () {
    const testRoute = router.getRoute(TEST_ROUTE_PATH);
    expect(testRoute, 'getRoute(TEST_ROUTE_PATH) should return a route instance').to.not.be.null;
    expect(testRoute?.name, 'route name mismatch for TEST_ROUTE_PATH').to.equal(TEST_ROUTE_NAME);

    const testRouteWithQuery = router.getRoute(`${TEST_ROUTE_PATH}?id=42&active=true`);
    expect(testRouteWithQuery, 'getRoute(path with query) should return a route instance').to.not.be
      .null;
    expect(testRouteWithQuery?.name, 'route name mismatch for path with query').to.equal(
      TEST_ROUTE_NAME
    );

    expect(router.query, 'query should contain parsed query params as strings').to.deep.equal({
      id: '42',
      active: 'true'
    });

    const unknownRoute = router.getRoute('/non-existent');
    expect(
      unknownRoute?.name,
      'getRoute(non-existent path) should return DEFAULT_ROUTE_NAME'
    ).to.equal(DEFAULT_ROUTE_NAME);
  });

  it('should get meta of the current route', async function () {
    const clock = sinon.useFakeTimers();

    router.go({ name: TEST_ROUTE_NAME });
    await clock.tickAsync(0);
    expect(router.meta, 'meta should equal route meta object').to.deep.equal(TEST_ROUTE_META);

    router.go({ name: DEFAULT_ROUTE_NAME });
    await clock.tickAsync(0);
    expect(router.meta, 'meta should be empty object for route without meta').to.deep.equal({});

    clock.restore();
  });

  it('should get current path', async function () {
    const clock = sinon.useFakeTimers();

    router.go({ name: TEST_ROUTE_NAME });
    await clock.tickAsync(0);
    expect(
      router.currentPath,
      'currentPath should equal TEST_ROUTE_PATH after navigation to TEST_ROUTE_NAME'
    ).to.equal(TEST_ROUTE_PATH);

    router.go({ name: DEFAULT_ROUTE_NAME });
    await clock.tickAsync(0);
    expect(
      router.currentPath,
      'currentPath should equal DEFAULT_ROUTE_PATH after navigation to DEFAULT_ROUTE_NAME'
    ).to.equal(DEFAULT_ROUTE_PATH);

    clock.restore();
  });
});
