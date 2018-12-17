(function(){
	var kebabCase = function(camelCase){
		return camelCase.replace(/(?<=[a-z])[A-Z]/g, function(m){return "-"+m.toLowerCase();});
	};
	var findRulesForClass = function(cssClass){
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
				if(!selectorText){
					continue;
				}
				var selectors = selectorText.split(/\s*,\s*/g);
				for(var k=0;k<selectors.length;k++){
					var selector = selectors[k];
					var classNameMatch = selector.match(/[^\.]+$/);
					if(classNameMatch && classNameMatch[0] == cssClass){
						result.push(rule);
					}
				}
			}
			
		}
		return result;
	};
	var removePropFromRulesForClass = function(cssClass, name, value){
		var rules = findRulesForClass(cssClass);
		for(var i=0;i<rules.length;i++){
			var rule = rules[i];
			var styleDeclaration = rule.style;
			if(styleDeclaration[name] == value){
				styleDeclaration.removeProperty(kebabCase(name));
			}
		}
	};
	var undoCssProp = function(el, name, value){
		var styleDeclaration = el.style;
		if(styleDeclaration[name] == value){
			styleDeclaration.removeProperty(kebabCase(name));
		}
		var classAttr = el.getAttribute("class");
		if(!classAttr){
			return;
		}
		var classes = classAttr.split(/\s+/g);
		for(var i=0;i<classes.length;i++){
			removePropFromRulesForClass(classes[i], name, value);
		}
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