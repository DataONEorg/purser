var config = {
    "purser": {
        "purser_url": "{{ .Values.purser.purser_url }}",
        "client_key": "{{ .Values.purser.client_key }}",
        "form_id": "{{ .Values.purser.form_id }}"
    }
}

function prices() {
    prices_ = {};
    prices_.dataoneplus = 575.04;
    prices_.hostedrepo = 12999.96
    prices_.hastorage = 150.00
    prices_.curation = 689.00
    prices_.customdev = 915.00
    return(prices_);
}

function labels() {
    labels_ = {};
    labels_.dataoneplus = "DataONE Plus";
    labels_.hostedrepo = "Hosted Repository";
    labels_.hastorage = "HA Storage (1 TB)";
    labels_.curation = "Data Curation (1 day)";
    labels_.customdev = "Design and Development (1 day)";
    return(labels_);
}

//let prods = ["dataoneplus", "hostedrepo", "hastorage", "curation", "customdev"];
let products = ["dataoneplus", "hastorage"];
