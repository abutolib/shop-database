const { read, write, hashPassword } = require('../utils/model')
const adminController = {
  POST: async (req, res) => {
    let { username, password } = await req.body
    const admins = read('admins')
    try {
      password = hashPassword(password)
      let admin = admins.find(admin => admin.username == username && admin.password == password)

      if (!admin) throw new Error('wrong username or password')

      res.json(200,{status:200,message:"welcome to our web-site"})
    } catch (error) {
      res.json(400,{status:400,message:error.message})
    }
  }
}

module.exports = adminController