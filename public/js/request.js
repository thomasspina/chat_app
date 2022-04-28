function makeRequest(method, url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) { // if code is 200-299 then response is success
                resolve(xhr.response);
            } else {
                reject({ 
                    status: xhr.status, 
                    statusText: xhr.statusText
                });
            }
        };

        xhr.onerror = () => {
            reject({ 
                status: xhr.status, 
                statusText: xhr.statusText
            });
        };

        xhr.send();
    });
}

module.exports = { makeRequest };