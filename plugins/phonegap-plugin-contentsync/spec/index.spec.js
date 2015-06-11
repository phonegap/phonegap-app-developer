/*!
 * Module dependencies.
 */

var cordova = require('./helper/cordova'),
    contentSync = require('../www'),
    execSpy,
    execWin,
    options;

/*!
 * Specification.
 */

describe('phonegap-plugin-contentsync', function() {
    beforeEach(function() {
        options = { src: 'http://path/to/src.zip', id: 'app-1' };
        execWin = jasmine.createSpy();
        execSpy = spyOn(cordova.required, 'cordova/exec').andCallFake(execWin);
    });

    describe('.sync', function() {
        it('should require the options parameter', function() {
            expect(function() {
                options = undefined;
                contentSync.sync(options);
            }).toThrow();
            expect(execSpy).not.toHaveBeenCalled();
        });

        it('should require the options.src parameter', function() {
            expect(function() {
                options.src = undefined;
                contentSync.sync(options);
            }).toThrow();
            expect(execSpy).not.toHaveBeenCalled();
        });

        it('should require the options.id parameter', function() {
            expect(function() {
                options.id = undefined;
                contentSync.sync(options);
            }).toThrow();
            expect(execSpy).not.toHaveBeenCalled();
        });

        it('should return an instance of ContentSync', function() {
            var sync = contentSync.sync(options);
            expect(sync).toEqual(jasmine.any(contentSync.ContentSync));
        });
    });

    describe('ContentSync instance', function() {
        describe('cordova.exec', function() {
            it('should call cordova.exec on next process tick', function(done) {
                contentSync.sync(options);
                setTimeout(function() {
                    expect(execSpy).toHaveBeenCalledWith(
                        jasmine.any(Function),
                        jasmine.any(Function),
                        'Sync',
                        'sync',
                        jasmine.any(Object)
                    );
                    done();
                }, 100);
            });

            describe('options.src', function() {
                it('should be passed to exec', function(done) {
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[0]).toEqual(options.src);
                        done();
                    });
                    contentSync.sync(options);
                });
            });

            describe('options.id', function() {
                it('should be passed to exec', function(done) {
                    options.id = '1234567890';
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[1]).toEqual(options.id);
                        done();
                    });
                    contentSync.sync(options);
                });
            });

            describe('options.type', function() {
                it('should default to "replace"', function(done) {
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[2]).toEqual('replace');
                        done();
                    });
                    contentSync.sync(options);
                });

                it('should be passed as whatever we specify', function(done) {
                    options.type = 'superduper';
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[2]).toEqual(options.type);
                        done();
                    });
                    contentSync.sync(options);
                });
            });

            describe('options.headers', function() {
                it('should default to null', function(done) {
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[3]).toEqual(null);
                        done();
                    });
                    contentSync.sync(options);
                });

                it('should be passed as whatever we specify', function(done) {
                    options.headers = { 'Authorization': 'SECRET_PASSWORD' };
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[3]).toEqual(options.headers);
                        done();
                    });
                    contentSync.sync(options);
                });
            });

            describe('options.copyCordovaAssets', function() {
                it('should default to false', function(done) {
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[4]).toEqual(false);
                        done();
                    });
                    contentSync.sync(options);
                });
                it('should be passed as whatever we specify', function(done) {
                    options.copyCordovaAssets = true;
                    execSpy.andCallFake(function(win, fail, service, id, args) {
                        expect(args[4]).toEqual(options.copyCordovaAssets);
                        done();
                    });
                    contentSync.sync(options);
                });
            });
        });

        describe('on "progress" event', function() {
            it('should be emitted with an argument', function(done) {
                execSpy.andCallFake(function(win, fail, service, id, args) {
                    win({ 'progress': 1 });
                });
                var sync = contentSync.sync(options);
                sync.on('progress', function(data) {
                    expect(data.progress).toEqual(1);
                    done();
                });
            });
        });

        describe('on "complete" event', function() {
            beforeEach(function() {
                execSpy.andCallFake(function(win, fail, service, id, args) {
                    win({
                        localPath: 'file:///path/to/content'
                    });
                });
            });

            it('should be emitted on success', function(done) {
                var sync = contentSync.sync(options);
                sync.on('complete', function(data) {
                    done();
                });
            });

            it('should provide the data.localPath argument', function(done) {
                var sync = contentSync.sync(options);
                sync.on('complete', function(data) {
                    expect(data.localPath).toEqual('file:///path/to/content');
                    done();
                });
            });
        });

        describe('on "error" event', function() {
            it('should be emitted with an Error', function(done) {
                execSpy.andCallFake(function(win, fail, service, id, args) {
                    fail('something went wrong');
                });
                var sync = contentSync.sync(options);
                sync.on('error', function(e) {
                    expect(e).toEqual(jasmine.any(Error));
                    expect(e.message).toEqual('something went wrong');
                    done();
                });
            });
        });

        describe('.cancel()', function() {
            it('should delegate to exec', function(done) {
                var sync = contentSync.sync(options);
                sync.cancel();
                setTimeout(function() {
                    expect(execSpy).toHaveBeenCalled();
                    expect(execSpy.callCount).toEqual(2); // 1) sync, 2) cancel
                    expect(execSpy.mostRecentCall.args).toEqual([
                        jasmine.any(Function),
                        jasmine.any(Function),
                        'Sync',
                        'cancel',
                        [ options.id ]
                    ]);
                    done();
                }, 100);
            });

            it('should emit the "cancel" event', function(done) {
                execSpy.andCallFake(function(win, fail, service, id, args) {
                    win();
                });
                var sync = contentSync.sync(options);
                sync.on('cancel', function() {
                    done();
                });
                sync.cancel();
            });
        });
    });

    describe('PROGRESS_STATE enumeration', function() {
        it('should defined 0 as STOPPED', function() {
            expect(contentSync.PROGRESS_STATE[0]).toEqual('STOPPED');
        });

        it('should defined 1 as DOWNLOADING', function() {
            expect(contentSync.PROGRESS_STATE[1]).toEqual('DOWNLOADING');
        });

        it('should defined 2 as EXTRACTING', function() {
            expect(contentSync.PROGRESS_STATE[2]).toEqual('EXTRACTING');
        });

        it('should defined 3 as COMPLETE', function() {
            expect(contentSync.PROGRESS_STATE[3]).toEqual('COMPLETE');
        });
    });
});
