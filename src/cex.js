var keydata = [];
var isNetscape = document.layers;
var isIe = document.all;

(function() {
    try {    
		list();
        detailinfo();
    } catch(ex){}
    
})();

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


function listview(evt, obj){
	try
	{
		//console.log(evt, this);
		var o = obj || this;
		var ch = o.nextSibling;
		
		if (ch.hasAttribute == undefined)
		{
		
			makeRequest({
					method: 'GET',
					url: o.href,
			}).then(function(res){
				
				var parser = new DOMParser();
				var doc = parser.parseFromString(res, "text/html");
				var paragraphs = doc.querySelectorAll("div.rd_file a.bubble");
				
				paragraphs.forEach(function(el) 
				{
					var href = el.getAttribute("href");
					if (href.indexOf('sharebox') > -1) return;
					
					var title = el.getAttribute("title");
					
					var sp = document.createElement('span');
					sp.appendChild(document.createTextNode(' - ' + title))
					insertAfter(sp, o);
					
					var sp = document.createElement('span');
					sp.style.font = '12pt gulim';
					sp.style.color = 'blue';
					sp.style.position = 'relative';
					sp.onclick = function(){
						document.location.href = href;
					}
					sp.appendChild(document.createTextNode(' - pure file download'))
					insertAfter(sp, o);
					
				});
			}).catch(function(error){
				console.error(error);
			});
		
		}		
		
	}
	catch(ex){
		console.error(ex);
	}
}

function list(evt){
	try
	{

		var viewlinks = document.querySelectorAll("a.hx")
		viewlinks.forEach(function(o){
			listview(null, o);
		});
		
	}
	catch(ex){
		console.error(ex);
	}
}

function detailinfo()
{
    try 
    {
        var downloadlinks = document.querySelectorAll("div.rd_file a.bubble")

		downloadlinks.forEach(function(el) 
		{
			var href = el.getAttribute("href");
			if (href.indexOf('sharebox') > -1) return;
			
			var title = el.getAttribute("title");
			
			var sp = document.createElement('span');
			sp.appendChild(document.createTextNode(' - ' + title))
			insertAfter(sp, el);
			
			var sp = document.createElement('span');
			sp.style.font = '12pt gulim';
			sp.style.color = 'blue';
			sp.onclick = function(){
				document.location.href = href;
			}
			sp.appendChild(document.createTextNode(' - pure file download'))
			insertAfter(sp, document.querySelectorAll(".rd.rd_nav_style2")[0]);
		});
        

    }catch (ex){}
   
}

function makeRequest(opts) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.url);

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if (opts.headers) {
            Object.keys(opts.headers).forEach(function (key) {
                xhr.setRequestHeader(key, opts.headers[key]);
            });
        }
        var params = opts.params;
        if (params && typeof params === 'object') {
            params = Object.keys(params).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }
        xhr.send(params);
    });
}