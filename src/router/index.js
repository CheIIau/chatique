"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const vue_1 = (0, tslib_1.__importDefault)(require("vue"));
const vue_router_1 = (0, tslib_1.__importDefault)(require("vue-router"));
const Home_vue_1 = (0, tslib_1.__importDefault)(require("../views/Home.vue"));
vue_1.default.use(vue_router_1.default);
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home_vue_1.default,
    },
];
const router = new vue_router_1.default({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});
exports.default = router;
//# sourceMappingURL=index.js.map