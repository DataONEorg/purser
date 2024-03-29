function change_listener() {
    var total = calc_total();
    document.getElementById('total_price').innerText = total;
    document.getElementById('service_fee').innerText = total;
}

function quantity(field) {
    var quantity = 1;
    var value = document.getElementById(field).value;
    return(value);
}

function calc_total() {
    var total = 0;
    for (const product of products) {
        if (!!document.getElementById(product) && document.getElementById(product).checked) {
            q = quantity(product+'_q');
            total += q*prices()[product];
            show_terms(product);
        } else if (!!document.getElementById(product) && !document.getElementById(product).checked) {
            hide_terms(product);
        }
    }
    return(total);
}

function products_selected() {
    var prod_string = "";
    
    if (!!document.getElementById('hostedrepo') && document.getElementById('hostedrepo').checked) {
        q = quantity('hostedrepo_q');
        prod_string += "HostedRepo(" + q + ");";
    }
    if (!!document.getElementById('dataoneplus') && document.getElementById('dataoneplus').checked) {
        q = quantity('dataoneplus_q');
        prod_string += "DataONEPlus(" + q + ");";
    }
    if (!!document.getElementById('hastorage') && document.getElementById('hastorage').checked) {
        q = quantity('hastorage_q');
        prod_string += "HAStorage(" + q + ");";
    }
    if (!!document.getElementById('curation') && document.getElementById('curation').checked) {
        q = quantity('curation_q');
        prod_string += "Curation(" + q + ");";
    }
    if (!!document.getElementById('customdev') && document.getElementById('customdev').checked) {
        q = quantity('customdev_q');
        prod_string += "CustomDev(" + q + ");";
    }

    return(prod_string);
}

function random_orderid(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  } 

function create_order() {
    var oid = random_orderid(10500,99999)
    return(oid);
}

function update_iframe(target_url) {
    document.getElementById('pay-frame').src = target_url;
}

function hide_products() {
    document.getElementById( 'products' ).classList.add("hidden");
}

function show_terms(product) {
    document.getElementById( 'terms-'+product ).classList.remove("hidden");
}

function hide_terms(product) {
    document.getElementById( 'terms-'+product ).classList.add("hidden");
}

function checkout() {
    var amount = calc_total();
    var prod_list = products_selected();
    if (amount > 0 && document.getElementById('tos_box').checked ) {
        var orderid = create_order();
        //var pay_base_url = "https://cert.payconex.net/paymentpage/enhanced/?action=view&aid=220614974061&id=31721";
        var pay_base_url = config.purser.purser_url + "&aid=" + config.purser.client_key + "&id=" + config.purser.form_id;
        var payment_url = pay_base_url + "&amount=" + amount + "&orderid=" + orderid + "&products=" + prod_list;
        hide_products();
        update_iframe(payment_url);
    } else if (!document.getElementById('tos_box').checked) {
        document.getElementById( 'tos_link' ).classList.add("required");
    } else {
        update_iframe(" ");
        alert( "Your cart is empty. Select products and try again.");
    }
}

function populate_form() {
    let html = `    <header>
                    <div class="col"></div>
                    <div class="col">Quantity</div>
                    <div class="col right-text">Item Price</div>
                </header>`;

    for (const product of products) {
        html += `
                  <div class="row" id="${product}_row">
                    <div class="col">            
                        <input type="checkbox" id="${product}" name="${labels()[product]}" onchange="change_listener()">
                        <label for="${labels()[product]}">${labels()[product]}</label>
                    </div>
                    <div class="col">            
                        <input type="input" id="${product}_q" name="${labels()[product]}Q" class="qinput" value="1" onchange="change_listener()">
                    </div>
                    <div class="col currency right-text">${prices()[product]}</div>
                </div>`
    }

    html += `
        <div class="row">
            <div class="col">&nbsp;</div>
            <div class="col"></div>
            <div class="col"></div>
        </div>
        <div class="row">
            <div class="col"></div>
            <div class="col">Total: </div>
            <div class="col currency right-text" id="total_price">0.00</div>
        </div>`;

    document.getElementById("ptable").innerHTML = html;
}

populate_dates = function() {
    var dt = new Date().toISOString();
    document.getElementById('agreement_date').innerHTML=dt;
    document.getElementById('signed_date1').innerHTML=dt;
    document.getElementById('signed_date2').innerHTML=dt;
}

window.onload = function() {
    populate_form();
    populate_dates();
    var checkout_button = document.getElementById("checkout");
    if (checkout_button.addEventListener)
        checkout_button.addEventListener("click", checkout, false);
    else if (checkout_button.attachEvent)
        checkout_button.attachEvent('onclick', checkout);    
}

function savePDF() {
    window.jsPDF = window.jspdf.jsPDF;
    window.html2canvas = html2canvas;
    var pdf = new jsPDF('p', 'pt', 'letter', hotfixes = ["px_scaling"]);
    pdf.setFontSize(12);
    pdf.html(
        document.getElementById('tos-body'), 
        {
            callback: function (pdf) {
                pdf.output('pdfobjectnewwindow');
            },
            margin: [20,15,20,10],
            autoPaging: 'true',
            filename: 'dataone-tos.pdf'
        }
    );
}
