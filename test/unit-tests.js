/// <reference path="../vendor/jasmine-2.0.0/boot.js" />
/// <reference path="../src/underscroll.js" />

(function() {

    var elementScrollLimit = 100;

    var methods = window.Underscroll.internal;

    function createElementMock(options) {
        options = options || {};
        var scrollTop = options.scrollTop || 0;

        return {
            scrollTop: function(newScrollTop) {
                if (newScrollTop !== void (0)) {
                    scrollTop = Math.min(elementScrollLimit, newScrollTop);
                }

                return scrollTop;
            }
        };
    }

    describe('scroll up test', function() {
        describe('when element scrolled to top', function() {
            it('cannot scroll up', function() {
                var element = createElementMock({ scrollTop: 0 });
                expect(methods.canScrollUp(element)).toBe(false);
            });
        });

        describe('when element scrolled down a little', function() {
            it('can scroll up', function() {
                var element = createElementMock({ scrollTop: 42 });
                expect(methods.canScrollUp(element)).toBe(true);
            });
        });

        describe('when element scrolled to bottom', function() {
            it('can scroll up', function() {
                var element = createElementMock({ scrollTop: elementScrollLimit });
                expect(methods.canScrollUp(element)).toBe(true);
            });
        });
    });

    describe('scroll down test', function() {
        describe('when element scrolled to top', function() {
            it('cannot scroll up', function() {
                var element = createElementMock({ scrollTop: 0 });
                expect(methods.canScrollDown(element)).toBe(true);
            });
        });

        describe('when element scrolled down a little', function() {
            it('can scroll up', function() {
                var element = createElementMock({ scrollTop: 42 });
                expect(methods.canScrollDown(element)).toBe(true);
            });
        });

        describe('when element scrolled to bottom', function() {
            it('can scroll up', function() {
                var element = createElementMock({ scrollTop: elementScrollLimit });
                expect(methods.canScrollDown(element)).toBe(false);
            });
        });
    });

    describe('allow scroll test', function () {
        describe('when target is not scrollable', function() {
            it('disallows scroll', function() {
                function findScrollableParent(target) {
                    return undefined; // Pretend we can't find scrollable parent.
                }

                var element = createElementMock({ scrollTop: 10 });

                expect(methods.allowScroll(-4, element, findScrollableParent)).toBe(false);
            });
        });

        describe('when target is scrollable', function() {
            var element;

            function allowScroll(dScreenY, target) {
                return methods.allowScroll(dScreenY, target, function(e) { return e; });
            }

            describe('when element scrolled to top', function() {
                beforeEach(function() {
                    element = createElementMock({ scrollTop: 0 });
                });

                describe('swiping down', function() {
                    var dScreenY = 4; // Move finger 4 pixels down the screen.
                    it('disallows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(false);
                    });
                });

                describe('swiping up', function() {
                    var dScreenY = -4; // Move finger 4 pixels up the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });

                describe('swiping sideways', function() {
                    var dScreenY = 0; // Finger moved only horizontally on the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });
            });

            describe('when element scrolled part way down', function() {
                beforeEach(function() {
                    element = createElementMock({ scrollTop: 42 });
                });

                describe('swiping down', function() {
                    var dScreenY = 4; // Move finger 4 pixels down the screen.
                    it('disallows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });

                describe('swiping up', function() {
                    var dScreenY = -4; // Move finger 4 pixels up the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });

                describe('swiping sideways', function() {
                    var dScreenY = 0; // Finger moved only horizontally on the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });
            });

            describe('when element scrolled to bottom', function() {
                beforeEach(function() {
                    element = createElementMock({ scrollTop: elementScrollLimit });
                });

                describe('swiping down', function() {
                    var dScreenY = 4; // Move finger 4 pixels down the screen.
                    it('disallows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });

                describe('swiping up', function() {
                    var dScreenY = -4; // Move finger 4 pixels up the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(false);
                    });
                });

                describe('swiping sideways', function() {
                    var dScreenY = 0; // Finger moved only horizontally on the screen.
                    it('allows scroll', function() {
                        expect(allowScroll(dScreenY, element)).toBe(true);
                    });
                });
            });

        });

    });

})();
