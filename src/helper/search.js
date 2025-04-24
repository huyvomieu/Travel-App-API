module.exports.searchCategory = (arr, q) =>
  arr.filter((item) => {
    return item?.Name.toLowerCase().includes(q);
  });

module.exports.searchUser = (arr, q) =>
  arr.filter((item) => {
    return item?.name.toLowerCase().includes(q);
  });

module.exports.searchItem = (arr, q) =>
  arr.filter((item) => {
    return item?.title.toLowerCase().includes(q);
  });

module.exports.searchByTypeUser = (arr, q) =>
  arr.filter((item) => {
    return item?.[q];
  });
