module.exports.searchCategory = (arr, q) =>
  arr.filter((item) => {
    return item?.Name.toLowerCase().includes(q);
  });

module.exports.searchUser = (arr, q) =>
  arr.filter((item) => {
    const keyword = q.toLowerCase();
    return (
      item?.name?.toLowerCase().includes(keyword) ||
      item?.email?.toLowerCase().includes(keyword) ||
      item?.username?.toLowerCase().includes(keyword) ||
      item?.phone?.toLowerCase().includes(keyword)
    );
  });

module.exports.searchItem = (arr, q) =>
  arr.filter((item) => {
    return item?.title.toLowerCase().includes(q);
  });

module.exports.searchByTypeUser = (arr, q) =>
  arr.filter((item) => {
    return item?.[q];
  });
