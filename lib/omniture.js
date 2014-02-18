var integration = require('integration');
var load = require('load-script');
var each = require('each');

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
    .global('s')
    .global('s_ga');


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

Omniture.prototype.getMapping = function(key, overrideProps) {

    var self = this;
    var mapping = self.options.mappings.events[key];
    var localDictionary = {};

    // Extend dictionary with overriding properties
    if(overrideProps) {

    }

    // Fixme perf issue? The dictionaryKeys array could be generated only once
    // Keep a reference of dictionary keys
    var dictionaryKeys = [];

    // Add dictionary
    each(self.options.dictionary, function(k, v) {
        localDictionary[k] = v;
        dictionaryKeys.push(k);
    });

    // Override with local
    each(overrideProps, function(k, v) {
        localDictionary[k] = v;
        dictionaryKeys.push(k);
    });

    // Replace any {variable} with dictionary value
    each(mapping.variables, function(varName, varValue) {

        if(varValue.indexOf("{") !== -1) {

            // Replace bracket item with dictionnary variable
            mapping.variables[varName] = mapping.variables[varName].replace(/{([^}]+)}/g, function(str, p1, offset, s) {

                if(dictionaryKeys.indexOf(p1) !== -1) {
                    return localDictionary[p1];
                } else {
                    // set as NiD when Not in Dictionary
                    return "NiD";
                }

            });
        }

    });

    return mapping;

};

Omniture.prototype.track = function(track, properties) {

    // Get mapping file definitions
    var eventName = track.event();
    var props = track.properties();

    // Get mapping while overriding dictionary with event props
    var mapping = this.getMapping(eventName, props);

//    window.s = s_gi(this.options.s_account);

    var linkTrackVars = [],
        linkTrackEvents = [],
        curEvents = [];

    // Extend the current s.events object so that previously recorded events are not erased
    if (window.s.events) {
        curEvents = window.s.events.split(',');
    }

    // Are there variables to map?
    if(mapping.variables) {

        // Set individual variables
        each(mapping.variables, function(key, value){
            linkTrackVars.push(key);

            // Set variables on Omniture object
            window.s[key] = value;
        });
    }



    // Are there any event to consider?
    if(mapping.events && mapping.events.length) {

        // Add 'events' to the variables to be considered
        linkTrackVars.push('events');

        // Push events to local track event
        each(mapping.events, function(event) {

            // Add event to list of all events
            curEvents.push(event);

            // Add event to list of events to be sent for this call
            linkTrackEvents.push(event);

        });

        // Set Omniture events variable and linkTrackEvents
        window.s.events = curEvents.join(",");
        window.s.linkTrackEvents = linkTrackEvents.join(",");

    }


    // Run Omniture tracking here
    window.s.tl(true, 'o', eventName);


};


/**
 * Load the Google Analytics library.
 *
 * @param {Function} callback
 */

Omniture.prototype.load = function (callback) {
    load(this.options.omnitureFile, callback);
};