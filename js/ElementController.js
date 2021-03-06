
// 创建Widget: 元素控制面板组件
$.widget("sm.cPanelGroup", $.ui.controlgroup, {

    _resolveClassesValues: function( classes, instance ) {
        var controlgroupCornerRegex = /ui-corner-([a-z]){2,6}/g;
        var result = {};
        // 遍历“传入的classes”所有元素
		$.each( classes, function( key ) {
            // 获取子组件对应classes设置
            var current = instance.options.classes[ key ] || "";
            //去除当前classes设置中的ui-corner-class，再去掉首位空白
            current = $.trim( current.replace( controlgroupCornerRegex, "" ) );
            // 将子组件修改后的对应设置与传入classes的对应设置连接成字符串，并将连续空白用一个空格代替
			result[ key ] = ( current + " " + classes[ key ] ).replace( /\s+/g, " " );
		} );
		return result;
	},

	_buildSimpleOptions: function( position, key ) {
		var direction = this.options.direction === "vertical";
		var result = {
			classes: {}
		};
		result.classes[ key ] = {
			"middle": "",
			"first": "ui-corner-" + ( direction ? "top" : "left" ),
			"last": "ui-corner-" + ( direction ? "bottom" : "right" ),
			"only": "ui-corner-all"
		}[ position ];

		return result;
    },
    
    refresh: function() {
        this._super();
	}
})

// 创建Widget: 元素控制面板
$.widget("sm.cPanelBtn", $.ui.button, {
    options: {
		classes: {
            "ui-button": "",
            "sm-cpanel-btn" : "",
            "sm-cpanel-btn-default" : "",
            "sm-cpanel-btn-active" : "ui-state-active",
		},
		disabled: null,
		icon: null, // 传入FontAwesome的<i></i>字符串。
		iconPosition: "beginning",
		label: null,
        showLabel: true,
        actionTarget: null, // 传入jQuery对象
        actionCallback: null, // 传入要执行的callback
        actionCallbackParam: null, // callback需要的参数
	},


    _create: function() {
        let that = this, opts = this.options, el = this.element;

        // 绑定事件
        this._on(el, {
            click : that._toggleAction,
        })

        // 
        this._addClass(el, "sm-cpanel-btn");
        this._addClass(el, "sm-cpanel-btn-default");

        return this._super();
    },

    _toggleAction: function() {
        let that = this, opts = this.options, el = this.element;
        
        // 判断语句，查看按钮处于什么状态
        if ( el.hasClass('sm-cpanel-btn-active') ) {
            // 关闭元素控件操作
            opts.actionCallback.call(opts.actionTarget, 'destroy');
            // 清除Class
            this._removeClass(el, "sm-cpanel-btn-active");
            this._addClass(el, "sm-cpanel-btn-default");
        } else {
            // 开启元素控件操作
            opts.actionCallback.call(opts.actionTarget, opts.actionCallbackParam);
            
            // 设置激活Class
            this._addClass(el, "sm-cpanel-btn-active");
            this._removeClass(el, "sm-cpanel-btn-default");
        }
    },

} )


// 创建Widget: ElementController

