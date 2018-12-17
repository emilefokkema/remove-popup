(function(){
	var kebabCase = function(camelCase){
		return camelCase.replace(/(?<=[a-z])[A-Z]/g, function(m){return "-"+m.toLowerCase();});
	};
	var removePropFromStyleDeclaration = function(declaration, name, value){
		if(declaration[name] == value){
			declaration.removeProperty(kebabCase(name));
		}
	};
	var findRulesForElement = function(el){
		var sheets = document.styleSheets;
		var result = [];
		for(var i=0;i<sheets.length;i++){
			var cssStyleSheet = sheets[i];
			var rules;
			try{
				rules = cssStyleSheet.cssRules;
			}catch(e){
				continue;
			}
			for(var j=0;j<rules.length;j++){
				var rule = rules[j];
				var selectorText = rule.selectorText;
				if(el.matches(selectorText)){
					result.push(rule);
				}
			}
			
		}
		return result;
	};
	var removePropFromRulesForElement = function(el, name, value){
		var rules = findRulesForElement(el);
		for(var i=0;i<rules.length;i++){
			var rule = rules[i];
			removePropFromStyleDeclaration(rule.style, name, value);
		}
	};
	var undoCssProp = function(el, name, value){
		removePropFromStyleDeclaration(el.style, name, value);
		removePropFromRulesForElement(el, name, value);
	};
	var undoCss = function(el, props){
		for(var name in props){
			if(props.hasOwnProperty(name)){
				undoCssProp(el, name, props[name]);
			}
		}
	};
	undoCss(document.body,{
		overflowX: "hidden",
		overflowY: "hidden"
	});

	console.log("here I am");
	
	


})();

//https://www.businessinsider.com/iceland-has-made-it-illegal-to-pay-women-less-than-men-2018-1?international=true&r=US&IR=T