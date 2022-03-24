const checkSearchHistory = (array, keyword) => {
  if (array.includes(keyword)) {
    const index = array.indexOf(keyword);
    array.splice(index, 1);
    array.unshift(keyword);
    return array;
  } else {
    array.unshift(keyword);
    if (array.length <= 5) {
      return array;
    } else {
      array.pop();
      return array;
    }
  }
};

export default checkSearchHistory;
