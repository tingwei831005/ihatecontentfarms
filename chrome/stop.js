var LocalStorageStore = require("cfblocker/LocalStorageStore");

function hostname(url) {
    var parser = document.createElement("a");
    parser.href = url;
    return parser.hostname;
}

$(document).ready(function() {
    $("title").text(chrome.i18n.getMessage("title"));
    $("h1").text(chrome.i18n.getMessage("header"));
    $("p").text(chrome.i18n.getMessage("body"));
    $("#back").text(chrome.i18n.getMessage("backBtn"));
    $("#continue").text(chrome.i18n.getMessage("contBtn"));

    $("#continue").click(function() {
        var key = "tmpWhiteList";
        
        var queryString = window.location.search.substring(1);
        var token = queryString.split("&");
        var to = "";
        for (var i = 0; i < token.length; i++) {
            var pair = token[i].split("=");
            if (decodeURIComponent(pair[0]) == "to") {
                to = decodeURIComponent(pair[1]);
                break;
            }
        }

        var whiteList 
        try {
            whiteList = JSON.parse(localStorage.getItem(key) || "");
        } catch (e) {
            whiteList = {};
        }

        var field = hostname(to);
        
        whiteList[field] = new Date().getTime();
        
        try {
            localStorage.setItem(key,JSON.stringify(whiteList));
        } catch (err) {
            // e.g. quote exceed. Just purge old data
            whiteList = {}; 
            whiteList[field] = true;
            localStorage.setItem(key,JSON.stringify(whiteList));
        }

        LocalStorageStore.blockWebRequestFilter();
        window.location.href = to;
    });
    
    $("#back").click(function() {
        
        if (history.length <= 2) {
            if (window.opener || window.parent) {
                window.close();
            } else {
                window.history.go(-1);
            }
        } else {
            window.history.go(-2);
        }
    });
    
});
