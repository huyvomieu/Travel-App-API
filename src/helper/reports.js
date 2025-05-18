// Tính mốc 7 ngày trước
const now = new Date();
const sevenDaysAgo = new Date();
const twoLastWeeksAgo = new Date();
sevenDaysAgo.setDate(now.getDate() - 7);
twoLastWeeksAgo.setDate(now.getDate() - 14);

// Hàm chuyển đổi chuỗi 'dd/mm/yyyy hh:mm:ss' sang Date object
const parseDateString = (dateStr) => {
  if(!dateStr) {
    return new Date();
  }
  const [day, month, yearAndTime] = dateStr?.split("/");
  const [year, time] = yearAndTime?.split(" ");
  
  return new Date(`${year}-${month}-${day}T${time}`);
};

function getDaysInMonth(year, month) {
  // month: số nguyên từ 1 đến 12
  return new Date(year, month, 0).getDate();
}

function isSameDate(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

module.exports.parseDateString = parseDateString
module.exports.getDaysInMonth = getDaysInMonth
module.exports.isSameDate = isSameDate

// Lọc đơn hàng
module.exports.totalOrdersToday = (orders) => {
  return orders.reduce(
    (totalCurrent, order) => {
      const orderDateCreated = parseDateString(order.date);
      const totalNumber = Number.parseFloat(order.total.replaceAll(".", ""));
      console.log(orderDateCreated);
      
      if ( isSameDate(orderDateCreated, now)) {
        
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
module.exports.totalUsersToday = (users) => {
  return users.reduce((totalCurrent, user) => {
    const userDateCreated = parseDateString(user.created);
    return isSameDate(userDateCreated, now)
      ? ++totalCurrent
      : totalCurrent;
  }, 0);
};

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

// Lọc tour ngày hiện tại
module.exports.totalTourToday = (tours) => {
  return tours.reduce((totalCurrent, tour) => {
    const tourDateCreated = new Date(tour.created);
    return isSameDate(tourDateCreated, now)
      ? ++totalCurrent
      : totalCurrent;
  }, 0);
};

