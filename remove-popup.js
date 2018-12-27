(function(){
	var kebabCase = function(camelCase){
		return camelCase.replace(/(?<=[a-z])[A-Z]/g, function(m){return "-"+m.toLowerCase();});
	};
	var removePropFromStyleDeclaration = function(declaration, name, value){
		if(declaration[name] == value){
			var kebab = kebabCase(name);
			console.log("removing property '"+kebab+"' from style declaration");
			declaration.removeProperty(kebab);
			return true;
		}
		return false;
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
			if(removePropFromStyleDeclaration(rule.style, name, value)){
				console.log("removed property from css rule for element '"+el.tagName+"'");
			}
		}
	};
	var undoCssProp = function(el, name, value){
		if(removePropFromStyleDeclaration(el.style, name, value)){
			console.log("removed property from element '"+el.tagName+"'");
		}
		removePropFromRulesForElement(el, name, value);
	};
	var undoCss = function(el, props){
		for(var name in props){
			if(props.hasOwnProperty(name)){
				undoCssProp(el, name, props[name]);
			}
		}
	};
	var doForSelfAndParents = function(el, toDo){
		do{
			toDo(el);
		}while((el = el.parentElement) != null)
	};
	var findParentElementOrSelfWithProp = function(el, propName, propValue){
		var style = getComputedStyle(el);
		if(style[propName] == propValue){
			return el;
		}
		if(el.parentElement != null){
			return findParentElementOrSelfWithProp(el.parentElement, propName, propValue);
		}
		return null;
	};
	var removeElementsWithCss = function(x, y, props){
		for(var propName in props){
			if(props.hasOwnProperty(propName)){
				var foundElement;
				var propValue = props[propName];
				while((foundElement = findParentElementOrSelfWithProp(document.elementFromPoint(x, y), propName, propValue)) != null){
					foundElement.remove();
					console.log("removed element '"+foundElement.tagName+"' at position ("+x+","+y+") with propery '"+propName+"' = '"+propValue+"'");
				}
			}
		}
	};
	var act = function(){
		doForSelfAndParents(document.body, function(el){
			undoCss(el, {
				overflowX: "hidden",
				overflowY: "hidden"
			});
		});
		
		var pointsToClear = [
			{
				x: window.innerWidth / 2,
				y: window.innerHeight / 2
			}
		];

		for(var i=0;i<pointsToClear.length;i++){
			var x = pointsToClear[i].x, y = pointsToClear[i].y;
			removeElementsWithCss(x, y, {position: "fixed"});
		}
	};

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.removePopup){
			act();
		}
	});

})();

//https://www.businessinsider.com/iceland-has-made-it-illegal-to-pay-women-less-than-men-2018-1?international=true&r=US&IR=T
//http://www.spiegel.de/politik/ausland/tuerkei-kritik-an-recep-tayyip-erdogan-fuehrt-zu-strafen-gegen-zwei-tv-sender-a-1245499.html