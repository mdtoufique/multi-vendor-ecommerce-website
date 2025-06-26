const mongoose = require('mongoose')
const axios = require('axios')
require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce'

const productSchema = new mongoose.Schema({
  sellerId: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  category: String,
  brand: String,
  price: Number,
  stock: Number,
  discount: Number,
  description: String,
  shopName: String,
  images: [String],
  rating: Number
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

const fetchAndSeedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('MongoDB connected')

    const response = await axios.get('https://fakestoreapi.com/products?limit=100')
    const apiProducts = response.data

    // Transform data to your schema
    const sellerId = new mongoose.Types.ObjectId('68356a3ffd99e82a5325f9ea') // replace with real sellerId

    const productsToInsert = apiProducts.map(p => ({
      sellerId,
      name: p.title,
      slug: p.title.toLowerCase().replace(/\s+/g, '-'),
      category: p.category,
      brand: 'FakeStoreBrand', // no brand in API, so fixed placeholder
      price: Math.floor(p.price),
      stock: Math.floor(Math.random() * 50) + 1, // random stock 1-50
      discount: 0, // no discount info in API
      description: `<p>${p.description}</p>`,
      shopName: 'Demo Shop',
      images: [p.image],
      rating: p.rating && p.rating.rate ? p.rating.rate : 0
    }))

    await Product.insertMany(productsToInsert)
    console.log(`${productsToInsert.length} products inserted.`)
    process.exit(0)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

fetchAndSeedProducts()
