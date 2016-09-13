define(["require", "exports", "text!./nav-bar.html"], function(require, exports) {
    exports.template = require("text!./nav-bar.html");

    var viewModel = (function () {
        function viewModel(params) {
            // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
            // You could remove this viewmodel entirely, and define 'nav-bar' as a template-only component.
            // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.
            this.route = params.route;
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=nav-bar.js.map
