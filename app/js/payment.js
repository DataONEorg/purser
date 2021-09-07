new PaymentiFrame({
 create: true,
 iframeId: "payment_iframe",
 settings: {
     account         : "220614974061",
     parentId        : "pay-frame",
     lang            : "en",
     cvv             : "required",
     expy            : "single_input",
     layout          : "1",
     inputFontFamily : "13",
     inputStyle      : "1",
     labelFontSize   : "14",
     labelFontColor  : "#000000",
     style           : "background-color:#FFFFFF; border-radius: 20px; padding:20px;",
     width           : "300px",
     height          : "140px",
     showFrame       : false,
     devServer       : "https://cert.payconex.net",
     onload          : function(){ alert("The Payment iFrame has loaded") }
 }
});