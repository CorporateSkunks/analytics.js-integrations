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

//    this.options.omnitureFile

    this.load();


};
Omniture.prototype.page = function(event, properties) {
//    var category = page.category();
//    var props = page.properties();
//    var name = page.fullName();
//    var track;
    // Run Omniture tracking here

    s.t();


};

Omniture.prototype.track = function(event, properties) {

    // Run Omniture tracking here

};


/**
 * Load the Google Analytics library.
 *
 * @param {Function} callback
 */

Omniture.prototype.load = function (callback) {
    load("//oneportal.local.optus.com.au/opfiles/cc/static/assets/common/js/event-tracker/omniture.js", callback);
};