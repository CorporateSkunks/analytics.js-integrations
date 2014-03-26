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


/**
 * Generic init
 */
Omniture.prototype.initialize = function() {
    this.load();
};

/**
 * Get mappings and apply overrides for a given event or page (type)
 */
Omniture.prototype.getMapping = function(type, overrideProps, key) {

    var self = this;
    var mapping = [];
    var localDictionary = {};

    switch(type) {
        case "event":
            mapping = self.options.mappings.events[key];
            break;
        case "page":
            mapping = self.options.mappings.page;
            break;
        default:
            //noop
            break;
    }


    // Fixme perf issue? The dictionaryKeys array could be generated only once
    // Keep a reference of dictionary keys
    var dictionaryKeys = [];

    // Add dictionary
    each(self.options.dictionary, function(k, v) {
        localDictionary[k] = v;
        dictionaryKeys.push(k);
    });

    // Extend dictionary with overriding properties
    if(overrideProps) {
        each(overrideProps, function(k, v) {
            localDictionary[k] = v;
            dictionaryKeys.push(k);
        });
    }

    if(mapping && mapping.variables) {
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
    }

    return mapping;

};

/**
 * Apply variables to Omniture framework
 */
Omniture.prototype.applyVariables = function(mapping) {


    var linkTrackVars = [],
        linkTrackEvents = [],
        curEvents = [];

    // Extend the current s.events object so that previously recorded events are not erased
  // Fixme add test for stacked events
//    if (window.s.events) {
//        curEvents = window.s.events.split(',');
//    }

    // Are there variables to map?
    if(mapping && mapping.variables) {

        // Set individual variables
        each(mapping.variables, function(key, value){
            linkTrackVars.push(key);

            // Set variables on Omniture object
            window.s[key] = value;
        });
    }

    // Are there any event to consider?
    if(mapping && mapping.events && mapping.events.length) {

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

    // Add custom vars to linkTrackVars
    window.s.linkTrackVars = linkTrackVars.join(",");

}

/**
 * Track
 *
 *  */
Omniture.prototype.track = function(track, properties) {

    var self = this;

    // Get mapping file definitions
    var eventName = track.event();
    var props = track.properties();

    // Get mapping while overriding dictionary with event props
    var mapping = this.getMapping("event", props, eventName);

//    window.s = s_gi(this.options.s_account);

    self.applyVariables(mapping);

    // Run Omniture tracking here
    window.s.tl(true, 'o', eventName);

};

/**
 * Track page
 */
Omniture.prototype.page = function(page) {

    var self = this,
        name = page.name(),
        category = page.category();

    var mapping = self.getMapping("page");

    self.applyVariables(mapping);

    s.pageName = name;

    if(category) {
        s.channel = category;
    }

    s.t();

};


/**
 * Load the Omniture file.
 *
 * @param {Function} callback
 */
Omniture.prototype.load = function (callback) {
    if(!window.s && (this.options.omnitureFile !== null)) {
        load(this.options.omnitureFile, callback);
    } else {
      callback();
    }

};