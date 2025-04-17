const {db} = require('../config/firebase')
const categorysRef = db.ref("Category");

const ObjectToArray = require('../helper/ObjectToArrray')
class CategoryController {
    // [GET] api/category
    async get(req,res)  {
        try {
          if(req.query.id) {
            categorysRef.child(req.query.id).once('value', (snapshot) => {
              const category = snapshot.val();
              res.json(category)
            })
          }
          else {
            categorysRef.once('value', (snapshot) => {
              const Categorys  = snapshot.val();
              const categoryArray = ObjectToArray(Categorys)
              res.json(categoryArray)
          })
        }
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [POST] api/category
    async post(req,res)  {
        try {
          console.log("OK");
          
          const snapshot = await categorysRef.once('value') // Trả về một Promise nếu không truyền dạng callback
          // Tạo Id mới tiếp theo
          req.body.Id = snapshot.numChildren();

          // await categorysRef.child(req.body.Id).set(req.body)

          const newRef = categorysRef.push();
          await newRef.set(req.body)

          res.status(201).json({ id: categorysRef.key, ...req.body })
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    // [PUT] api/category
    async put(req,res)  {
      try {
          const id = req.query.id

          await CategorysRef.child(id).update(req.body);

          res.status(200).json({ message: "Category updated successfully" })
          
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
  }
  // [DELETE] api/category
  async delete(req,res)  {
    try {
      const id = req.query.id

      await categorysRef.child(id).remove();

      res.status(200).json({ message: "Category deleted successfully" })
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
}

module.exports = new CategoryController()