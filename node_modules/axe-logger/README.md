# axe

A lightweight logger as UMD module with multiple appenders.

[![Build Status](https://travis-ci.org/whiteout-io/axe.svg?branch=master)](https://travis-ci.org/whiteout-io/axe)

## Use

    // require in node and requireJS
    var axe = require('axe');

    // log stuff
    axe.debug('DEBUG TAG', 'MESSAGE');
    axe.info('DEBUG TAG', 'MESSAGE');
    axe.warn('DEBUG TAG', 'MESSAGE');
    axe.error('DEBUG TAG', 'MESSAGE');

    // log levels
    axe.DEBUG
    axe.INFO
    axe.WARN
    axe.ERROR
    
    // change the log level
    axe.logLevel = axe.DEBUG; // this is the default

    // appenders
    axe.defaultAppender // logs to the console

    var appender = {
        log: function(level, date, component, message) {
            // do stuff
        }
    }    
    axe.addAppender(appender);
    axe.removeAppender(appender);

    // dump all logs
    axe.dump(appender);
