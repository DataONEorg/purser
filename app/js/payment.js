// var paymentiFrame = new PaymentiFrame({
//  create: true,
//  iframeId: "payment_iframe",
//  settings: {
//      account         : "220614974061",
//      parentId        : "pay-frame",
//      lang            : "en",
//      cvv             : "required",
//      expy            : "single_input",
//      layout          : "1",
//      inputFontFamily : "13",
//      inputStyle      : "1",
//      labelFontSize   : "14",
//      labelFontColor  : "#000000",
//      style           : "background-color:#FFFFFF; border-radius: 20px; padding:20px;",
//      width           : "300px",
//      height          : "140px",
//      showFrame       : false,
//      devServer       : "https://cert.payconex.net",
//      onload          : function(){ alert("The Payment iFrame has loaded") }
//  }
// });

function process_payment_info() {
    alert( "Processed!" );
}

// function process_payment_info() {
//     paymentiFrame.encrypt({
//         failure : function (err) {
//             alert("Error: " + err.id + " -> " + err.message );
//         },
//         invalidInput :function (data) {
//             for ( var i = 0; i < data.invalidInputs.length; i++ ){
//                 alert("Error: " + data.invalidInputs[i].code + " -> " + data.invalidInputs[i].message );
//             }
//         },
//         success : function (res) {
//             alert( "id " + res.id + " token=>" + res.eToken );
//         }
//     })
//     return false;
// }

var paybutton = document.getElementById("pay-now");
if (paybutton.addEventListener)
    paybutton.addEventListener("click", process_payment_info, false);
else if (paybutton.attachEvent)
    paybutton.attachEvent('onclick', process_payment_info);
