var objApp = window.external;
var objDatabase = objApp.Database;
var objWindow = objApp.Window;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

function WizAlert(msg) {
    objWindow.ShowMessage(msg, "{p}", 0x00000040);
}

function WizConfirm(msg) {
    return objWindow.ShowMessage(msg, "{p}", 0x00000020 | 0x00000001) == 1;
}

(function() {
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteFunction1("clearUp", true, function(ret) {
        if (ret) {
            WizAlert("成功保存并完成清理！", "success");
        } else {
            WizAlert("清理失败，请放弃修改！", "error");
        }
    })
})()