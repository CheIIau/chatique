"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    body: { type: String, required: true },
    username: { type: String, required: true },
});
exports.Message = mongoose_1.model('Message', schema);
//# sourceMappingURL=Message.js.map