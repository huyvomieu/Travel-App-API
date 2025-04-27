const ItemModel = require("../models/item.model");

const { db } = require("../config/firebase");
const itemsRef = db.ref("Item");

const ObjectToArray = require("../helper/ObjectToArrray");
const search = require("../helper/search");
class ItemController {
  // [GET] api/item
  async get(req, res) {
    try {
      if(req.query.c) {
        const c_number = Number(req.query.c);
        // Ép kiểu sang Number trước khi lọc theo category
        if(c_number) {
          var itemByCategory = await itemsRef.orderByChild('categoryId').equalTo(c_number).once('value');
        } else {
          // Nếu không ép được sẽ lấy all bản ghi
          var itemByCategory = await itemsRef.once('value');
        }
        let result = itemByCategory.val();
        result = ObjectToArray(result);
        res.json(result);
      }
      else if (req.query.id) {
        itemsRef.child(req.query.id).once("value", (snapshot) => {
          const item = snapshot.val();
          item.key = req.query.id;
          res.json(item);
        });
      } else {
        itemsRef.orderByChild('deleted').equalTo(false).once("value", (snapshot) => {
          const items = snapshot.val();
          let result = ObjectToArray(items);

          // Lọc theo từ khóa
          if (req.query.q) {
            result = search.searchItem(result, req.query.q.toLowerCase().trim());
          }

          res.json(result);
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/item
  async post(req, res) {
    try {
      console.log(req.body);
      const snapshot = await itemsRef.once("value"); // Trả về một Promise nếu không truyền dạng callback
      // // Tạo Id mới tiếp theo
      const count = snapshot.numChildren();
      const key = count+1;
      req.body.itemsId = key;
      const { error, value } = ItemModel.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      await itemsRef.child(key).set(value)

      res.status(201).json({ id: itemsRef.key, ...value });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [PUT] api/item
  async put(req, res) {
    try {
      const id = req.query.id;

      await itemsRef.child(id).update(req.body);

      res.status(200).json({ message: "item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [DELETE] api/item
  async delete(req, res) {
    try {
      const id = req.query.id;

      await itemsRef.child(id).update({
        deleted: true
      });

      res.status(200).json({ message: "item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ItemController();
