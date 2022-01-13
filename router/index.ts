import { Router } from 'express';
import { Message } from '../models/Message';
const router = Router();

router.get('/', async (req, res) => {
  try {
    const links = await Message.find({});
    res.json(links);
  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { body, username } = req.body;
    const message = new Message({
      body,
      username,
    });
    await message.save();

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

export { router };
