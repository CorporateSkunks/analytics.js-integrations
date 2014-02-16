describe('Omniture', function () {


    var analytics = require('analytics');
    var assert = require('assert');
//    var iso = require('to-iso-string');
    var Omniture = require('integrations/lib/omniture');
    var sinon = require('sinon');
    var test = require('integration-tester');
//
    var omniture;
    var settings = {
        s_account: "123",
        omnitureFile: "http://localhost/opfiles/cc/static/assets/common/js/event-tracker/omniture.js"
    };


    beforeEach(function () {
        analytics.use(Omniture);
        omniture = new Omniture.Integration(settings);
//            sinon.stub(omniture, "load");
//            omniture.load = sinon.spy();
    });

    afterEach(function () {
        omniture.reset();
    });

    describe("#Initialize", function() {
        it("Should be called omniture", function() {

            test(omniture)
                .name("Omniture")
                .global("s_account");

        });
    });


    describe('#load', function () {
        beforeEach(function () {
            sinon.stub(omniture, 'load');
            omniture.initialize();
            omniture.load.restore();
        });

        it('should load the Omniture file', function (done) {

            // TODO remove me when omniture file is cleaned up
            window.oca = {config: {debug: {}}};

            omniture.load(function(err, e) {
                if(err) done(err);
                assert(window.s);
                done();
            });

        });
    });

    describe("#Page", function() {

        beforeEach(function () {
            sinon.stub(omniture, 'load');
            omniture.initialize();
            omniture.load.restore();
        });

        it("Should track a page", function(done) {

            window.oca = {config: {debug: {}}};
            omniture.load(function(err, e) {
                if(err) done(err);

                window.s.t = sinon.spy();
                test(omniture)
                    .page();

                assert(s.t.called);
                done();
            });

        });

    });




    // Check that omniture file is loaded

    // Should initialize
        // Should have a global variable


    // Should Track page

    // Track user

    // Should Track events - Transactions

    // Track links

    // Track forms



    // Can override configs




});