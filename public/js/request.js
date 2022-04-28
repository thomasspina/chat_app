function makeRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

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
        
        xhr.send(JSON.stringify(data));
    });
}