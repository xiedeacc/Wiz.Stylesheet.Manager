// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

// 定义BrowserInjector原型对象

class BrowserInjector {

}

// 工具

function messageToUser(str, type = 'success'){
    if ( typeof($.notify) == 'undefined' ) {
        console.log(str);
    } else if ( typeof($.notify) == 'function' ) {
        $.notify(str, type);
    }
}

function injectSelectedJsToBrowser(jsName){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let jQueryUIPath = pluginPath + "lib/jQuery-UI/jquery-ui.js";
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;

    switch (jsName) {
        case "jQuery": 
            objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
                messageToUser("已执行jQuery注入！", "success");
            });
            break;
        case "All": 
            injectAllScript();
            break;
    }
}

function injectJsToBrowser(js){
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    js += ';(function(){return true})()';
    objBrowser.ExecuteScript(js, function(ret){
        if (ret) {
            messageToUser("已执行脚本插入！", "success");
        } else {
            messageToUser("jQuery注入失败！", 'error');
        }
    });
}

function injectAllScript(){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let jQueryUIPath = pluginPath + "lib/jQuery-UI/jquery-ui.js";
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
        //messageToUser("已执行jQuery注入！", "success");
        objBrowser.ExecuteScriptFile(jQueryUIPath, function(ret){
            //messageToUser("已执行jQueryUI注入！", "success");
            objBrowser.ExecuteScriptFile(ElementControllerPath, function(ret){
                //messageToUser("已执行ElementController注入！", "success");
                objBrowser.ExecuteFunction4("Init", objApp, objCommon, objDatabase, window.WizChromeBrowser, function(ret){
                    if (ret) {
                        messageToUser("成功进入动态布局模式！", "success");
                    } else {
                        messageToUser("脚本初始化失败！", "error");
                    }
                    
                });
            });
        });
    });
}

$(document).ready(function(){
    // 设置Notify
    $.notify.defaults({
        position: "bottom",
    })

    // 设置UI控件 
    $( "#function-tabs" ).tabs();
    $( "#accordion" ).accordion({
        collapsible: true
      });
    $( '#js-menu' ).selectmenu({
        classes: {
            "ui-selectmenu-button": "ui-button-icon-only demo-splitbutton-select"
        },
        change: function(){
            $( "#injector-btn" ).text(this.value);
        }
    });
    $( ".controlgroup" ).controlgroup();
    $( "#injector-btn" ).click(function() {
        let jsName = $(this).text();
        injectSelectedJsToBrowser(jsName);
    });
    //
    
    /*
    $('#alert').button().click(function(){
        let str = $('#input-str').val();
        messageToUser(str, 'info');
    })
    */

    $('#inject-js').button().click(function(){
        let js = $('#js-str').val();
        injectJsToBrowser(js);
    })
    $( "#radio" ).controlgroup();

    // 加载完毕后再展示<body>
    $('body').css('visibility', 'visible');
});