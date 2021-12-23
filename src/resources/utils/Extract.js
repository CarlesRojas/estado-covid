function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob)
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function extractPopupation(data) {
    const result = [];

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const newObj = {};

        if (element.MetaData[1].Variable.Codigo !== "PROV") continue;

        newObj.id = element.MetaData[1].Codigo;
        newObj.name = element.MetaData[1].Nombre;
        newObj.population = Math.round(element.Data[0].Valor);

        result.push(newObj);
    }

    download(JSON.stringify(result), "provinces.json", "application/json");
}

async function extractAPICallsCovidFile(data) {
    for (let i = 0; i < data.countries[0].spain.length; i++) {
        const element = data.countries[0].spain[i];
        const caName = element.id;
        console.log(`https://api.covid19tracking.narrativa.com/api/countries/spain/regions/${caName}/sub_regions`);
    }
}
