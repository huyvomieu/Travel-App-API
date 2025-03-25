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
                res.json(users)
            })

          }
        } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [POST] api/user
    async post(req,res)  {
        try {
            const newUserRef = usersRef.push()
            await newUserRef.set(req.body)

            res.status(201).json({ id: newUserRef.key, ...req.body })
            
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [PUT] api/user
    async put(req,res)  {
      try {
          const id = req.query.id

          await usersRef.child(id).update(req.body);

          res.status(200).json({ message: "User updated successfully" })
          
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
  }
  // [DELETE] api/user
  async delete(req,res)  {
    try {
      const id = req.query.id

      await usersRef.child(id).remove();

      res.status(200).json({ message: "User deleted successfully" })
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
}

module.exports = new UserController()