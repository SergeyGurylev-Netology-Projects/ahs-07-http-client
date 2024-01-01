const url = 'http://localhost';
const port = 7070;

export default function request(method, query, body, callback) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status > 299) {
      console.log(`${xhr.status}: ${xhr.statusText}`);
      console.log(xhr.responseText);
      return;
    }

    let data;

    try {
      data = JSON.parse(xhr.responseText);
    } catch (error) {
      console.log(error);
      return;
    }

    callback(data);
  };

  const address = `${url}:${port}${query ? `?${query}` : ''}`;

  xhr.open(method, address);

  xhr.send(body);
}
