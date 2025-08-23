(function ($) {
    //遍历所有iframe，返回contentWindow数组
    $.getIframeContentWindowArray = function (_array, _parentWindow) {
        var _this = this;
        var _array = _array || [];
        var _selfWindow = _parentWindow || top;
        _array.push(_selfWindow);
        //获取document
        var _document = _selfWindow.document || _selfWindow.contentDocument;
        $(_document).contents().find("iframe").each(function (index, el) {
            var _iframe = el.contentWindow;
            return _this.getIframeContentWindowArray(_array, _iframe);
        });
        return _array;
    }

    //根据id取出contentWindow对象
    $.getIframeContentWindowById = function (_id, byParamName) {
        var _ws = this.getIframeContentWindowArray();
        var _keyName = byParamName || "pathname";
        for (var i = 0; i < _ws.length; i++) {
            if (_ws[i].location[_keyName] == _id) {
                return _ws[i];
            }
        }
    }
})(jQuery);