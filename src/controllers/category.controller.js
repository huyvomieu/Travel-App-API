const { db } = require("../config/firebase");
const categorysRef = db.ref("Category");
const itemModel = require('../models/category.model')
const ObjectToArray = require("../helper/ObjectToArrray");
const pickProperties = require("../helper/pickProperties");
const search = require("../helper/search");
class CategoryController {
  // [GET] api/category
  async get(req, res) {
    try {
      if (req.query.id) {
        categorysRef.child(req.query.id).once("value", (snapshot) => {
          const category = snapshot.val();
          if(category && category.deleted === false) {
            res.json(category)
          }
          else {
            res.status(404).json({message: 'Category không tồn tại hoặc đã bị xóa!'})
          }
        });
      } else {
        categorysRef.orderByChild('deleted').equalTo(false).once("value", (snapshot) => {
          const Categorys = snapshot.val();

          // Chuyển Object Sang Array
          let result = ObjectToArray(Categorys);

          // Lọc theo từ khóa
          if (req.query.q) {
            result = search.searchCategory(result, req.query.q.toLowerCase());
          }

          // Lọc Properties theo type
          if (req.query.type) {
            result = result.map((category) => {
              return pickProperties(category, req.query.type);
            });
          }

          res.json(result);
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/category
  async post(req, res) {
    try {
      const {value, error} = itemModel.validate(req.body);
      if(error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const snapshot = await categorysRef.once("value"); // Trả về một Promise nếu không truyền dạng callback
      // Tạo Id mới tiếp theo
      const count = snapshot.numChildren();
      const key = count+1;
      value.Id = key;
      await categorysRef.child(key).set(value)

      res.status(201).json({ key: categorysRef.key, ...req.body });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [PUT] api/category
  async put(req, res) {
    try {
      const id = req.query.id;
      const {value, error} = itemModel.validate(req.body);
      if(error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      await categorysRef.child(id).update(value);

      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [DELETE] api/category
  async delete(req, res) {
    try {
      const id = req.query.id;

      await categorysRef.child(id).update({deleted: true});

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
