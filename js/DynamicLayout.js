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

function injectAllScript(){
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    let progress = objApp.CreateWizObject("WizKMControls.WizProgressWindow");
    progress.Title = "正在进入动态布局...";
    progress.Max = 5;
    progress.Show();
    progress.Pos = 1;
    progress.Text = '正在注入jQuery';
    objBrowser.ExecuteScriptFile(pluginPath + "lib/jQuery/jquery-3.3.1.min.js", function(ret){
        progress.Pos = 2;
        progress.Text = '正在注入jQuery UI';
        objBrowser.ExecuteScriptFile(pluginPath + "lib/jQuery-UI/jquery-ui.js", function(ret){
            progress.Pos = 3;
            progress.Text = '正在注入FontAwesome';
            objBrowser.ExecuteScriptFile(pluginPath + "js/fontawesome-all.js", function(ret){
                progress.Pos = 4;
                progress.Text = '正在注入ElementController';
                objBrowser.ExecuteScriptFile(pluginPath + "js/ElementController.js", function(ret){
                    progress.Pos = 5;
                    progress.Text = '正在初始化';
                    objBrowser.ExecuteFunction4('Init', objApp, objCommon, window.WizChromeBrowser, pluginPath, function(ret){
                        if (ret) {
                            progress.Text = '完成！';
                            setTimeout(function(){
                                progress.Hide();
                                progress.Destroy();
                                progress = null;
                            }, 0)
                        } else {
                            WizAlert("脚本初始化失败！", "error");
                        }
                        
                    })
                })
            })
        })
    })
}

injectAllScript()
