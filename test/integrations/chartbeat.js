
describe('Chartbeat', function () {

  var analytics = require('analytics');
  var assert = require('assert');
  var Chartbeat = require('integrations/lib/chartbeat');
  var equal = require('equals');
  var sinon = require('sinon');
  var test = require('integration-tester');

  var chartbeat;
  var settings = {
    uid: 'x',
    domain: 'example.com'
  };

  beforeEach(function () {
    analytics.use(Chartbeat);
    chartbeat = new Chartbeat.Integration(settings);
    chartbeat.initialize(); // noop
  });

  afterEach(function () {
    chartbeat.reset();
  });

  it('should have the right settings', function () {
    test(chartbeat)
      .name('Chartbeat')
      .assumesPageview()
      .readyOnLoad()
      .global('_sf_async_config')
      .global('_sf_endpt')
      .global('pSUPERFLY')
      .option('domain', '')
      .option('uid', null);
  });

  describe('#initialize', function () {
    beforeEach(function () {
      chartbeat.load = sinon.spy();
    });

    it('should create window._sf_async_config', function () {
      chartbeat.initialize();
      assert(equal(window._sf_async_config, settings));
    });

    it('should create window._sf_endpt', function () {
      chartbeat.initialize();
      assert('number' === typeof window._sf_endpt);
    });

    it('should call #load', function () {
      chartbeat.initialize();
      assert(chartbeat.load.called);
    });
  });

  describe('#load', function () {
    it('should create window.pSUPERFLY', function (done) {
      chartbeat.load(function (err) {
        if (err) return done(err);
        assert(window.pSUPERFLY);
        done();
      });
    });
  });

  describe('#page', function () {
    beforeEach(function () {
      chartbeat.initialize();
      window.pSUPERFLY = { virtualPage: sinon.spy() };
    });

    it('should send default url', function () {
      chartbeat.page(null, { path: '/path' });
      assert(window.pSUPERFLY.virtualPage.calledWith('/path'));
    });

    it('should send a url', function () {
      chartbeat.page('Page', { path: '/path' });
      assert(window.pSUPERFLY.virtualPage.calledWith('/path', 'Page'));
    });
  });

});