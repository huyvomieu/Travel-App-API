const { db } = require("../config/firebase");
const orderRef = db.ref("Order");
const usersRef = db.ref("users");
const reviewsRef = db.ref("Review");

const ObjectToArray = require("../helper/ObjectToArrray");
const { getItemByReview } = require("../services/report.service");
const reports = require("../helper/reports");
class ReportController {
  // [GET] api/report/summary
  async summary(req, res) {
    try {
      const response = {
        data: {
          revenue: {
            total: 0,
            psLastWeek: 0,
          },
          orders: {},
          average: {},
          customers: {},
        },
      };
      const snapshot = await orderRef.once("value");
      const order = snapshot.val();
      const result = ObjectToArray(order);

      // Lọc order 7 ngày trước đến hiện tại
      const totalOrders7DaysAgo = reports.totalOrders7DaysAgo(result);

      const totalOrders14DaysAgo = reports.totalOrders14DaysAgo(result);
      response.data.revenue.total = totalOrders7DaysAgo.total;
      response.data.orders.total = totalOrders7DaysAgo.count;

      const totalOrderpsLastWeeek =
        Number.parseFloat(
          totalOrders7DaysAgo.total / totalOrders14DaysAgo.total
        ).toFixed(2) *
          100 -
        100;
      const totalOrderCountpsLastWeeek =
        Number.parseFloat(
          totalOrders7DaysAgo.count / totalOrders14DaysAgo.count
        ).toFixed(2) *
          100 -
        100;

      response.data.revenue.psLastWeek = !isFinite(totalOrderpsLastWeeek)
        ? 100
        : totalOrderpsLastWeeek;
      response.data.orders.psLastWeek = !isFinite(totalOrderCountpsLastWeeek)
        ? 100
        : totalOrderCountpsLastWeeek;

      const snapshotUser = await usersRef.once("value");
      const users = snapshotUser.val();
      const userArray = ObjectToArray(users);

      // Lọc user 7 ngày trước đến hiện tại
      const totalUsers7DaysAgo = reports.totalUsers7DaysAgo(userArray);
      // Lọc user 14 ngày trước đến hiện tại
      const totalUsers14DaysAgo = reports.totalUsers14DaysAgo(userArray);
      const psLastWeek =
        Number.parseFloat(totalUsers7DaysAgo / totalUsers14DaysAgo).toFixed(2) *
          100 -
        100;
      response.data.customers.total = totalUsers7DaysAgo;
      response.data.customers.psLastWeek = psLastWeek;

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  // [GET] api/report/revenue-by-month
  async revenueByMonth(req, res) {
    try {
      const { y, m } = req.query;
      const snapshot = await orderRef.once("value");
      const orders = snapshot.val();

      let result = [];
      const daysInMonth = reports.getDaysInMonth(y, m);
      console.log(daysInMonth);

      for (let i = 1; i <= daysInMonth; i++) {
        result.push({ key: i.toString().padStart(2, "0"), revenue: 0 });
      }
      for (const id in orders) {
        const order = orders[id];

        // if(order.status === 'completed') {

        // }

        const orderCreated = reports.parseDateString(order.date);
        const orderYear = orderCreated.getFullYear().toString();
        const orderMonth = (orderCreated.getMonth() + 1)
          .toString()
          .padStart(2, "0");
        if (orderYear == y && orderMonth == m) {
          const orderDay = orderCreated.getDate().toString().padStart(2, "0");
          const key = orderDay;
          result.map((day) => {
            if (key == day.key) {
              day.revenue += parseFloat(order.total.replaceAll(".", ""));
            }
            return day;
          });
        }
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/report/booking-by-month
  async bookingByMonth(req, res) {
    try {
      const { y, m } = req.query;
      const snapshot = await orderRef.once("value");
      const orders = snapshot.val();

      let result = [];

      for (let i = 1; i <= 12; i++) {
        result.push({ key: i, bookings: 0 });
      }
      for (const id in orders) {
        const order = orders[id];

        // if(order.status === 'completed') {

        // }
        const orderCreated = reports.parseDateString(order.date);
        const orderYear = orderCreated.getFullYear().toString();
        const orderMonth = orderCreated.getMonth() + 1;
        if (orderYear == y) {
          result.map((day) => {
            if (orderMonth == day.key) {
              day.bookings += 1;
            }
            return day;
          });
        }
      }

      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // [GET] api/report/topTours
  async topTours(req, res) {
    try {
      const snapshot = await reviewsRef.once("value");
      const reviewsobj = snapshot.val();
      const reviews = ObjectToArray(reviewsobj);
      // Lấy ra danh sách tours và đánh giá (chưa lọc)
      const listItems = await getItemByReview(reviews);

      const resultMap = {};
     
      listItems.forEach(item => {
        const rating = parseFloat(item.rating)
        if(!resultMap[item.itemId]) {
          resultMap[item.itemId] = {itemId:item.itemId, count: 0, totalAvg: 0 }
        }
        resultMap[item.itemId].count += 1;
        resultMap[item.itemId].totalAvg += rating;
        resultMap[item.itemId].itemInfo = item.itemInfo;

      })

      const result = Object.keys(resultMap).map(item => ({
        itemId: resultMap[item].itemId,
        count: resultMap[item].count,
        rating: (resultMap[item].totalAvg / resultMap[item].count).toFixed(1),
        itemInfo: resultMap[item].itemInfo
      }))

      const data = result.sort((a,b) => a.count < b.count ? 1 : -1)

      res.status(200).json({success: true, data});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReportController();
