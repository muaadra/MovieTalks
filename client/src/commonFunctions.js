function updateAThread(reqData) {

    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqData)
    };

    fetch("/postAThread/", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.body)
            } else {
                console.log(data)
            }
        });
}

function getRequest() {
    fetch("/getAThread/")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data.body)
            } else {
                console.log(data)
            }
        });
}