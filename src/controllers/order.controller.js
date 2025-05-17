const { db } = require("../config/firebase");
const orderRef = db.ref("Order");

const ObjectToArray = require("../helper/ObjectToArrray");
const search = require("../helper/search");

const orderService = require('../services/order.service')
class OrderController {
  // [GET] api/order
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
  // [GET] api/order/:id
  async getById(req, res) {
    try {
      const snapshot = await orderRef.child(req.params.id).once("value");
        
        const order = snapshot.val();

        // Lấy thêm UserInfo và itemInfo cho đơn hàng
        const result = await orderService.getInfoByOrder(order)
        result.total = parseInt(order.total.replaceAll('.', ''))
        
        res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/order
  async post(req, res) {
    try {
      const snapshot = await orderRef.once("value"); // Trả về một Promise nếu không truyền dạng callback
      // // Tạo Id mới tiếp theo
      const count = snapshot.numChildren();
      const key = count+1;
      req.body.ordersId = key;
      const { error, value } = orderModel.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      await orderRef.child(key).set(value)

      res.status(201).json({ id: orderRef.key, ...value });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [PUT] api/order
  async put(req, res) {
    try {
      const id = req.query.id;

      await orderRef.child(id).update(req.body);

      res.status(200).json({ message: "order updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [DELETE] api/order
  async delete(req, res) {
    try {
      const id = req.query.id;

      await orderRef.child(id).update({
        deleted: true
      });

      res.status(200).json({ message: "order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
