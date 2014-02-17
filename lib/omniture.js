var integration = require('integration');
var load = require('load-script');

/**
 * Expose plugin.
 */

module.exports = exports = function (analytics) {
    analytics.addIntegration(Omniture);
};


/**
 * Expose `Omniture` integration.
 */

var Omniture = exports.Integration = integration('Omniture')
    .readyOnLoad()
    .global('s_account');


// Init generic Omniture
Omniture.prototype.initialize = function() {

    this.load();


};
Omniture.prototype.page = function(event, properties) {
//    var category = page.category();
//    var props = page.properties();
//    var name = page.fullName();
//    var track;
    // Run Omniture tracking here

    // TODO
    s.pageName = "";

    s.t();


};

Omniture.prototype.track = function(track, properties) {

    // Get mapping file definitions
    console.log(track.event());

    // Set individual variables
    var s = s_gi(this.options.s_account);

    // Handle each mapping definitions ['events']

        // Set events var or only extend it? -- Mapping file
        s.events = '';

        // Set events to be followed up -- Mapping file
        s.linkTrackEvents = '';

    // Run Omniture tracking here
    s.tl(true, 'o', track.event());

};


/**
 * Load the Google Analytics library.
 *
 * @param {Function} callback
 */

Omniture.prototype.load = function (callback) {
    load("//localhost/opfiles/cc/static/assets/common/js/event-tracker/omniture.js", callback);
};