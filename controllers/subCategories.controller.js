const { read, write, filteredArray } = require('../utils/model')
const subCategoriesController = {
  GET: (req, res) => {
    const resArray = []
    const subCategories = read('subCategories')
    const products = read('products')


    filteredArray(subCategories, products, "sub_category_id", 'sub_category_name', "subCategoryId", "subCategoryName", "products", resArray)

    res.json(200, resArray)
  },

  POST: async (req, res) => {
    try {
      const subCategories = read('subCategories')
      let { categoryId, subCategoryName } = await req.body
      const findedItem = subCategories.find(subCategory => subCategory.sub_category_name == subCategoryName)
      if (findedItem) {
        throw new Error('this subcategory already exist')
      }
      if(!(subCategoryName && categoryId)){
        throw new Error("bodyda kamchilik bor")
      }

      const newSubCategory = {
        sub_category_id: subCategories.at(-1)?.sub_category_id + 1 || 1,
        category_id: categoryId,
        sub_category_name: subCategoryName
      }

      subCategories.push(newSubCategory)
      write('subCategories', subCategories)
      res.json(201, { status: 201, message: "subCategory add", data: newSubCategory })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })

    }
  },

  PUT: async (req, res) => {
    try {
      const subCategories = read('subCategories')
      let { subCategoryId, subCategoryName } = await req.body
      const findedItem = subCategories.find(subCategory => subCategory.sub_category_id == subCategoryId)
      if (!findedItem) {
        throw new Error('this subCategory not found')
      }

      findedItem.sub_category_name = subCategoryName || findedItem.sub_category_name

      write('subCategories', subCategories)
      res.json(200, { status: 200, message: "subCategory update" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },

  DELETE: async (req, res) => {
    try {
      const subCategories = read('subCategories')
      let { subCategoryId } = await req.body
      const subCategoryIndex = subCategories.findIndex(subCategory => subCategory.sub_category_id == subCategoryId)

      if (subCategoryIndex == -1) {
        throw new Error('this subCategory not found')
      }

      const [subDeleteCategory] = subCategories.splice(subCategoryIndex, 1)

      write('subCategories', subCategories)

      res.json(204, { status: 204, message: "subCategory delete" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }
  },
}

module.exports = subCategoriesController

// [
//   [
//       {
//           "product_id": 1,
//           "sub_category_id": 1,
//           "model": "redmi",
//           "product_name": "redmi note 6 pro",
//           "color": "black",
//           "price": "140"
//       },
//       {
//           "product_id": 2,
//           "sub_category_id": 1,
//           "model": "samsung",
//           "product_name": "galaxy 7",
//           "color": "red",
//           "price": "190"
//       },
//       {
//           "product_id": 7,
//           "sub_category_id": 1,
//           "model": "iphone",
//           "product_name": "14 Pro Max",
//           "color": "red",
//           "price": "1400"
//       }
//   ],
//   [
//       {
//           "product_id": 3,
//           "sub_category_id": 2,
//           "model": "Artel",
//           "product_name": "Artel 48 2x",
//           "color": "black",
//           "price": "340"
//       }
//   ],
//   [
//       {
//           "product_id": 4,
//           "sub_category_id": 3,
//           "model": "hp",
//           "product_name": "hp pavilon",
//           "color": "silver",
//           "price": "640"
//       }
//   ],
//   [
//       {
//           "product_id": 5,
//           "sub_category_id": 4,
//           "model": "salamandra",
//           "product_name": "salamandra 42 x1",
//           "color": "black",
//           "price": "32"
//       }
//   ],
//   [
//       {
//           "product_id": 6,
//           "sub_category_id": 5,
//           "model": "polo",
//           "product_name": "polo xr13",
//           "color": "white",
//           "price": "12"
//       }
//   ]
// ]