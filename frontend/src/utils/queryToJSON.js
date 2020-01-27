function queryToJSON(queryString) {
  let pairs = queryString.slice(1).split("&");
  let result = {};

  for (let pair of pairs) {
    pair = pair.split("=");
    result[pair[0]] = decodeURIComponent(pair[1] || "");
  }
  return result;
}

export default queryToJSON;
