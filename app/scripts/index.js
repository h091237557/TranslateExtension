/* @flow */
(function(){

var tranlateApi = require('./tranlateQuery');

function createDialogUI(){

	var dialog = document.createElement('dialog');
		  dialog.id = 'app-tranlateDialog';
			dialog.innerHTML =  "<div>" +
                            "<ul id='app-tranlateText'></ul>" +
                        "</div>";
		
	var parent = document.getElementsByTagName("body");
  parent[0].appendChild(dialog);
}

function getJson(url){
	return get(url,"json");
}

function get(url,type){
	return ajax({
		url:url,
		type:"GET",
		dataType:type
  });
}

function ajax(options){
	
	if(typeof options === 'undefined'){
		throw new TypeError('Options must be a object');
  }	

	var url = options.url || "",
		type = options.type || "GET",
		dataType = options.dataType || "json"
	
		return new Promise(function(resolve, reject){
		var xhr =  new XMLHttpRequest();
		xhr.open(
			type,
			url,
			typeof options.async === 'undefined' ? true : options.async
    );
		
		Object.keys(options.headers || {}).forEach(function(name) {
   	  xhr.setRequestHeader(name, options.headers[name]);
    });

		xhr.onreadystatechange = function(){
			if(this.readyState !== 4){
				return;
			}

			if(this.status === 200){
				resolve(xhr.response);
			}else{
				reject(xhr);
			}
		};

		xhr.send();

  });
}

function getSelectionCoords(){
	var win = win || window,
		doc = win.document,
		sel = doc.selection, range, rects, rect,
		x= 0 , y= 0 ,result = {};

		sel = win.getSelection();
		if(sel.rangeCount){
			range = sel.getRangeAt(0).cloneRange();
			if (range.getClientRects){
				range.collapse(true);
				rects = range.getClientRects();
				if(rects.length > 0){
					rect = rects[0];
				}
				result.X = rect.left || 0;
				result.Y = rect.top || 0;
				return result;
			}
		}
}

function isSpecialChar(query){
	var reg = /\W/gi;
	var regResult = query.match(reg);
	if(regResult !== null && regResult.length > 0)
		return true; 
	if(query === "" || typeof query === "undefined")
		return true;			

	return false;
}

	return {
		init:function(){
			createDialogUI();
			document.addEventListener("dblclick",function(e){
				var dialog = document.getElementById("app-tranlateDialog"),
					tranlateText = document.getElementById("app-tranlateText"),
					selectNode = window.getSelection() || {},
					query ,url,deferred;

				tranlateText = "";
				query = selectNode.toString();
		//		if(isSpecialChar(query))
			//		return ;


				url = tranlateApi.getUrl(query,selectNode.focusNode.textContent);
				deferred = getJson(url);
				deferred.then(function(data){
					var result =  JSON.parse(data),
							tranlateText = document.getElementById("app-tranlateText"),
							html = "",
							termCount = 0,
							tranlateTexts = [];
				
					tranlateTexts = tranlateApi.getParseResult(result);
					termCount = tranlateTexts.length; 
					if(termCount > 5) termCount = 5;
					for (var i=0;i<termCount;i++){
						html += "<li><a>"+ tranlateTexts[i] +"</a></li>"
					}
					tranlateText.innerHTML = "";
					tranlateText.innerHTML += html;
					dialog.show();
					var position = getSelectionCoords();
					dialog.style.top = (20 +  e.pageY) + "px";
					dialog.style.left = (position.X) + "px";

				});
			});

			document.addEventListener("click",function(){
				var dialog = document.getElementById("app-tranlateDialog");
				if(dialog.hasAttribute("open")){
					dialog.close();
				}
			});
		}
	}


})().init();




