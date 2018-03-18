
// 创建Widget: ElementController

$.widget( "custom.ElementController", {
 
    // Default options.
    options: {
        _defaultViableNode: [
            "a", "abbr", "acronym", "address", "area", "article", "aside", "audio", 
            "b", "bdi", "bdo", "big", "blockquote", "br", "button", "canvas", "cite", "code", "command", 
            "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", 
            "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", 
            "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iframe", "img", "input", "ins", 
            "kbd", "keygen", "label", "legend", "li", "main", "map", "mark", "menu", "menuitem", "meter", 
            "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "pre", "progress", 
            "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "span", "strong", "sub", "summary", "sup", 
            "table", "textarea", "tt", "u", "ul", "var", "video", "wbr"
        ],
        ViableNode: [],
        OutlineStyle: {
            //'border-radius': '2px',
            'box-shadow': '0 0 2px 2px #A5C7FE inset'
        },
        ActiveStyle: {
            'border-radius': '2px',
            'box-shadow': '0 0 2px 2px #A5C7FE'
        },
        zIndex: 0,

    },

    _currentActiveInstance: null,
 
    _create: function() {
        let opts = this.options;
        let that = this;
        let el = this.element;

        // 首先判断是否为允许的元素
        let elType = el[0].nodeName.toLowerCase();
        if (!opts._defaultViableNode.includes(elType)) {
            console.warn(`<${elType}> 不适用动态布局！`);
            return false;
        };

        // 设置元素格式
        this.element.addClass('el-ctrl');
        this.PrimaryStyle = {
            'border-radius': this.element.css('border-radius'),
            'box-shadow': this.element.css('box-shadow'),
            'background': this.element.css('background')
        }

        // 给元素设置focus/blur事件
        this._setTabIndex();
        
        // 绑定鼠标悬停句柄
        el.mouseover(function(e){
            e.stopPropagation();
            el.css(opts.OutlineStyle);
        });
        el.mouseout(function(e){
            e.stopPropagation();
            el.css(that.PrimaryStyle);
        });

        // 绑定鼠标点击句柄
        el.click(function(e){
           e.stopPropagation();
           //TODO: 展示一个框，因为focus只能使一个元素
           /*
           if ( that._currentActiveInstance != null ) {
               that._currentActiveInstance.outline.remove();
           }
           that.__proto__._currentActiveInstance = that;
           that._renderOutline();
           */

           //TODO: 创建控件面板
           el.draggable();
        });

        // 元素失去焦点
        this.element.blur(function(){
            //this._destroyOutline();
            //TODO: 失去焦点后删除控件面板
            el.draggable('destroy');
        });
    },

    refresh: function() {
        let el = this.element;
        let opts = this.options;
        let elType = el[0].nodeName.toLowerCase();
        if (!opts._defaultViableNode.includes(elType)) {
            this.destroy();
        };
    },

    _renderOutline: function() {
        // 获得元素定位
		var el = this.element, o = this.options;
        this.elementOffset = el.offset();
        
        // 判断是否纯在outline
        if ( this.outline ) {
            this.outline.show();
        } else {
            // 创建元素
            this.outline = $( "<div class='ui-outline-default' style='overflow:hidden;'></div>" );

            // 设置样式
            this.outline.css( {
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++o.zIndex //TODO: Don't modify option
            } ).css(o.ActiveStyle);
        }


        // 定位到DOM，并禁用选择
        this.outline.appendTo( "body" ).disableSelection();

    },
    
    _destroyOutline: function() {
        // 判断是否已选中该元素
        let isClicked = this.outline.hasClass('ui-outline-active');

        if ( isClicked ) {
            // 选中则不执行
        } else {
            // 未选中则摧毁
            this.outline.remove();
        }
        
    },
    
    _setTabIndex: function() {
        let el = this.element;
        // 判断是否为默认拥有tabIndex属性的元素
        if ( el.prop('tabIndex') < 0 ) {
            el.addClass('ui-set-tabIndex');
            // 将属性写入HTML，从而激活focus事件
            el.attr('tabIndex', el.prop('tabIndex'));
        }
      },

    _resTabIndex: function() {
        let el = this.element;
        if ( el.hasClass('ui-set-tabIndex') ) {
            el.removeAttr("tabIndex");
        }
    },

    _destroy: function() {
        this.element.removeClass('el-ctrl');
        this._resTabIndex();
        if ( this.outline ) this.outline.remove();
    }
});

// 工具

function clearUp() {
    //TODO: 选中所有元素，调用ElementController的_destroy()
    $('*').ElementController('destroy');
    //TODO: 清除已注入的CSS
    $('jqueryUI-style').remove();
}

// 初始化

function Init(objApp, objDatabase, objCommon, smBrowser) {
    // 一些变量
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
 
    // 准备jQueyr-UI的CSS文件
    let jqueryUI_CSS_Path =  pluginPath + "lib/jQuery-UI/jquery-ui.min.css";
    $('<link id="jqueryUI-style" rel="stylesheet" href="'+ jqueryUI_CSS_Path + '">').appendTo(document.head);
 
    // 将所有元素加载控件
    $('*').ElementController().ElementController('refresh');
}