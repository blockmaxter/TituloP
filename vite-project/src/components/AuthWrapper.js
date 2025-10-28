"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthWrapper;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PermissionsContext_1 = require("@/contexts/PermissionsContext");
function AuthWrapper(_a) {
    var children = _a.children;
    return ((0, jsx_runtime_1.jsx)(PermissionsContext_1.PermissionsProvider, { children: children }));
}
