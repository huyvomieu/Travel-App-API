const { db } = require("../config/firebase");

const itemRef = db.ref("Item");
const userRef = db.ref("users");

module.exports.getInfoByOrder = async (array) => {
  // kiểm tra đầu vào là object không
    if(typeof array === 'object' && !Array.isArray(array) && array !== null) {
      const [snapshotUser, snapshotTour] = await Promise.all([
        userRef.child(array.userName).once("value"),
        itemRef.child(array.itemId).once("value")
      ])
      return {
        ...array,
        userInfo: snapshotUser.val(),
        tourInfo: snapshotTour.val()
      };
    }

    // Nếu là array thì map qua
    const promises = array.map(async (order) => {
      const [snapshotUser, snapshotTour] = await Promise.all([
        userRef.child(order.userName).once("value"),
        itemRef.child(order.itemId).once("value")
      ]);
  
      return {
        ...order,
        userInfo: snapshotUser.val(),
        tourInfo: snapshotTour.val()
      };
    });
  
    return Promise.all(promises);
  };