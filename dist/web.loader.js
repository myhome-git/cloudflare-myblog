var WebLoader = WebLoader||{},
	Response,
	_pageObject = _pageObject || {};
	PAGEOBJECT = _pageObject;

(function(window,module){
	
	let _this = module;
	
	//获取对象类型
	module.typeOf = function(object){
		var s = Object.prototype.toString.call(object).toLocaleLowerCase();
		return s.replace(/(^\[object\s*)(.*)(\]$)/,"$2");
	}
	
	//序列化参数
	module.argumentsToMap = function(arrayArguments){
		var _map = new Map(),
			d,name;
		for(var i=0;i<arrayArguments.length;i++){
			d = arrayArguments[i],
			name = _this.typeOf(d);
			if(_map.get(name)===undefined){
				_map.set(name,d);
			}else{
				var y = 0;
				while(_map[name+y]!=undefined){
					y += 1;
				}
				_map.set(name+y,d);
			}
		}
		return _map;
	};
	
	//加入资源
	module.add = function(resourceArray){
		this.__ResourceArray = this.__ResourceArray || [];
		this.ResourceIndex = this.ResourceIndex || [];
		for(var i in resourceArray){
			this.__ResourceArray[i] = resourceArray[i];
			this.ResourceIndex.push(i);
		}
		return this;
	}
	
	//取出资源
	module.getResourceArray = function(){
		return this.__ResourceArray;
	}
	
	//直接输出
	Response = module.use = module.Response = function(name){
		let	_map = _this.argumentsToMap(arguments),
			_mothodName;
		_map.forEach(function(value,key){
			if(/array/.test(key)){
				value.forEach(function(v,k){
					if(_this.ResourceIndex.indexOf(v)>-1){
						_this.__ResourceArray[v].forEach(function(_v,_index){
							_mothodName = _this.GetResponseTypeMothod(_v);
							if(_mothodName){
								_this[_mothodName](_this.Config.PROBJECT_PATH+"/library"+_v);
							}
						})
					}else{
						_mothodName = _this.GetResponseTypeMothod(v);
						if(_mothodName){
							_this[_mothodName](v);
						}
					}
				});
			}
		});
		return this;
	}
	
	//获取加载类型
	module.GetResponseTypeMothod = function(name){
		let _type = ((""+name).match(/\w+$/)+"").toString(),
			_mothodName;
		switch (_type){
			case "ico":
				_mothodName = "ResponseIco";
				break;
			case "js":
				_mothodName = "ResponseJavaScript";
				break;
			case "css":
				_mothodName = "ResponseCSS";
				break;
			case "flash":
				_mothodName = "ResponseFlash";
				break;
			case "html":
				_mothodName = "ResponseHTML";
				break;	
			default:
				_mothodName = "ResponseText";
				break;
		}
		return _mothodName;
	}
	
	//输出ico
	module.ResponseIco = function(name){
		document.write("<link href=\""+name+"\" rel=\"shortcut icon\" />");
	}
	
	//输出js
	module.ResponseJavaScript = function(name){
		if(this.Config && !this.Config.DEBUG){
			name += "?"+new Date().getTime();
		}
		document.writeln("<script type='text/javascript' src='"+name+"'></script>");
	}
	
	//输出css
	module.ResponseCSS = function(name){
		if(this.Config && !this.Config.DEBUG){
			name += "?"+new Date().getTime();
		}
		document.writeln("<link rel=\"stylesheet\" href='"+name+"' />");
	}
	
	//输出html
	module.ResponseHTML = function(name){
		let _id = name.replace(/(\.|\/)/g,"-");
		document.writeln("<script type='text/html' tag='html' src='"+name+"' id='"+_id+"'></script>");
	}
	
	//输出text
	module.ResponseText = function(name){
		let _id = name.replace(/(\.|\/)/g,"-");
		document.writeln("<script type='text/html' tag='text' onload='WebLoader.setLoadState(this)' src='"+name+"' id='"+_id+"'></script>");
	}
	
	/**
	 * 增加load功能，用于页面加载后加载文件
	 */
	
	module.Load = module.load = function(){
		let	_map = _this.argumentsToMap(arguments),
			_mothodName;
		_map.forEach(function(value,key){
			if(/array/.test(key)){
				value.forEach(function(v,k){
					if(_this.ResourceIndex.indexOf(v)>-1){
						_this.__ResourceArray[v].forEach(function(_v,_index){
							_mothodName = _this.GetLoadTypeMothod(_v);
							if(_mothodName){
								_this[_mothodName](_this.Config.PROBJECT_PATH+"/library"+_v);
							}
						})
					}else{
						_mothodName = _this.GetLoadTypeMothod(v);
						if(_mothodName){
							_this[_mothodName](v);
						}
					}
				});
			}
		});
		return this;
	}
	
	//获取加载类型
	module.GetLoadTypeMothod = function(name){
		let _type = ((""+name).match(/\w+$/)+"").toString(),
			_mothodName;
		switch (_type){
			case "ico":
				_mothodName = "LoadIco";
				break;
			case "js":
				_mothodName = "LoadJavaScript";
				break;
			case "css":
				_mothodName = "LoadCSS";
				break;
			case "flash":
				_mothodName = "LoadFlash";
				break;
			default:
				break;
		}
		return _mothodName;
	}
	
	//输出ico
	module.LoadIco = function(name){
		let _body = document.getElementsByTagName("body");
		if(_body.length>0){
			let _dom = document.createElement("link");
			_dom.rel = "shortcut icon";
			_dom.href = name;
			_body[0].appendChild(_dom);
		}
	}
	
	//输出js
	module.LoadJavaScript = function(name){
		let _body = document.getElementsByTagName("body");
		if(_body.length>0){
			let _dom = document.createElement("script");
			_dom.type = "text/javascript";
			_dom.src = name;
			_body[0].appendChild(_dom);
		}
	}
	
	//输出css
	module.LoadCSS = function(name){
		let _body = document.getElementsByTagName("body");
		if(_body.length>0){
			let _dom = document.createElement("link");
			_dom.rel = "stylesheet";
			_dom.href = name;
			_body[0].appendChild(_dom);
		}
	}
	
	//全局初始化，document载入之后执行
	module.DocumentReadySuccess = function(){
//		console.info("DocumentReadySuccess");
		var $body = $("body");
		//判断对象是否跨域或者被嵌套
		if(top != self){
			if(top.location.hostname == self.location.hostname){
				//console.warn("被嵌套框架，"+self.location.pathname,top.location.pathname);
				$body.addClass("iframe-body");
			}else{
				//console.warn("Cross domain，"+self.location.href);
				location.href = "about:blank";
			}
		}
	}
	
	//立即执行的函数
	module.ResponseInit = function(){
		//开始注册document加载之后的程序
		if(document.addEventListener){
			document.addEventListener('DOMContentLoaded',function() {
				document.removeEventListener("DOMContentLoaded", arguments.callee, false); 
				_this.DocumentReadySuccess();
			},false); 
		}else if(document.attachEvent){
			document.attachEvent("onreadystatechange", function(){  
			    if (document.readyState === "complete" ) {  
			        document.detachEvent("onreadystatechange", arguments.callee );  
			        _this.DocumentReadySuccess();
			    }
		  });
		}
	}
	
	module.ResponseInit();
	
})(window,WebLoader);