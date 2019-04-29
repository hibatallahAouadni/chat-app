'use strict';

if (typeof module === 'object' && typeof define !== 'function') {
    var define = function(factory) {
        module.exports = factory(require, exports, module);
    };
}

define(function(require) {
    var axe = require('./axe'),
        chai = require('chai'),
        expect = chai.expect;

    describe('Axe Unit Tests', function() {
        chai.Assertion.includeStack = true;

        beforeEach(function() {
            axe.logs = [];
        });

        it('should configure appenders correctly', function() {
            expect(axe.appenders.length).to.equal(1);
            expect(axe.appenders).to.contain(axe.defaultAppender);

            axe.removeAppender(axe.defaultAppender);
            expect(axe.appenders.length).to.equal(0);

            axe.addAppender(axe.defaultAppender);
            expect(axe.appenders.length).to.equal(1);

            axe.addAppender(axe.defaultAppender);
            expect(axe.appenders.length).to.equal(1);
        });

        it('should log', function() {
            axe.debug('asd');
            expect(axe.logs[0][0]).to.equal(axe.DEBUG);
            expect(axe.logs[0][1]).to.be.instanceof(Date);
            expect(axe.logs[0][2]).to.not.exist;
            expect(axe.logs[0][3]).to.equal('asd');

            axe.info('asd');
            expect(axe.logs[1][0]).to.equal(axe.INFO);
            expect(axe.logs[1][1]).to.be.instanceof(Date);
            expect(axe.logs[1][2]).to.not.exist;
            expect(axe.logs[1][3]).to.equal('asd');

            axe.warn('asd');
            expect(axe.logs[2][0]).to.equal(axe.WARN);
            expect(axe.logs[2][1]).to.be.instanceof(Date);
            expect(axe.logs[2][2]).to.not.exist;
            expect(axe.logs[2][3]).to.equal('asd');

            axe.error('asd');
            expect(axe.logs[3][0]).to.equal(axe.ERROR);
            expect(axe.logs[3][1]).to.be.instanceof(Date);
            expect(axe.logs[3][2]).to.not.exist;
            expect(axe.logs[3][3]).to.equal('asd');
        });

        it('should log with module', function() {
            axe.debug('my module', 'asd');
            expect(axe.logs[0][0]).to.equal(axe.DEBUG);
            expect(axe.logs[0][1]).to.be.instanceof(Date);
            expect(axe.logs[0][2]).to.equal('my module');
            expect(axe.logs[0][3]).to.equal('asd');

            axe.info('my module', 'asd');
            expect(axe.logs[1][0]).to.equal(axe.INFO);
            expect(axe.logs[1][1]).to.be.instanceof(Date);
            expect(axe.logs[1][2]).to.equal('my module');
            expect(axe.logs[1][3]).to.equal('asd');

            axe.warn('my module', 'asd');
            expect(axe.logs[2][0]).to.equal(axe.WARN);
            expect(axe.logs[2][1]).to.be.instanceof(Date);
            expect(axe.logs[2][2]).to.equal('my module');
            expect(axe.logs[2][3]).to.equal('asd');

            axe.error('my module', 'asd');
            expect(axe.logs[3][0]).to.equal(axe.ERROR);
            expect(axe.logs[3][1]).to.be.instanceof(Date);
            expect(axe.logs[3][2]).to.equal('my module');
            expect(axe.logs[3][3]).to.equal('asd');
        });

        it('should dump logs', function() {
            var i = 0;
            var dumpAppender = {
                log: function(level, component, message) {
                    expect(level).to.equal(0);
                    expect(component).to.exist;
                    expect(message).to.exist;

                    i++;
                }
            };

            axe.removeAppender(axe.defaultAppender);
            axe.debug('testmodule', 'asd');
            axe.debug('testmodule', 'asd');
            axe.debug('testmodule', 'asd');
            axe.debug('testmodule', 'asd');

            axe.dump(dumpAppender);
        });
    });
});