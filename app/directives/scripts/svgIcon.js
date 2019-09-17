/**
 * Utility directive that compiles SVGs and appends them to the DOM.
 */
module.exports = function(module){
	module.directive('svgIcon', svgIcon);

	svgIcon.$inject = ['$templateRequest', '$compile'];
 
	function svgIcon($templateRequest, $compile){
		return {
			restrict: 'E',
			scope: {
				iconSource: '='
			},
			link: function(scope, element, attributes){
				function processIcon(source){
					var src = 'svg/' + (source || scope.iconSource) + '.svg';

					$templateRequest(src).then(function(template){
						var svgElement = angular.element(template);
						var compiledSvgElement = $compile(svgElement)(scope);
						element.prepend(compiledSvgElement);
					}, true);
				}

				var source = scope.$eval(attributes.svgUrl);
				processIcon(source);

				//handle instances where an SVG takes time to be ready for processing after being fetched at its url
				scope.$watch('iconSource', processIcon);
			}
		}
	}
}