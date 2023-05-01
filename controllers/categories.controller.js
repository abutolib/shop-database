const { read, write, filteredArray } = require('../utils/model')
const categoriesController = {
  GET: (req, res) => {
    const resArray = []
    const categories = read('categories')
    const subCategories = read('subCategories')

    filteredArray(categories, subCategories, "category_id", 'category_name', "categoryId", "categoryName", "subCategories", resArray)

    res.json(200, resArray)
  },
  POST: async (req, res) => {
    try {
      const categories = read('categories')
      let { categoryName } = await req.body
      const findedItem = categories.find(category => category.category_name == categoryName)
      if (findedItem) {
        throw new Error('this category already exist')
      }

      const newCategory = {
        category_id: categories.at(-1)?.category_id + 1 || 1,
        category_name: categoryName
      }

      categories.push(newCategory)
      write('categories', categories)
      res.json(201, { status: 201, message: "category add", data: newCategory })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })

    }

  },
  PUT: async (req, res) => {
    try {
      const categories = read('categories')
      let { categoryId, categoryName } = await req.body
      const findedItem = categories.find(category => category.category_id == categoryId)
      if (!findedItem) {
        throw new Error('this category not found')
      }

      findedItem.category_name = categoryName || findedItem.category_name

      write('categories', categories)
      res.json(200, { status: 200, message: "category update" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }

  },
  DELETE: async (req, res) => {
    try {
      const categories = read('categories')
      let { categoryId } = await req.body
      const categoryIndex = categories.findIndex(category => category.category_id == categoryId)

      if (categoryIndex == -1) {
        throw new Error('this category not found')
      }

      const [deleteCategory] = categories.splice(categoryIndex, 1)
      const filteredArray = read("subCategories").filter(item => item.category_id != categoryId)
      const filteredArray2 = filteredArray.map(item => read("products").filter(subItem => item.sub_category_id == subItem.sub_category_id)).flat()
      console.log(filteredArray2);
      write('products', filteredArray2)
      write('subCategories', filteredArray)
      write('categories', categories)
      res.json(204, { status: 204, message: "category delete" })
    } catch (error) {
      res.json(400, { status: 400, message: error.message })
    }

  },
}

module.exports = categoriesController


//POST

/*
{
    "categoryName":"apteka"
}
*/


//PUT

/*
{
    "categoryId":4,
    "categoryName":"apteka"
}
*/

//DELETE

/*
{
    "categoryId":4
}
*/
