"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollProgress = ScrollProgress;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
function ScrollProgress() {
    var _a = (0, react_1.useState)(0), scrollProgress = _a[0], setScrollProgress = _a[1];
    (0, react_1.useEffect)(function () {
        var updateScrollProgress = function () {
            var scrollPx = document.documentElement.scrollTop;
            var winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = scrollPx / winHeightPx;
            setScrollProgress(scrolled);
        };
        window.addEventListener('scroll', updateScrollProgress);
        return function () { return window.removeEventListener('scroll', updateScrollProgress); };
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed top-0 left-0 w-full h-1 bg-gray-200 z-50", children: (0, jsx_runtime_1.jsx)("div", { className: "h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150", style: { width: "".concat(scrollProgress * 100, "%") } }) }));
}
