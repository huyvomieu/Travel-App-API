const { db } = require("../config/firebase");
const categorysRef = db.ref("Category");

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
          res.json(category);
        });
      } else {
        categorysRef.once("value", (snapshot) => {
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

      const snapshot = await categorysRef.once("value"); // Trả về một Promise nếu không truyền dạng callback
      // Tạo Id mới tiếp theo
      const count = snapshot.numChildren();
      const key = count+1;
      req.body.Id = key;
      await categorysRef.child(key).set(req.body)

      res.status(201).json({ key: categorysRef.key, ...req.body });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [PUT] api/category
  async put(req, res) {
    try {
      const id = req.query.id;

      await CategorysRef.child(id).update(req.body);

      res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [DELETE] api/category
  async delete(req, res) {
    try {
      const id = req.query.id;

      await categorysRef.child(id).remove();

      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
