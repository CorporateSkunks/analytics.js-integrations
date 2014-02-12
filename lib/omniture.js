
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
    .global('s');


// Init generic Omniture
Omniture.prototype.initialize = function() {

};


Omniture.prototype.track = function(event, properties) {

    // Run Omniture tracking here

};