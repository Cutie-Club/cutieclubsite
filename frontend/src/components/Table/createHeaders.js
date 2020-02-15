import React from "react";

function createHeaders(rows, tableHeader) {
  let jsonKeys = [];
  for (let index in rows) {
    let item = rows[index];
    jsonKeys.push(...Object.keys(item));
  }

  let headers = [...new Set(jsonKeys)];
  headers.push("Actions");

  headers.forEach((item, i) => {
    tableHeader.push(
      <th scope="col" key={i}>
        {item}
      </th>
    );
  });

  return headers;
}

export default createHeaders;
