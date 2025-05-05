// Tính mốc 7 ngày trước
const now = new Date();
const sevenDaysAgo = new Date();
const twoLastWeeksAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 7);
twoLastWeeksAgo.setDate(now.getDate() - 14);

// Hàm chuyển đổi chuỗi 'dd/mm/yyyy hh:mm:ss' sang Date object
const parseDateString = (dateStr) => {
  const [day, month, yearAndTime] = dateStr.split("/");
  const [year, time] = yearAndTime.split(" ");
  
  return new Date(`${year}-${month}-${day}T${time}`);
};

function getDaysInMonth(year, month) {
  // month: số nguyên từ 1 đến 12
  return new Date(year, month, 0).getDate();
}

module.exports.parseDateString = parseDateString
module.exports.getDaysInMonth = getDaysInMonth

// Lọc đơn hàng
module.exports.totalOrders7DaysAgo = (orders) => {
  return orders.reduce(
    (totalCurrent, order) => {
      const orderDateCreated = parseDateString(order.date);
      const totalNumber = Number.parseFloat(order.total.replaceAll(".", ""));
      if (orderDateCreated >= sevenDaysAgo && orderDateCreated <= now) {
        return {
          total: totalCurrent.total + totalNumber,
          count: ++totalCurrent.count,
        };
      }
      return totalCurrent;
    },
    { total: 0, count: 0 }
  );
};
module.exports.totalOrders14DaysAgo = (orders) => {
  return orders.reduce(
    (totalCurrent, order) => {
      const orderDateCreated = parseDateString(order.date);
      const totalNumber = Number.parseFloat(order.total.replaceAll(".", ""));
      if (orderDateCreated >= twoLastWeeksAgo && orderDateCreated <= sevenDaysAgo) {
        return {
          total: totalCurrent.total + totalNumber,
          count: ++totalCurrent.count,
        };
      }
      return totalCurrent;
    },
    { total: 0, count: 0 }
  );
};


// Lọc khách hàng
module.exports.totalUsers7DaysAgo = (users) => {
  return users.reduce((totalCurrent, user) => {
    const userDateCreated = parseDateString(user.created);
    return userDateCreated >= sevenDaysAgo && userDateCreated <= now
      ? ++totalCurrent
      : totalCurrent;
  }, 0);
};
module.exports.totalUsers14DaysAgo = (users) => {
  return users.reduce((totalCurrent, user) => {
    const userDateCreated = parseDateString(user.created);
    return userDateCreated >= twoLastWeeksAgo && userDateCreated <= sevenDaysAgo
      ? ++totalCurrent
      : totalCurrent;
  }, 0);
};

module.exports.parseDateString = parseDateString;
