var require = {
    baseUrl: ".",
    paths: {
        "tether": "bower_modules/tether/dist/js/tether.min",
        "popper": "bower_modules/popper.js/dist/umd/popper.min'",
        "bootstrap": "bower_modules/bootstrap/dist/js/bootstrap.min",
        "crossroads": "bower_modules/crossroads/dist/crossroads.min",
        "hasher": "bower_modules/hasher/dist/js/hasher.min",
        "jquery": "bower_modules/jquery/dist/jquery",
        "knockout": "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals": "bower_modules/js-signals/dist/signals.min",        
        "text": "bower_modules/requirejs-text/text"
    }
    ,
    shim: {
        "bootstrap": { deps: ["tether","jquery"] }
    }
};