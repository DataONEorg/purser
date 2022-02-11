
// Service	Unit	Rate
// DataONE Plus	year	$575.04
// Hosted Repository	year	$12,999.96
// HA Storage	TB/year	$150.00
// Data Curation	day	$689.00
// Design / Development	day	$915.00
function prices() {
    prices_ = {};
    prices_.dataoneplus = 575.04;
    prices_.hostedrepo = 12999.96
    prices_.hastorage = 150.00
    prices_.curation = 689.00
    prices_.development = 915.00
    return(prices_);
}

function calc_total() {
    var total = 0;
    if (document.getElementById('hostedrepo').checked) {
        total += prices().hostedrepo;
    }
    if (document.getElementById('dataoneplus').checked) {
        total += prices().dataoneplus;
    }
    if (document.getElementById('hastorage').checked) {
        total += prices().hastorage;
    }
    return(total);
}

function find_order_id() {
    var oid = "89000";
    return(oid);
}

function update_iframe(target_url) {
    document.getElementById('pay-frame').src = target_url;
}

function hide_products() {
    document.getElementById( 'products' ).classList.add("hidden");
}

function process_payment_info() {
    var amount = calc_total();
    if (amount > 0) {
        var orderid = find_order_id();
        var pay_base_url = "https://cert.payconex.net/paymentpage/enhanced/?action=view&aid=220614974061&id=31721";
        var payment_url = pay_base_url + "&amount=" + amount + "&orderid=" + orderid;
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
        checkout_button.addEventListener("click", process_payment_info, false);
    else if (checkout_button.attachEvent)
        checkout_button.attachEvent('onclick', process_payment_info);
}

