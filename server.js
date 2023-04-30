
const http = require('http')
const Express = require('./lib/express')
const PORT = process.env.PORT || 5000

const userController = require('./controllers/user.controller')
const adminController = require('./controllers/admin.controller')
const categoriesController = require('./controllers/categories.controller')
const subCategoriesController = require('./controllers/subCategories.controller')
const productsController = require('./controllers/products.controller')

function httpServer(req, res) {
  const app = new Express(req, res)


  app.post('/signin',adminController.POST)

  app.get('/categories', categoriesController.GET)
  app.post('/categories', categoriesController.POST)
  app.put('/categories', categoriesController.PUT)
  app.delete('/categories', categoriesController.DELETE)

  app.get('/subcategories', subCategoriesController.GET)
  app.post('/subcategories', subCategoriesController.POST)
  app.put('/subcategories', subCategoriesController.PUT)
  app.delete('/subcategories', subCategoriesController.DELETE)

  app.get('/products', productsController.GET)
  app.post('/products', productsController.POST)
  app.put('/products', productsController.PUT)
  app.delete('/products', productsController.DELETE)

}
http.createServer(httpServer).listen(PORT, () => console.log('server is running'))
