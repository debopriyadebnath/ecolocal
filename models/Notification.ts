import mongoose, { Schema, models, model } from 'mongoose';

const NotificationSchema = new Schema({
  user: { type: String, required: true },
  type: { type: String, enum: ['order', 'chat', 'system', 'impact'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = models.Notification || model('Notification', NotificationSchema);

export default Notification;
