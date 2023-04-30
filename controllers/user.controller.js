const { read, write } = require('../utils/model')
const userController = {
    GET:(req, res) => {
      const data = read('users')
      // const { gender } = req.query
      res.json(200,read('users'))
    }
}

module.exports =userController