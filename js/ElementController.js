// 创建jQuery插件: autoHide()
(function($){
    $.fn.sm_autoHide = function(opts) {
        var defaults = {
            // 设置你的选项缺省值
         }  
        
        // 使用用户的选项缺省值来扩展缺省选项  
        var options = $.extend(defaults, opts || {});  
        
         return this.each(function(){ // jQuery链式操作  
            // 插件的相关内容
            var elem = $(this);
            $(document).on('click', function(e){
                if (elem.is(':visible') && (!$(e.target)[0].isEqualNode(elem[0]) && elem.has(e.target).length === 0)) {
                    // TODO: 隐藏ElementController控件
                    elem.hide();
                }
                e.stopPropagation();
            })
        });
    }
})(jQuery)

// 创建Widget: ElementController

$.widget( "custom.ElementController", {
 
    // Default options.
    options: {
        OutlineStyle: {
            'margin': '0 2px 0 2px',
            'border-radius': '1px',
            'box-shadow': '0 0 1px 1px #26C2A7'
        },
        EmptyStyle: {
            'margin': '',
            'border-radius': '',
            'box-shadow': ''
        },
        ParentStyle: {
            'padding': '0 2px 0 2px'
        }
    },
 
    _create: function() {
        // 绑定鼠标悬停句柄
        this.element.hover(
            function(){
                // TODO: 增加父元素padding样式判断逻辑
                let paddingLeft = this.element.css('padding-left');
                this.element.css(this.options.OutlineStyle).parent().css(this.options.ParentStyle)
            },
            function(){
                // TODO: 增加父元素padding样式判断逻辑
                this.element.css(this.options.EmptyStyle).parent().css(this.options.ParentStyle)
            }
        );

        // 绑定鼠标点击句柄
        this.element.click(function(){
            // 展示边框
            this.element.css(this.options.OutlineStyle).parent().css({
                'padding': '0 2px 0 2px',
            })
            // TODO: 展示控件
            this.element.addClass('elem-ctrl-active');
            // 自动隐藏
            this.element.autoHide();
        });
    }
 
});

// 初始化
$(document).ready(function(){
   console.log('Hello World!');
})