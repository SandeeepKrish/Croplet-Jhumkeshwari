const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};
