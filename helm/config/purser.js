var config = {
    "purser": {
        "purser_url": "{{ .Values.purser.purser_url }}",
        "client_key": "{{ .Values.purser.client_key }}",
        "form_id": "{{ .Values.purser.form_id }}"
    }
}

function prices() {
    prices_ = {};
    prices_.dataoneplus = 578.52;
    prices_.hostedrepo = 12999.96
    prices_.hastorage = 150.00
    prices_.curation = 698.28
    prices_.customdev = 915.00
    //prices_.customdev = Math.round((915.00/8 + Number.EPSILON) * 100) / 100;
    return(prices_);
}

function labels() {
    labels_ = {};
    labels_.dataoneplus = "DataONE Plus";
    labels_.hostedrepo = "Hosted Repository";
    labels_.hastorage = "HA Storage (/TB)";
    labels_.curation = "Data Curation (/day)";
    labels_.customdev = "Design-Development (/day)";
    return(labels_);
}

let products = ["dataoneplus", "hastorage", "curation", "customdev"];
//let products = ["dataoneplus", "hostedrepo", "hastorage", "curation", "customdev"];
