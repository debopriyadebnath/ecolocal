import mongoose, { Schema, models, model } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
  }],
  carbonFootprint: { type: Number, default: 0 },
  sustainabilityScore: { type: Number, default: 0 },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
