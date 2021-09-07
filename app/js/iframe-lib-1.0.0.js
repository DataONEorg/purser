
function BluefinException(code, message) {

    var self = {
        code    : code,
        message : message
    };

    var resp = {
        name     : "BluefinException",
        code     : self.code,
        message  : self.message,
        toString : function() {
            return "[ name : BluefinException, code : " + self.code + ", message : " + self.message + "]";
        }
    }

    return resp;
}


function isJSON(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

var PaymentiFrame = function(params){

    var self = {
        instance_id     : undefined,
        iframe_selector : "payment_iframe",
        callbacks       : {},
        errorBack       : {},
        successBack     : {},
        invalidBack     : {},
        domain          : undefined,
        iframewindow    : undefined,
        loadBack        : undefined
    };


    //this function takes in
    var matchElementStyle = function( matchStyle, fontSize, fontColor, fontFamily ){

        var elem = document.getElementById( matchStyle );

        var res  = {
            fontSize   : fontSize,
            fontColor  : fontColor,
            fontFamily : fontFamily
        };

        //if it isn't an id try jquery selector.
        if ( null === elem ){
            elem = $( matchStyle )[0];
        }

        if ( null !== elem && undefined !== elem ){

            var style = window.getComputedStyle( elem );

            var fontSize   = style.getPropertyValue('font-size');
            var color      = style.getPropertyValue('color');
            var fontFamily = style.getPropertyValue('font-family');

            if ( undefined === res.fontSize && fontSize ){
                var fontSizeNum = fontSize.match(/\d+/g)[0]
                if ( !isNaN(fontSizeNum)){
                    fontSizeNum = ( fontSizeNum < 9  ) ? 9  : fontSizeNum ;
                    fontSizeNum = ( fontSizeNum > 34 ) ? 34 : fontSizeNum ;

                    res.fontSize = fontSizeNum
                }
            }

            if ( undefined === res.fontColor && color ){

                if ( /^#[0-9a-fA-F]{3,6}$/.test(color) ){
                    res.fontColor = color;
                }
                else if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.test( color )){
                    function d2h(d) {
                        var s = (+d).toString(16);
                        if(s.length < 2) {
                            s = '0' + s;
                        }
                        return s;
                    }

                    function rgb2hex(rgb) {
                        var rgbMatch  = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                        return "#" + d2h(rgbMatch[1]) + d2h(rgbMatch[2]) + d2h(rgbMatch[3]);
                    }

                    var fontColor = rgb2hex( color );
                    res.fontColor = fontColor;
                }

            }

            if ( undefined === res.fontFamily && fontFamily ){

                //dictionary of font families; index match with config option.
                var fams = [
                    ["Helvetica Neue",      "Helvetica", "Arial", ""],
                    ["Impact",              "Charcoal",  "",     ""],
                    ["Palatino Linotype",   "Book Antiqua", "Palatino", ""],
                    ["Tahoma",              "Geneva",    "",     ""],
                    ["Century Gothic",      "",          "",     ""],
                    ["Lucida Sans Unicode", "Lucida Grande", "", ""],
                    ["Arial Black",         "Gadget",    "",     ""],
                    ["Times New Roman",     "Times",     "",     ""],
                    ["Arial Narrow",        "",          "",     ""],
                    ["Verdana",             "Geneva",    "",     ""],
                    ["Copperplate / Copperplate Gothic Light", "", "", ""],
                    ["Lucida Console", "Monaco", "monospace",    ""],
                    ["Gill Sans / Gill Sans MT", "",     "",     ""],
                    ["Trebuchet MS",  "Helvetica", "",   "",     ""],
                    ["Courier New",   "Courier", "monospace",    ""],
                    ["Arial",         "Helvetica",       "",     ""],
                    ["Georgia",       "Serif",           "",     ""],
                    ["Comic Sans MS", "cursive",         "",     ""],
                    ["sans-serif",    "",                "",     ""],
                    ["serif",         "",                "",     ""]
                ];

                var fontFamilySplit = fontFamily.split(",");

                outter:for ( var i = 0; i < fontFamilySplit.length; i++ ){

                    var font = fontFamilySplit[i];

                    font = font.replace(/["']/g, "").trim().toLowerCase();

                    //col first search
                    for ( var j = 0; j < 4; j++){
                        for ( var k = 0; k < fams.length; k++ ){
                            var entry = fams[k][j].toLowerCase();

                            if (font === entry){
                                res.fontFamily = k + 1;
                                break outter;
                            }
                        }
                    }

                    res.fontFamily = 19;
                }
            }
        }

        return res;
    };


    var lpad = function(num, size) {
        num = parseInt( num );
        var s = "000000000000" + num;
        return s.substr( s.length - size);
    };


    var buildSrc = function( settings ){

        var version_path = "";

        if ( undefined !== settings.css  ||
             undefined !== settings.text ||
             undefined !== settings.font ||
             undefined !== settings.payment_method ){
            version_path = "/styled.php";
        }


        var src = "https://secure.payconex.net/iframe"+version_path+"?aid=";

        if ( settings.devServer ){
            src = settings.devServer + "/iframe"+version_path+"?aid=";
        }

        src += lpad( settings.account, 12);

        if ( settings.matchLabelStyle ){
            var res = matchElementStyle( settings.matchLabelStyle,
                                            settings.labelFontSize,
                                            settings.labelFontColor,
                                            settings.labelFontFamily );
            settings.labelFontSize   = res.fontSize;
            settings.labelFontColor  = res.fontColor;
            settings.labelFontFamily = res.fontFamily;
        }

        if ( settings.matchInputStyle ){
            var res = matchElementStyle( settings.matchInputStyle,
                                            settings.inputFontSize,
                                            settings.inputFontColor,
                                            settings.inputFontFamily );
            settings.inputFontSize   = res.fontSize;
            settings.inputFontColor  = res.fontColor;
            settings.inputFontFamily = res.fontFamily;
        }

        if ( settings.lang ){
            src += "&lang=" + settings.lang;
        }

        if ( settings.cvv ){
            src += "&cvv=" + settings.cvv;
        }

        if ( settings.expy ){
            src += "&expy=" + settings.expy
        }

        if ( settings.layout ){
            src += "&layout=" + settings.layout;
        }

        if ( settings.inputWidth ){
            src += "&input_width=" + settings.inputWidth;
        }

        if ( settings.labelWidth ){
            src += "&label_width=" + settings.labelWidth;
        }

        if ( undefined !== settings.showPlaceholders ){
            src += "&show_placeholders=" + settings.showPlaceholders;
        }

        if ( undefined !== settings.labelFontFamily ){
            src += "&label_font_family=" + settings.labelFontFamily;
        }

        if ( undefined !== settings.labelFontSize ){
            src += "&label_font_size=" + settings.labelFontSize;
        }

        if ( undefined !== settings.labelFontColor ){
            src += "&label_font_color=" + encodeURIComponent(settings.labelFontColor);
        }

        if ( undefined !== settings.inputFontFamily ){
            src += "&input_font_family=" + settings.inputFontFamily;
        }

        if ( undefined !== settings.inputFontSize ){
            src += "&input_font_size=" + settings.inputFontSize;
        }

        if ( undefined !== settings.inputFontColor ){
            src += "&input_font_color=" + encodeURIComponent(settings.inputFontColor);
        }

        if ( undefined !== settings.inputStyle ){
            src += "&input_style=" + settings.inputStyle;
        }

        if ( undefined !== settings.timeout ){
            src += "&timeout=" + settings.timeout;
        }

        if ( settings.numberLabel ){
            src += "&number_label=" + encodeURIComponent(settings.numberLabel);
        }

        if ( settings.expyLabel ){
            src += "&expy_label=" + encodeURIComponent(settings.expyLabel);
        }

        if ( settings.cvvLabel ){
            src += "&cvv_label=" + encodeURIComponent(settings.cvvLabel);
        }

        if ( settings.masked ){
            if ( settings.masked.formData && settings.masked.eToken ){
                self.masked = settings.masked;
            }
            else{
                throw new BluefinException(103, "Invalid masked data object.");
            }
        }

        if ( undefined !== settings.css && 0 !== ( '' + settings.css).length ){
            src += "&css=" + encodeURIComponent(btoa(JSON.stringify(settings.css)));
        }

        if ( undefined !== settings.text && 0 !== ( '' + settings.text).length ){
            src += "&text=" + encodeURIComponent(btoa(JSON.stringify(settings.text)));
        }

        if ( undefined !== settings.font && 0 !== ( '' + settings.font).length ){
            src += "&font=" + encodeURIComponent(btoa(JSON.stringify(settings.font)));
        }

        if ( undefined !== settings.payment_method ){
            src += "&payment_method=" + settings.payment_method;
        }

        if ( settings.onload ){
            self.loadBack = settings.onload
        }

        return src;
    };


    var guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };

    self.guid = guid;

    var load = function(){

        var iframe  = document.getElementById(self.iframe_selector);

        if ( undefined === iframe || null === iframe ){
            throw new BluefinException(100, "iframe not found, ID: " + self.iframe_selector);
        }


        if ( iframe.nodeName !== "IFRAME" ){
            throw new BluefinException(101, "HTML element is not an iframe, ID: " + self.iframe_selector);
        }


        var src = iframe.getAttribute("src");

        self.iframewindow = iframe.contentWindow? iframe.contentWindow : iframe.contentDocument.defaultView;

        var tmpAnchor  = document.createElement('a');
        tmpAnchor.href = src;
        var protocol   = tmpAnchor.protocol;
        var hostname   = tmpAnchor.hostname;

        self.domain = protocol + "//" + hostname;


        if ( -1 === self.domain.indexOf("payconex.net") && -1 === self.domain.indexOf("cardconex.local") ){
            throw new BluefinException(102, "Invalid iframe src: " + self.domain);
        }

        if (window.addEventListener) {
            addEventListener("message", listener, false)
        } else {
            attachEvent("onmessage", listener)
        }

        self.instance_id = guid();

        iFrameLoaded = true;
    };

    var iFrameLoaded = false; // a flag to prevent the iFrame from being loaded multiple times

    var readyAction = function(){
        //if the iFrame is to be created dynamically we create that first
        if ( params.create && undefined !== params.settings ){
            var parentElement = document.getElementById(params.settings.parentId);
            if ( undefined !== parentElement && null !== parentElement ) {
                //Convert to camelCase if using the wrong setting names
                convertToCamelCase();

                //output tag to page
                var iframeTag         = document.createElement('iframe');
                iframeTag.setAttribute("id",          self.iframe_selector);
                iframeTag.setAttribute("width",       params.settings.width);
                iframeTag.setAttribute("height",      params.settings.height);
                iframeTag.setAttribute("style",       params.settings.style);
                iframeTag.setAttribute("frameBorder", ((params.settings.showFrame) ? "1" : "0" ));
                iframeTag.setAttribute("src", buildSrc(params.settings));

                parentElement.innerHTML = parentElement.innerHTML + iframeTag.outerHTML;

            } else {
                throw new BluefinException(104, "Invalid parentId, no such element: " + params.settings.parentId);
            }
        }

        load();
    };

    // the completedAction method is attached to the "DOMContentLoaded" event
    var completedAction =  function() {
        if (iFrameLoaded) return true; // the iFrame is already loaded so we don't want to load it again
        document.removeEventListener( "DOMContentLoaded", completedAction );
        window.removeEventListener( "load", completedAction );
        readyAction();
    }

    // converts the setting names to their camelCase equivalent
    var convertToCamelCase = function() {
        attributesToConvert = ['number_label', 'expy_label', 'cvv_label', 'input_width', 'label_width', 'show_placeholders', 'input_style', 'label_font_size', 'label_font_family', 'label_font_color', 'input_font_size', 'input_font_family', 'input_font_color'];
        for (var i = 0, len = attributesToConvert.length; i < len; i++) {
            if ( undefined !== params.settings[attributesToConvert[i]] ) {
                var attributeSplitted = attributesToConvert[i].split('_');
                var attributeNew = attributeSplitted.shift();
                attributeSplitted.forEach(function (e) { attributeNew += e[0].toUpperCase() + e.slice(1)});
                params.settings[attributeNew] = params.settings[attributesToConvert[i]];
                delete params.settings[attributesToConvert[i]];
            }
        }
    };



    if ( undefined !== params ){

        if ( undefined !== params.iframeId ){
            self.iframe_selector = params.iframeId
        }

        try {
            readyAction();
        } catch (error) {
            // the iFrame will fail to load if the dom element isn't yet loaded, we will try again once the rest of the page is loaded
            // the following is inspired from the jQuery $.ready() method but without using jquery
            // Mozilla, Opera and WebKit
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", completedAction, false);
            // If Internet Explorer, the event model is used
            } else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", function() {
                    if (document.readyState === "complete" ) {
                        completedAction();
                    }
                });
            // A fallback to window.onload, that will always work
            } else {
                var oldOnload = window.onload;
                window.onload = function () {
                    oldOnload && oldOnload();
                    completedAction();
                }
            }
        }
    }

    function listener(event) {

        if ( -1 === self.domain.indexOf(event.origin) ){
            return;
        }

        var data = isJSON(event.data) ? JSON.parse(event.data) : event.data;

        if ( data.command === "payment_iframe_loaded" ){
            if ( self.masked && self.masked.formData && self.masked.eToken ){

                var guid = self.guid();

                var message = JSON.stringify({
                    message_id  : guid,
                    instance_id : self.instance_id,
                    command     : "set_masked",
                    masked_data : self.masked.formData,
                    eToken      : self.masked.eToken
                });

                self.iframewindow.postMessage( message, self.domain );
            }
            if ( self.loadBack ){
                self.loadBack();
            }
        }

        if ( self.instance_id !== data.instance_id ){
            return;
        }

        if ( undefined !== self.callbacks[data.message_id] ){

            var errorBack   = self.callbacks[data.message_id].errorBack;
            var successBack = self.callbacks[data.message_id].successBack;
            var invalidBack = self.callbacks[data.message_id].invalidBack;


            if (data.command === "encrypt_resp"){

                if (data.success && undefined !== successBack){
                    successBack({ id: data.message_id, eToken : data.eToken, masked : data.masked_data, ddds_result : data.ddds_result });
                }
                else if ( !data.success ){
                    if ( undefined !== data.invalidInputs && undefined !== invalidBack ){
                        invalidBack({ id: data.message_id, invalidInputs : data.invalidInputs });
                    }
                    else if ( undefined !== data.ddds_error && undefined !== errorBack ){
                        errorBack({ id: data.message_id, message : data.ddds_error });
                    }
                    else if ( undefined !== errorBack ){
                        errorBack({ id: data.message_id, message : data.message });
                    }
                }
            }
            else{
                //Error can be returned by any command (encrypt, clear and setMasked)
                if ( !data.success && undefined !== errorBack ){
                    errorBack({ id: data.message_id, message : data.message });
                }
                if (data.success && undefined !== successBack){
                    successBack({ id: data.message_id });
                }
            }
        }
    }


    var responseHandler = function(guid, includeInvalid){
        var obj = {
            success : function(fun){

                if (undefined !== guid){
                    if (undefined === self.callbacks[guid]){
                        self.callbacks[guid] = {};
                    }
                    self.callbacks[guid]["successBack"] = fun;
                }

                return this;
            },
            failure : function(fun){

                if (undefined !== guid){
                    if (undefined === self.callbacks[guid]){
                        self.callbacks[guid] = {};
                    }
                    self.callbacks[guid]["errorBack"] = fun;
                }

                return this;
            },
            id : guid
        };


        if ( undefined !== includeInvalid && true === includeInvalid ){
            obj["invalid"] = function(fun){

                if (undefined !== guid){
                    if (undefined === self.callbacks[guid]){
                        self.callbacks[guid] = {};
                    }
                    self.callbacks[guid]["invalidBack"] = fun;
                }

                return this;
            }
        }

        return obj;
    };


    return {
        clear : function(settings){

            var guid = self.guid();

            if (settings) {
                self.callbacks[guid] = {
                    errorBack  : settings.failure,
                    successBack: settings.success
                }
            }

            var message = JSON.stringify({
                message_id  : guid,
                instance_id : self.instance_id,
                command : "clear_input"
            });

            self.iframewindow.postMessage(message, self.domain);

            return responseHandler(guid);
        },
        setMasked : function(maskedData, eToken, arg3, arg4 ){

            var settings    = ( arg3 && ( arg3.failure || arg3.success ) ) ? arg3 : arg4 ;
            var ddds_result = ( arg3 && ( arg3.ddds_attempted !== undefined ) ) ? arg3 : {} ;

            var guid = self.guid();

            if (settings) {
                self.callbacks[guid] = {
                    errorBack  : settings.failure,
                    successBack: settings.success
                }
            }

            var message = JSON.stringify({
                message_id  : guid,
                instance_id : self.instance_id,
                command     : "set_masked",
                masked_data : maskedData,
                eToken      : eToken,
                ddds_result : ddds_result
            });

            self.iframewindow.postMessage(message, self.domain);

            return responseHandler(guid);
        },
        encrypt : function(settings){

            var guid    = self.guid();

            if (settings && ( settings.failure || settings.success || settings.invalidInput ) ) {
                self.callbacks[guid] = {
                    errorBack  : settings.failure,
                    successBack: settings.success,
                    invalidBack: settings.invalidInput
                }
            }

            var message = JSON.stringify({
                message_id  : guid,
                instance_id : self.instance_id,
                command     : "encrypt",
                ddds_params : ( settings ) ? settings.ddds_params : undefined
            });

            self.iframewindow.postMessage(message, self.domain);

            var respHandle = responseHandler(guid, true);

            respHandle["invalidInput"] = function(fun){

                if (undefined !== guid){
                    if (undefined === self.callbacks[guid]){
                        self.callbacks[guid] = {};
                    }
                    self.callbacks[guid]["invalidBack"] = fun;
                }

                return this;
            };

            return respHandle;
        }
    };
};



