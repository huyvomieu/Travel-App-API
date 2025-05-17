const { db } = require("../config/firebase");

const itemRef = db.ref("Item");
const orderRef = db.ref("Order");

module.exports.getItemByReview = async (reviews) => {
    // Nếu là array thì map qua
    const promises = reviews.map(async (review) => {
        const snapshotOrder = await orderRef.orderByChild('orderId').equalTo(review.orderId).once("value");
        const orderObj = snapshotOrder.val();
        const order = orderObj[Object.keys(orderObj)[0]]
        const snapshotItem = await itemRef.child(order.itemId).once("value");
        const item = snapshotItem.val();
        return {
        itemInfo: item,
        itemId: item.itemsId,
        orderId: review.orderId,
        reviewId: review.reviewId,
        rating: review.ratingValue
      };
    });
  
    return Promise.all(promises);
}