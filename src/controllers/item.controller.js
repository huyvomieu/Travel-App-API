const ItemModel = require("../models/item.model");

const { db } = require("../config/firebase");
const itemsRef = db.ref("Item");

const ObjectToArray = require("../helper/ObjectToArrray");
const search = require("../helper/search");
const LIMIT_PAGE = 10;
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
          if(!item) {
            return res.status(400).json({message: 'Không tìm thấy tour'})
          }
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
          const pagination = {}
          if(req.query.page) {
            const current_page = Number(req.query.page);
            const total_tour = result.length
            const total_page = Math.ceil(total_tour / LIMIT_PAGE)

            if(current_page < 1 || current_page > total_page) {
              return res.status(400).json({message: "page đầu vào không phù hợp"})
            }

            const startIndex = current_page * LIMIT_PAGE - LIMIT_PAGE;
            const endIndex = current_page * LIMIT_PAGE
            
            result = result.slice(startIndex,endIndex)
            pagination.total_tour = total_tour
            pagination.total_page = total_page
            pagination.current_page = current_page
            pagination.count = LIMIT_PAGE
            pagination.per_page  = result.length

          }

          res.json({data: result, meta: {pagination}});
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [POST] api/item
  async post(req, res) {
    try {
      // Lấy ra opbj cuổi cùng
      const snapshot = await itemsRef.orderByKey().limitToLast(1).once("value"); 
      // // Tạo Id mới tiếp theo
      const lastObj = snapshot.val();
      const lastKey = Object.keys(lastObj)[0];
      const nextKey = Number.parseInt(lastKey) +1;
      req.body.itemsId = nextKey;
      const { error, value } = ItemModel.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      await itemsRef.child(nextKey).set(value)

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
