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
