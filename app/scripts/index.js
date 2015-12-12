(function(){

var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-TW&hl=zh-TW&dt=t&dt=bd&dj=1&source=icon&tk=509566|266802&q=";

function createDialogUI(){

	var dialogHtml = "<dialog id='app-tranlateDialog'>" +
									"<div>" +
									"<p id='app-tranlateText'>Test</p>" +
									"</div>" +
									"</dialog>";
	var parent = document.getElementsByTagName("body");
	parent[0].innerHTML += dialogHtml;	
}

function getUrlQuery(query){
	return url + query;
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

	return (function init(){
		createDialogUI();
		document.addEventListener("dblclick",function(e){
			var dialog = document.getElementById("app-tranlateDialog");
			dialog.show();
			dialog.style.top = e.pageY + "px";
			dialog.style.left =   e.pageX + "px";

	 	var query = (document.selection && document.selection.createRange().text) ||
   	          (window.getSelection && window.getSelection().toString());
			var url = getUrlQuery(query);
			var deferred = getJson(url);
			deferred.then(function(data){
				var result =  JSON.parse(data);
				console.log(result);
				var tranlateText = document.getElementById("app-tranlateText");
				tranlateText.textContent = result.dict[0].terms[0];	
			});
		});

		document.addEventListener("click",function(){
			var dialog = document.getElementById("app-tranlateDialog");
			if(dialog.hasAttribute("open")){
				dialog.close();
			}
		});

	})();

})();




