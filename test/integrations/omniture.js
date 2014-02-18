describe('Omniture', function () {

    var stringify = JSON.stringify;
    // Consider using AdobePulse Debugger tools in browser test @see https://developer.omniture.com/en_US/content_page/sitecatalyst-tagging/c-verify-the-tagging-code-with-the-adobe-digitalpulse-debugger

    var analytics = require('analytics');
    var assert = require('assert');
    var equal = require('equals');
    var Omniture = require('integrations/lib/omniture');
    var sinon = require('sinon');
    var test = require('integration-tester');
//
    var omniture;
    var settings = {
        s_account: "123",
        omnitureFile: "http://localhost/opfiles/cc/static/assets/common/js/event-tracker/omniture.js",

        dictionary: {
            breadcrumbs: "breadcrumb1-breadcrumb2",
            catFood: "fish"
        },
        mappings: {
            page: {
                "pageName": "{breadcrumbs}"
            },
            events: {
                "Pay bill": {
                    variables: {
                        "evar56": "Credit Card"
                    },
                    events: ["event5"]
                },
                "Feed cat": {
                    variables: {
                        "prop1": "{catFood}"
                    }
                }
            }
        }
    };


    beforeEach(function (done) {

        JSON.stringify = function(obj) {
            var seen = [];

            return stringify(obj, function(key, val) {
                if (typeof val === "object") {
                    if (seen.indexOf(val) >= 0) { return; }
                    seen.push(val);
                }
                return val;
            });
        };

        analytics.use(Omniture);
        omniture = new Omniture.Integration(settings);

        window.oca = {config: {debug: {}}};

        omniture.load(function(err, e) {
            if(err) done(err);
            done();
        });
    });

    afterEach(function () {
        JSON.stringify = stringify;
        omniture.reset();
    });

    describe("#Initialize", function() {
        it("Should be called omniture", function() {

            test(omniture)
                .name("Omniture")
                .global("s");

        });
    });


    describe('#load', function () {

        it('should load the Omniture file', function (done) {

            // TODO remove me when omniture file is cleaned up
            window.oca = {config: {debug: {}}};

            omniture.load(function(err, e) {
                if(err) done(err);
                assert(typeof(window.s) === "object");
                done();
            });

        });
    });

    describe("#Page", function() {


        it("Should track a page", function(done) {

            omniture.load(function(err, e) {
                if(err) done(err);

                window.s.t = sinon.spy();
                test(omniture)
                    .page();

                assert(window.s.t.called);
                done();
            });

        });

    });


    describe("#Track event", function() {

        it("Should track a single event with a static variable", function() {


                window.s.tl = sinon.spy();
                test(omniture)
                    .track('Pay bill');

                // Assert that Omniture send tracking function is called appropriately
                assert(window.s.tl.calledWith(true, 'o', 'Pay bill'));

                // Assert static variables from mapping
                assert(equal(window.s.evar56, 'Credit Card'));

                // Expect events to contain 'event5'
                assert(window.s.events.indexOf('event5') !== -1);

        });



        it("Should track a single event with a dynamic variable", function() {

                test(omniture)
                    .track('Feed cat');

                // Assert dynamic variables from mapping
                assert(equal(window.s.prop1, 'fish'));

                // Should have no events
            console.log(window.s.linkTrackEvents);
                assert(window.s.linkTrackEvents == "None");

        });


        it("Should track a single event with overriding dictionary parameter", function() {

            test(omniture)
                .track('Feed cat', {
                    catFood: "dog!"
                });

            // Assert dynamic variables from track() params
            assert(equal(window.s.prop1, 'dog!'));

            // Should have no events
            assert(window.s.linkTrackEvents == "None");

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