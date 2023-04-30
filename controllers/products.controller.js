const { read, write } = require('../utils/model')
const productsController = {
  GET: (req, res) => {
    let filteredProducts = []
    const subCategories = read('subCategories')
    const products = read('products')

    const { categoryId, subCategoryId, model } = req.query

    if (categoryId && subCategoryId == undefined && model == undefined) {
      const findSubCategoryId = subCategories.filter(item => item.category_id == categoryId)

      filteredProducts = findSubCategoryId.map(
        item =>
          products
            .filter(
              product => product.sub_category_id == item.sub_category_id))
      filteredProducts=filteredProducts.flat(2)
    }
    if (categoryId == undefined && subCategoryId && model == undefined) {
      filteredProducts = products.filter(product => product.sub_category_id == subCategoryId)
    }
    if (categoryId == undefined && subCategoryId && model) {
      filteredProducts = products.filter(product => product.sub_category_id == subCategoryId && product.model == model)
    }
    if (categoryId == undefined && subCategoryId == undefined && model) {
      filteredProducts = products.filter(product => product.model == model)
    }
    if (categoryId && subCategoryId == undefined && model) {
      const findedItem = subCategories.find(item => item.category_id == categoryId).sub_category_id
      filteredProducts = products.filter(product => product.sub_category_id = findedItem && product.model == model)
    }

    res.json(200, filteredProducts)
  },
  POST: async (req, res) => {
    try {
      const products = read('products')
      let { subCategoryId, productName, price, color, model } = await req.body
      const findedItem = products.find(product => product.sub_category_id == subCategoryId &&
        product.product_name == productName)
      if (findedItem) {
        throw new Error('this product already exist')
      }

      const newProduct = {
        product_id: products.at(-1).product_id + 1 || 1,
        sub_category_id: subCategoryId,
        model,
        product_name: productName,
        color,
        price
      }

      products.push(newProduct)
      write('products', products)
      res.json(201, { status: 201, message: "product add", data: newProduct })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })

    }

  },
  PUT: async (req, res) => {
    try {
      const products = read('products')
      let { productId, productName, price, color } = await req.body
      const findedItem = products.find(product => product.product_id == productId)
      if (!findedItem) {
        throw new Error('this product not found')
      }

      findedItem.product_name = productName || findedItem.product_name
      findedItem.color = color || findedItem.color
      findedItem.price = price || findedItem.price

      write('products', products)
      res.json(200, { status: 200, message: "product update" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }

  },
  DELETE: async (req, res) => {
    try {
      const products = read('products')
      let { productId } = await req.body
      const productIndex = products.findIndex(product => product.product_id == productId)

      if (productIndex == -1) {
        throw new Error('this product not found')
      }

      const [deleteProduct] = products.splice(productIndex, 1)

      write('products', products)
      res.json(200, { status: 200, message: "product delete" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }

  }
}

module.exports = productsController

//POST

// {
//   "subCategoryId": 6,
//   "model": "kitob",
//   "productName": "kitob2",
//   "color": "black",
//   "price": "500"
// }

//PUT

// {
//   "productId": 9,
//   "productName": "kitob3",
//   "price": "500"
// }
