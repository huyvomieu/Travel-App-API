const UserModel = require('../models/user.model')
const {db} = require('../config/firebase')
const usersRef = db.ref("users");
class UserController {
    // [GET] api/user
    async get(req,res)  {
        try {
          if(req.query.id) {
            db.ref(`users/${req.query.id}`).once('value', (snapshot) => {
              const user = snapshot.val();
              res.json(user)
            })
          }
          else {
            usersRef.once('value', (snapshot) => {
                const users  = snapshot.val();
                const usersArray = Object.keys(users).map(key => ({
                  id: key,
                  ...users[key]
                }))
                res.json(usersArray)
            })

          }
        } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [POST] api/user
    async post(req,res)  {
        try {
            const {error , value} = UserModel.validate(req.body)
            if(error) {
              return res.status(400).json({error: error.details[0].message})
            }

            // Kiểm tra username đã tồn tại chưa
            
            const username = value.username
            const userRef = usersRef.child(username)
            const snapshot = await userRef.once('value')
            if(snapshot.exists()) {
              return res.status(400).json({ error: "Username already exists" });
            }

            await userRef.set(value)
            res.status(201).json({ id: userRef.key, ...req.body })
            
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [PUT] api/user
    async put(req,res)  {
      try {
        const {error , value} = UserModel.validate(req.body)
        if(error) {
          return res.status(400).json({error: error.details[0].message})
        }
          const username = req.query.username

          await usersRef.child(username).update(value);

          res.status(200).json({ message: "User updated successfully" })
          
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
  }
  // [DELETE] api/user
  async delete(req,res)  {
    try {
      const ids = req.query.ids;
      const paths = {};
      ids.forEach(id => {
        paths[id] = null;
      });
      
      // Remove all ids in array
      await usersRef.update(paths)
      // await usersRef.child(id).remove();
      res.status(200).json({ message: "User deleted successfully", code: 200 })
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
}

module.exports = new UserController()