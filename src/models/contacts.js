const mongoose = require('mongoose');

const mongooseContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String },
  isFavourite: { type: Boolean, default: false },
  contactType: {
    type: String,
    enum: ['friend', 'family', 'work','personal'],
    required: true,
    default: 'personal',
  },
}, { timestamps: true, versionKey: false });

const Contact = mongoose.model('Contact', mongooseContactSchema, 'contacts');

module.exports = { Contact };
