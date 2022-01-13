import { Schema, model } from 'mongoose';

const schema = new Schema({
  body: { type: String, required: true },
  username: { type: String, required: true},
});

export const Message = model('Message', schema);
