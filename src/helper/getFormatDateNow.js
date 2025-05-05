const padZero = (n) => n.toString().padStart(2, '0');

module.exports  = () => {
  const now = new Date();
  return `${padZero(now.getDate())}/${padZero(now.getMonth() + 1)}/${now.getFullYear()} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
};