$.widget( "sm.ElementController", {
 
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
        _notSupportClasses: [ 
            "CodeMirror", "cm-s-default", "CodeMirror-wrap", "CodeMirror-scroll",
            "CodeMirror-sizer", "CodeMirror-lines", "CodeMirror-code", "CodeMirror-activeline",
            "CodeMirror-activeline-background", "CodeMirror-linebackground", " CodeMirror-line"
        ],
        _currentActiveInstance: null,
        _PrimaryStyle: null,
        classes: {
            'sm-elctrl-el-default' : '',
            'sm-elctrl-el-active' : '',
        },
        ViableNode: [],
        zIndex: 1000,
    },
    
    // ElementController原型对象的构造函数
    _create: function() {
        let opts = this.options;
        let that = this;
        let el = this.element;

        // 首先判断是否为允许的元素
        let elType = el[0].nodeName.toLowerCase();
        if (!opts._defaultViableNode.includes(elType)) {
            throw new Error(`<${elType}> 不适用动态布局！`);
            return false;
        };

        // 设置元素格式
        this._addClass(this.element, 'sm-elctrl-el-default');

        // 获取元素原始格式
        opts._PrimaryStyle = {
            'border-radius': this.element.css('border-radius'),
            'box-shadow': this.element.css('box-shadow'),
            'background': this.element.css('background')
        }

        // 给元素设置focus/blur事件
        this._setTabIndex();
        
        // 绑定事件句柄
        this._on(el, {
            // 绑定鼠标悬停句柄
            mouseover: function(e) {
                e.stopPropagation();
                this._removeClass(el, 'sm-elctrl-el-default')
                this._addClass(el, 'sm-elctrl-el-active');
            },
            mouseout : function(e) {
                e.stopPropagation();
                this._addClass(el, 'sm-elctrl-el-default')
                this._removeClass(el, 'sm-elctrl-el-active');
            },
            // 绑定鼠标点击句柄
            focus : function(e) {
                e.stopPropagation();
                that._renderToolkit();
            },
            blur : function(e){
                
            },
            keyup : function(e){
                e.stopPropagation();
                let key = e.which;
                // DELETE 键
                if (key == 46) {
                    el.ElementController('destroy');
                    el.remove();
                }
            }
        })

    },

    refresh: function() {
        let el = this.element;
        let opts = this.options;

        /*
        let elType = el[0].nodeName.toLowerCase();

        //TODO: 对HTML元素的判断应该在create的时候完成，但之前尝试有问题
        if (!opts._defaultViableNode.includes(elType)) {
            this.destroy();
        } else if ( el.attr('class').includes('CodeMirror') ) {
            // 似乎子元素还没有初始化组件，所以不能摧毁
            el.find('*').each(function(e){
                if ( $(this).is( ":data('sm-ElementController')" ) ) {
                    jQuery.data(this, 'sm-ElementController').disable();
                    jQuery.data(this, 'sm-ElementController').destroy();
                }
            })
            //el.find(":data('sm-ElementController')").ElementController('destroy');
            el.ElementController('disable');
        };
        */
       
        // 更新this.toolkit的定位，用position()工具
    },

    _renderToolkit: function() {
        var el = this.element, opts = this.options, that = this;
        this.elementOffset = el.offset();
        // 准备元素控件面板
        if ( this.toolkit ) {
            this._show(this.toolkit, this.options.show, null);
        } 
        
        else {
            // 这里应该交给组件来做！
            // 创建元素，可以写个controlgroup控件，自动设置corner的圆角
            this.toolkit = $(`
            <div id='ui-toolkit' class='toolbar'>
                <button id="ui-sm-resizable-${this.uuid}" ><i class="fas fa-expand-arrows-alt"></i></button>
                <button id="ui-sm-draggable-${this.uuid}" ><i class="fas fa-arrows-alt"></i></button>
                <button id="ui-sm-delete-${this.uuid}" ><i class="fas fa-trash-alt"></i></button>
            </div>
            `);

            // 设置控件格式
            // 如果元素Position: fixed要注意定位。
            this.toolkit.css( {
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: (parseInt(this.elementOffset.top) - 24) + "px",
                zIndex: opts.zIndex
            } )
            
            this.toolkit.find(`#ui-sm-resizable-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: $.fn.resizable, // 传入要执行的callback
            })
            this.toolkit.find(`#ui-sm-draggable-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: $.fn.draggable, // 传入要执行的callback
                actionCallbackParam: { cursor: "move", snap: true, grid: [ 10, 10 ] }
            })
            this.toolkit.find(`#ui-sm-delete-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: function(){
                    // 删除后元素遗留下来了，应该启动ElementControl的自毁程序
                    el.ElementController('destroy');
                    el.remove();
                }, 
            });;

            // 因为元素是尚未append到文档中，所以是不可见的
            this.toolkit.cPanelGroup({
                'onlyVisible': false,
            })

            // 工具栏移动
            //TODO: Draggable 按格子移动时出现工具栏定位出现Bug
            this._on(this.element, {
                drag: function( event, ui ) {
                    this.toolkit.css( {
                        position: "absolute",
                        left: ui.offset.left + "px",
                        top: (parseInt(ui.offset.top) - 9) + "px",
                        zIndex: opts.zIndex
                    } )
                }
            })

            // 重置元素focus
            this._on(this.toolkit.find('button'), {
                focus: function(e) {
                    // 100ms后让元素重获焦点
                    that._delay(function(){
                        that.element.focus();
                    }, 100)
                },
            })

            // 点击空白处自动隐藏工具栏
            this._on(this.document, {
                click: function(e) {
                    if(!that.element.is(e.target) && !that.toolkit.is(e.target) && that.toolkit.has(e.target).length === 0){
                        that._hideToolkit();
                    }
                }
            })

            //TODO: 添加到元素上端
            this.toolkit.appendTo('body');
        }

    },

    _hideToolkit: function() {
        if ( this.toolkit ) {
            this._hide( this.toolkit);
        }
    },
    
    _setTabIndex: function() {
        let el = this.element;
        // 判断是否为默认拥有tabIndex属性的元素
        if ( el.prop('tabIndex') < 0 ) {
            this._addClass(el, 'ui-set-tabIndex');
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
        this._resTabIndex();
        if ( this.toolkit ) this.toolkit.remove();
    }
});

// 工具

function clearUp(isSave) {
    if ( isSave ) {
        $(":data('sm-ElementController')").ElementController('destroy');
        $('.set-style').remove();
        window.external.SetNoteModifiedByPlugin();
    } else {
        $(":data('sm-ElementController')").ElementController('destroy');
        $('.set-style').remove();
        //window.location.reload();
    }
    
    return true;
}


// 初始化

function Init(objApp, objCommon, smBrowser, pluginPath) {
    // 设置
    let initOpts = {
        ViableNode: [
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
        excNode: [
            "wiz_tmp_tag"
        ],
        excClasses: [
            ".CodeMirror",
            ".wiz-table-body",
            ".wiz-table-tools",
        ],
    }
    // 准备CSS文件
    let cssPaths = [
        pluginPath + "lib/jQuery-UI/jquery-ui.min.css",
        pluginPath + "lib/jQuery-UI/jquery-ui.structure.css",
        pluginPath + "lib/jQuery-UI/jquery-ui.theme.css",
        pluginPath + "css/stylesheet-manager.structure.css"
    ];

    for ( let i=0; i<cssPaths.length; i++ ) {
        $(`<link class="set-style" rel="stylesheet" href="${ cssPaths[i] }">`).appendTo(document.head);
    }
 
    // 所有元素加载控件
    //TODO: 过滤不可用的元素不应该交给插件的'refresh'来做，应该在Init函数里就完成！

    $('*').filter(function(index){
        let elNodeType = this.nodeName.toLowerCase();
        // 过滤掉不可用的元素类型
        if ( initOpts.ViableNode.includes( elNodeType ) ) {
            return true;
        } else {
            return false;
        }
    })
    .not( $( initOpts.excNode.join(",") ) )
    .not( $( initOpts.excNode.join(",") ).find('*') )
    .not( $( initOpts.excClasses.join(",") ) )
    .not( $( initOpts.excClasses.join(",") ).find('*') )
    .ElementController().ElementController('refresh');

    return true;
}