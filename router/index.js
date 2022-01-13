"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Message_1 = require("../models/Message");
const router = express_1.Router();
exports.router = router;
router.get('/', async (req, res) => {
    try {
        const links = await Message_1.Message.find({});
        res.json(links);
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { body, username } = req.body;
        const message = new Message_1.Message({
            body,
            username,
        });
        await message.save();
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так' });
    }
});
//# sourceMappingURL=index.js.map