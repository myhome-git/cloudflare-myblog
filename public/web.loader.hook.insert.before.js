(function () {
    // 重新定义console对象，防止console语句报错
    var originalConsole = window.console || {};
    window.console = {
        log: function () { },
        info: function () { },
        warn: function () { },
        error: function () { },
        debug: function () { },
        assert: function () { },
        clear: function () { },
        count: function () { },
        countReset: function () { },
        dir: function () { },
        dirxml: function () { },
        exception: function () { },
        group: function () { },
        groupCollapsed: function () { },
        groupEnd: function () { },
        profile: function () { },
        profileEnd: function () { },
        table: function () { },
        time: function () { },
        timeEnd: function () { },
        timeLog: function () { },
        timeStamp: function () { },
        trace: function () { }
    };

    // 保留原始console方法的引用（可选）
    window.originalConsole = originalConsole;
})();