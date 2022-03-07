function change_listener() {
    document.getElementById('total_price').innerText = calc_total();
}

function quantity(field) {
    var quantity = 1;
    var value = document.getElementById(field).value;
    return(value);
}

function calc_total() {
    var total = 0;
    if (document.getElementById('hostedrepo').checked) {
        q = quantity('hostedrepo_q');
        total += q*prices().hostedrepo;
    }
    if (document.getElementById('dataoneplus').checked) {
        q = quantity('dataoneplus_q');
        total += q*prices().dataoneplus;
    }
    if (document.getElementById('hastorage').checked) {
        q = quantity('hastorage_q');
        total += q*prices().hastorage;
    }
    if (document.getElementById('curation').checked) {
        q = quantity('curation_q');
        total += q*prices().curation;
    }
    if (document.getElementById('customdev').checked) {
        q = quantity('customdev_q');
        total += q*prices().customdev;
    }

    return(total);
}

function products_selected() {
    var products = "";
    if (document.getElementById('hostedrepo').checked) {
        q = quantity('hostedrepo_q');
        products += "HostedRepo(" + q + ");";
    }
    if (document.getElementById('dataoneplus').checked) {
        q = quantity('dataoneplus_q');
        products += "DataONEPlus(" + q + ");";
    }
    if (document.getElementById('hastorage').checked) {
        q = quantity('hastorage_q');
        products += "HAStorage(" + q + ");";
    }
    if (document.getElementById('curation').checked) {
        q = quantity('curation_q');
        products += "Curation(" + q + ");";
    }
    if (document.getElementById('customdev').checked) {
        q = quantity('customdev_q');
        products += "CustomDev(" + q + ");";
    }

    return(products);
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

function checkout() {
    var amount = calc_total();
    var prod_list = products_selected();
    if (amount > 0) {
        var orderid = create_order();
        //var pay_base_url = "https://cert.payconex.net/paymentpage/enhanced/?action=view&aid=220614974061&id=31721";
        var pay_base_url = config.purser.purser_url + "&aid=" + config.purser.client_key + "&id=" + config.purser.form_id;
        var payment_url = pay_base_url + "&amount=" + amount + "&orderid=" + orderid + "&products=" + prod_list;
        hide_products();
        update_iframe(payment_url);
    } else {
        update_iframe(" ");
        alert( "Your cart is empty. Select products and try again.");
    }
}

window.onload = function(){
    var checkout_button = document.getElementById("checkout");
    if (checkout_button.addEventListener)
        checkout_button.addEventListener("click", checkout, false);
    else if (checkout_button.attachEvent)
        checkout_button.attachEvent('onclick', checkout);
}

