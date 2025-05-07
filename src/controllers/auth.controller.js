const { db } = require("../config/firebase");
const adminRef = db.ref("Admin");
const jwt = require('jsonwebtoken');

require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

class AuthController {
  // [GET] api/auth
  async get(req, res) {
    try {
      if (req.query.u) {
        const snapshot = await orderRef.orderByChild('userName').equalTo(req.query.u).once("value");
        
        const order = snapshot.val();
        // Chuyển object =>> array
        let result = ObjectToArray(order)
        // Lấy thêm UserInfo và itemInfo cho đơn hàng
        result = await orderService.getInfoByOrder(result)
        res.json(result);
        
      } else {
        orderRef.once("value", async (snapshot) => {
          const orders = snapshot.val();
          let result = ObjectToArray(orders);
        // Lấy thêm UserInfo và itemInfo cho đơn hàng

          result = await orderService.getInfoByOrder(result)
          // Lọc theo từ khóa
          if (req.query.q) {
            result = search.searchorder(result, req.query.q.toLowerCase().trim());
          }

          result = result.reverse()
          res.json(result);
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/auth/:id
  async getById(req, res) {
    try {
      const snapshot = await orderRef.child(req.params.id).once("value");
        
        const order = snapshot.val();

        // Lấy thêm UserInfo và itemInfo cho đơn hàng
        const result = await orderService.getInfoByOrder(order)
        res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/auth/login
  async login(req, res) {
    try {
      const {email , password} = req.body

      const snapshot = await adminRef.orderByChild('email').equalTo(email).once('value');
      const accountObj =  snapshot.val();
      const key = Object.keys(accountObj)[0]
      const account = accountObj[key]
      if(!account) {
        return res.status(401).json({message: "Email hoặc mật khẩu không hợp lệ"})

      }
      if(account.password !== password) {
        return res.status(401).json({message: "Mật khẩu không đúng"})
      }
      
      const token = jwt.sign({id: key,email: account.email, fullname: account.fullname }, JWT_SECRET, { expiresIn: '7d' });


      res.status(200).json({ message: 'Login successfully', token: token});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/auth/register
  async register(req, res) {
    try {

      await adminRef.push(req.body);
      res.status(201).json({ message: "Created"  });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}

module.exports = new AuthController();
