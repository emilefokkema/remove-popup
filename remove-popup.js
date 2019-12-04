(function(){
	var latestContextMenuElement;
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
		if(!el){
			return null;
		}
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
				while((foundElement = findParentElementOrSelfWithProp(document.elementFromPoint(x, y), propName, propValue)) != null
					&& foundElement.nodeName !== "HTML"){
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
				overflowY: "hidden",
				position: "fixed"
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
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		if(request.removeFromContextMenu){
			var rect = latestContextMenuElement.getBoundingClientRect();
			removeElementsWithCss(rect.x, rect.y, {position: "fixed"});
		}
	});
	document.addEventListener('contextmenu',function(e){
		latestContextMenuElement = e.path[0];
	})

})();

//https://www.businessinsider.com/iceland-has-made-it-illegal-to-pay-women-less-than-men-2018-1?international=true&r=US&IR=T
//http://www.spiegel.de/politik/ausland/tuerkei-kritik-an-recep-tayyip-erdogan-fuehrt-zu-strafen-gegen-zwei-tv-sender-a-1245499.html
//https://www.sueddeutsche.de/kultur/debuetroman-die-bestie-in-menschengestalt-1.3954646
//https://www.washingtonpost.com/entertainment/books/book-subtitles-are-getting-ridiculously-long-what-is-going-on/2019/06/04/3150bcc8-86c3-11e9-98c1-e945ae5db8fb_story.html?utm_term=.3b05894366ab
//https://www.thewindowsclub.com/startup-folder-in-windows-8
//https://www.space.com/30610-scale-of-solar-system-amazing-video.html
//https://lareviewofbooks.org/article/is-there-a-crisis-of-truth/