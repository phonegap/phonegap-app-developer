module.exports = {
    setSandbox : function (success, fail, args, env) {
        require("lib/webview").setSandbox(JSON.parse(decodeURIComponent(args[0])));
        new PluginResult(args, env).noResult(false);
    },

    isSandboxed : function (success, fail, args, env) {
        new PluginResult(args, env).ok(require("lib/webview").getSandbox() === "1");
    }
};
