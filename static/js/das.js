(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0)})([function(module,exports,__webpack_require__){"use strict";var oldPushState=history.pushState;var oldReplaceState=history.replaceState;var TRACK_ATTR="das-track";var TRACK_ATTR_CMPT="data-das-track";var HOVER_TRACK_ATTR="das-hover-track";var HOVER_TRACK_ATTR_CMPT="data-das-hover-track";try{var doc=document,util=__webpack_require__(1),sc=util.getScreen(),Logger=__webpack_require__(2),qs=window.das&&window.das.q?window.das.q:[],url=doc.location.href,sid=util.getSessionId(),vid=util.uuid(),wid=vid,time=Date.now(),hashtag=false,vqs=[{topic:"visit",uuid:util.uuid(),level:"info",tp:"visit",ts:getTs(),wid:wid,vid:vid,sc:{width:sc.width,height:sc.height},lan:window.navigator.language,pf:window.navigator.platform,sid:sid,ua:window.navigator.userAgent,url:doc.location.href,title:doc.title,from:doc.referrer}],mqs=[],vs={aid:"",vid:vid,wid:wid,sid:sid,pf:window.navigator.platform,lan:window.navigator.language},ps={},client={ps:ps},topics={api:"api",error:"error",action:"action",visit:"visit"};function set(group,key,value){if(group==="hashtag"){return hashtag=key}if(group==="aid"){return vs[group]=key}if(group==="ps"){key&&value!==undefined&&(client[group][key]=value||"")}}function getTs(){return Date.now()}function Das(client,vs,url,hashtag){this.hashtag=hashtag||false;this.client=client;this.logger=new Logger(this.client,vs,url);this.initEvents()}function getTrackAttr(container){var val=getElemAttr(container,TRACK_ATTR_CMPT);if(val===null){val=getElemAttr(container,TRACK_ATTR)}return val}function getHoverTrackAttr(container){var val=getElemAttr(container,HOVER_TRACK_ATTR_CMPT);if(val===null){val=getElemAttr(container,HOVER_TRACK_ATTR)}return val}function getElemAttr(elem,attrName){if(elem.hasAttribute(attrName)==false){return null}return elem.getAttribute(attrName)}function getXPathToElement(element){if(element===document.body||!element||!element.attributes){return""}var tag=element&&element.tagName&&element.tagName.toLowerCase(),track=getTrackAttr(element),isModal=element.attributes.getNamedItem("uc-modal"),modal=isModal&&element.attributes.getNamedItem("window-class")||null,trackMsg=track!=null?":track()":"",modalMsg=modal?":modal("+modal.value+")":"";if(element.id!==""){return"#"+element.id+trackMsg}if(modalMsg){return modalMsg+trackMsg}var ix=0;var parent=element.parentNode;var siblings=parent&&parent.childNodes||[];var clsName=element.className||"";if(!parent){return tag+"."+clsName.split(" ").join(".")}for(var i=0;i<siblings.length;i++){var sibling=siblings[i];if(sibling===element){return getXPathToElement(parent)+"/"+tag+trackMsg+"["+(ix+1)+"]"}if(sibling.nodeType===1&&sibling.tagName&&sibling.tagName.toLowerCase()===tag){ix++}}}function isNeedClickReport(path){return path.search(/\/label\[|\/button\[|\/input\[|\/a\[|\/select\[|\/option\[|\Wtrack\b/)>-1}function getWatchElement(ele){if(ele===document.body||!ele.tagName){return ele}var reg=/^(label|button|input|a|option|select)$/;var tag=ele.tagName.toLowerCase()||"";var parent=ele.parentNode;var isTracked=getTrackAttr(ele)!=null;return isTracked||reg.test(tag)||!parent?ele:getWatchElement(parent)}Das.prototype.initEvents=function(){var self=this;var ev=new util.Event(window);function navigate(to,title){var dr=Date.now()-time,oid=vs.vid,old=url;time=Date.now();setTimeout(function(){url=to;vid=vs.vid=util.uuid();self.send([{topic:"visit",uuid:util.uuid(),level:"info",ts:getTs(),tp:"leave",dr:dr,vid:oid,wid:wid,url:old},{topic:"visit",uuid:util.uuid(),level:"info",ts:getTs(),tp:"visit",url:to,vid:vid,wid:wid,from:old,title:title||doc.title}],true)})}var docEvent=new util.Event(document);docEvent.bind("click",function(event){if(event===undefined){event=window.event}var target=getWatchElement("target"in event?event.target:event.srcElement);var xpath=getXPathToElement(target);var tag=target&&target.tagName&&target.tagName.toLowerCase()||"";if(!isNeedClickReport(xpath)){return}var href=tag==="a"?target.getAttribute("href"):"",track=getTrackAttr(target),type=target.getAttribute("type")||"",targ=tag==="a"&&target.getAttribute("target")||"",value=target.value||target.innerText;if(tag==="input"&&track==null&&(type==="text"||type==="password")){return}das.send("action",{tp:"click",url:location.href,info:{tag:tag,type:tag==="input"&&type||"",href:href||"",value:value,xpath:xpath.replace(/:track\(\)/g,""),target:targ,trackInfo:track}},"info")},true);var cachedOverElements={};var handleHover=function(eventType,event){if(event===undefined){event=window.event}var target="target"in event?event.target:event.srcElement;if(!target||!target.getAttribute){return}var hoverTrack=getHoverTrackAttr(target);var isHoverTracked=hoverTrack!=null;if(!isHoverTracked){return}var xpath=getXPathToElement(target);var tag=target&&target.tagName&&target.tagName.toLowerCase()||"";var href=tag==="a"?target.getAttribute("href"):"",type=target.getAttribute("type")||"",targ=tag==="a"&&target.getAttribute("target")||"",value=target.value||target.innerText;var cleanXPath=xpath.replace(/:track\(\)/g,"");if(eventType==="mouseenter"){cachedOverElements[cleanXPath]=getTs()}else if(eventType==="mouseleave"){if(cleanXPath in cachedOverElements){var mouseEnterTs=cachedOverElements[cleanXPath];delete cachedOverElements[cleanXPath]}else{return}var ts=getTs();das.send("action",{ts:ts,tp:"hover",url:location.href,dr:ts-mouseEnterTs,info:{tag:tag,type:tag==="input"&&type||"",href:href||"",value:value,xpath:xpath.replace(/:track\(\)/g,""),target:targ,trackInfo:hoverTrack}},"info")}};docEvent.bind("mouseenter",function(e){handleHover("mouseenter",e)},true);docEvent.bind("mouseleave",function(e){handleHover("mouseleave",e)},true);ev.bind("error",function(ev){self.send([{topic:"error",uuid:util.uuid(),level:"error",vid:vid,wid:wid,ts:getTs(),tp:"javascript error",fn:ev.filename,msg:"["+ev.lineno+":"+ev.colno+"]"+ev.message,err:JSON.stringify(ev.error)}],true)});ev.bind("beforeunload",function(ev){self.send([{topic:"visit",uuid:util.uuid(),level:"info",vid:vid,wid:wid,url:doc.location.href,ts:getTs(),tp:"leave",dr:Date.now()-time}],true,true)});if(this.hashtag){ev.bind("hashchange",function(ev){navigate(ev.newUrl,doc.title)});ev.bind("popstate",function(ev){navigate(doc.location.href,doc.title)});history.pushState=function(state,title,url){oldPushState&&oldPushState.apply(history,arguments);navigate(url,title)};history.replaceState=function(state,title,url){oldReplaceState&&oldReplaceState.apply(history,arguments);navigate(url,title)}}};Das.prototype.send=function(topic,data,level){var self=this;if(util.isArray(topic)&&data===true){return this.logger.send(topic,data)}this.logger.send(util.extend({topic:topic,uuid:util.uuid(),vid:vid,wid:wid,url:doc.location.href},data,{ts:getTs()}),level||"info")};Das.prototype.set=function(group,key,val){if(group==="ps"){key&&value!==undefined&&(this.client[group][key]=val)}};util.each(qs,function(item){if(!util.isArray(item)||!item.length){return}if(item[0]==="set"&&item.length>1){set.apply(null,item.slice(1))}if(item[0]==="send"&&item.length>1){return mqs.push(item.slice(1))}});var das=window.das=new Das(client,vs,util.url,hashtag);setTimeout(function(){util.each(mqs,function(msg){das.send.apply(das,msg)});das.send(vqs,true)},100)}catch(error){console.error(error)}},function(module,exports){"use strict";var util={};var format=function(v,min){return v<min?"0"+v:v};util.id=0;util.url="//das-rpt-log.ucloud.cn/log";util.uniqueId=function(){return util.id++};util.uuid=function(){var d=(new Date).getTime();if(window.performance&&typeof window.performance.now==="function"){d+=performance.now(),d*=1e3}var uuid="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=(d+Math.random()*16)%16|0;d=Math.floor(d/16);return(c=="x"?r:r&3|8).toString(16)});return uuid};util.encode=function(str){var str=escape(str);var buf=new ArrayBuffer(str.length);var view=new Int8Array(buf);for(var i=0,l=str.length;i<l;i++){view[i]=~str.charCodeAt(i)}return buf};util.decode=function(buf){return String.fromCharCode.apply(null,new Uint16Array(buf))};util.formatTime=function(time){var tm=new Date(time);var tm=new Date(time);var y=tm.getFullYear();var m=format(tm.getMonth()+1);var d=format(tm.getDate());var hh=format(tm.getHours());var mm=format(tm.getMinutes());var ss=format(tm.getSeconds());return y+"-"+m+"-"+d+" "+hh+":"+mm+":"+ss};util.each=function(loopable,callback,context){var args=Array.prototype.slice.call(arguments,3);if(!loopable){return}if(loopable.length===+loopable.length){for(var i=0,l=loopable.length;i<l;i++){callback.apply(context,[loopable[i],i].concat(args))}}else{for(var key in loopable){loopable.hasOwnProperty(key)&&callback.apply(context,[loopable[key],key].concat(args))}}};util.clone=function(obj){var copy={};util.each(obj,function(value,key){copy[key]=value});return copy};util.extend=function(base){util.each(Array.prototype.slice.call(arguments,1),function(ext){util.each(ext,function(value,key){ext.hasOwnProperty(key)&&(base[key]=value)})});return base};util.merge=function(base,master){var args=Array.prototype.slice.call(arguments,0);return util.extend.apply(null,[{}].concat(args))};util.where=function(loopable,filter){var filtered=[];util.each(loopable,function(item){filter(item)&&filtered.push(item)});return filtered};util.find=function(loopable,filter){var tmp;for(var i=0,l=loopable.length;i<l;i++){tmp=filter(loopable[i]);if(tmp){return tmp}}};util.inherits=function(ext){var parent=this,Child=ext&&ext.hasOwnProperty("constructor")?ext.constructor:function(){return parent.apply(this,arguments)},Surrogate=function(){this.constructor=Child};Surrogate.prototype=parent.prototype;Child.prototype=new Surrogate;Child.extend=inherits;ext&&extend(Child.prototype,ext);Child.__super__=parent.prototype;return Child};util.isNumber=function(n){return Object.prototype.toString.apply(n)==="[object Number]"};util.isArray=function(n){return Object.prototype.toString.apply(n)==="[object Array]"};util.isObject=function(n){return Object.prototype.toString.apply(n)==="[object Object]"};util.noop=function(){};util.cookie={};util.cookie.domain=function(){var d;if(this.dm){return this.dm}try{d=window.location.hostname.split(".");return"."+d.slice(-2).join(".")}catch(e){this.dm=window.location.hostname}return this.dm};util.cookie.get=function(name){if(document.cookie.length<=0){return""}var start=document.cookie.indexOf(name+"=");var end=document.cookie.indexOf(";",start);end=end<0?document.cookie.length:end;return start<0?"":unescape(document.cookie.substring(start+name.length+1,end))};util.cookie.set=function(name,value,age){var str=name+"="+escape(value);var max=age?";max-age="+age:"";var exp=new Date(Date.now()+24*3600*1e3*365).toUTCString();document.cookie=str+max+";path=/;expires="+exp+";domain="+this.domain()};util.cookie.clear=function(name){document.cookie=name+"=;expires="+(new Date).toGMTString()};util.decorator=function(ctx,name,func){var old=ctx&&ctx[name];old&&(ctx[name]=function(){func.apply(ctx,arguments);old.apply(ctx,arguments)})};util.getScreen=function(){var cache={};for(var i in window.screen){cache[i]=window.screen[i]}return cache};util.getSessionId=function(){var id=util.cookie.get("das_session");if(!id){id=util.uuid();util.cookie.set("das_session",id)}return id};util.Promise=function(func){this.state=this.phases.pending;this.callbacks={resolve:[],reject:[],clean:[]};func(this.resolve.bind(this),this.reject.bind(this))};util.Promise.prototype.phases={resolve:"done",reject:"abort",pending:"pending"};util.Promise.prototype.methods={resolve:"resolve",reject:"reject",clean:"clean"};util.Promise.prototype.deal=function(type){var funcs=this.callbacks[type];var args=arguments.length>1?Array.prototype.pop.apply(arguments):[];while(funcs&&funcs.length){funcs.shift().apply(this,args)}type===this.methods.clean||(this.state=this.phases[type])};util.Promise.prototype.push=function(type,callback){this.callbacks[type].push(callback);if(this.state===this.phases.done){this.resolve()}if(this.state===this.phases.abort){this.reject()}return this};util.Promise.prototype.clean=function(){this.callbacks.clean.length&&(this.state===this.phases.resolve||this.state===this.phases.reject)&&this.deal(this.methods.clean);this.state=this.phases.pending};util.Promise.prototype.resolve=function(){this.deal(this.methods.resolve,Array.prototype.slice.apply(arguments));this.clean()};util.Promise.prototype.reject=function(){this.deal(this.methods.reject,Array.prototype.slice.apply(arguments));this.clean()};util.Promise.prototype.then=function(callback){return this.push(this.methods.resolve,callback)};util.Promise.prototype.catch=function(callback){return this.push(this.methods.reject,callback)};util.Promise.prototype.finally=function(callback){this.callbacks.clean.push(callback)};util.Event=function(node){this.node=node};util.Event.prototype.bind=function(type,handler,useCapture){if(this.node.addEventListener){this.node.addEventListener(type,handler,useCapture)}else if(this.node.attachEvent){this.node.attachEvent("on"+type,handler)}else{this.node["on"+type]=handler}};util.Event.prototype.unbind=function(type,handler,useCapture){if(this.node.removeEventListener){this.node.removeEventListener(type,handler,useCapture)}else if(this.node.detachEvent){this.node.detachEvent("on"+type,handler)}else{this.node["on"+type]=handler}};util.Event.prototype.watch=function(types,handler){var self=this;util.each(types,function(type){self.bind(type,handler).bind(self)})};util.Event.prototype.unwatch=function(types,handler){var self=this;util.each(types,function(type){self.unbind(type,handler).bind(self)})};util.Storage=function(name){this.name=name;this.storage=window.localStorage||{getItem:getCookie,setItem:setCookie,clear:clearCookie}};util.Storage.support=function(name){return!!window.localStorage};util.Storage.prototype.parse=function(value){return JSON.parse(value)};util.Storage.prototype.stringify=function(value){return JSON.stringify(value)};util.Storage.prototype.get=function(){return this.parse(this.storage.getItem(this.name))};util.Storage.prototype.set=function(value){try{this.storage.setItem(this.name,this.stringify(value))}catch(e){console.error(e)}};util.Storage.prototype.clear=function(){this.storage.clear()};util.Http=function Http(){this.xhr=this.getXhr();this.xhr.withCredentials=true};util.Http.prototype.getXhr=function(){var xhr=window.XMLHttpRequest?new window.XMLHttpRequest:window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):null;if(!xhr){throw new Error("brower not support!")}return xhr};util.Http.prototype.onload=function(resolve,reject){var self=this;return function(){self.xhr.status===200?resolve(self.xhr.responseText):reject(self.xhr.status)}};util.Http.prototype.onerror=function(reject){var self=this;return function(){reject(self.xhr.status)}};util.Http.prototype.send=function(method,url,data){var self=this;var Promise=window.Promise||util.Promise;var datas=util.encode(JSON.stringify(data));return new Promise(function(resolve,reject){self.xhr.onload=self.onload.call(self,resolve,reject);self.xhr.onerror=self.onerror.call(self,reject);self.xhr.onabort=self.onerror.call(self,reject);self.xhr.ontimeout=self.onerror.call(self,reject);self.xhr.open(method,url,true);self.xhr.timeout=15*1e3;self.xhr.setRequestHeader("Accept","application/json, text/plain, * / *");self.xhr.setRequestHeader("Content-type","multipart/form-data");self.xhr.send(datas)})};util.Http.prototype.get=function(url,data){return this.send("GET",url,data)};util.Http.prototype.post=function(url,data){return this.send("POST",url,data)};module.exports=util},function(module,exports,__webpack_require__){"use strict";var debounce=__webpack_require__(3);var util=__webpack_require__(1);var Storage=util.Storage;var Http=util.Http;var Event=util.Event;var max=5;function Logger(client,vs,url){this.url=url;this.aid=vs&&vs.aid;this.vs=vs;this.client=client;this.stack=[];this.locked=false;this.count=0;this.trigger=false;this.event=new Event(window);this.storage=new Storage("das."+this.aid);this.limit=max;this.report=debounce(this._report.bind(this),1e3);this.onload()}Logger.levels={log:"log",info:"info",warn:"warn",error:"error"};Logger.prototype.onload=function(){var old=this.storage.get();old&&old.length&&Array.prototype.unshift.apply(this.stack,old);this.event.bind("beforeunload",function(){this.storage.set(this.stack)}.bind(this))};Logger.prototype.send=function(data,level,immediately){this.record(data,level||"info");if(immediately){this._report()}else{this.report()}};Logger.prototype.record=function(data,level){var datas=util.isArray(data)?data:[util.merge({level:level},{vid:this.vs.vid,wid:this.vs.wid},data)];this.stack.push.apply(this.stack,datas)};Logger.prototype._report=function(){var self=this,http=new Http,len=self.limit,dt,ds;if(this.locked||!this.stack.length){return}ds=this.stack.splice(0,len);dt={st:Date.now(),vs:this.vs,ds:ds,cs:this.client.cs,ps:this.client.ps,aid:this.aid,sid:this.vs.sid};this.locked=true;http.post(self.url,dt).then(onSuccess).catch(onError);function onSuccess(){self.locked=false;self.count=0;self.stack.length>0&&self._report.call(self)}function onError(error){self.locked=false;self.stack.unshift.apply(self.stack,ds);self.count<=5&&(self.count++,self._report.call(self))}};Logger.prototype.clear=function(){this.lock=false;this.stack=[];this.storage.clear()};module.exports=Logger},function(module,exports){(function(global){var FUNC_ERROR_TEXT="Expected a function";var NAN=0/0;var symbolTag="[object Symbol]";var reTrim=/^\s+|\s+$/g;var reIsBadHex=/^[-+]0x[0-9a-f]+$/i;var reIsBinary=/^0b[01]+$/i;var reIsOctal=/^0o[0-7]+$/i;var freeParseInt=parseInt;var freeGlobal=typeof global=="object"&&global&&global.Object===Object&&global;var freeSelf=typeof self=="object"&&self&&self.Object===Object&&self;var root=freeGlobal||freeSelf||Function("return this")();var objectProto=Object.prototype;var objectToString=objectProto.toString;var nativeMax=Math.max,nativeMin=Math.min;var now=function(){return root.Date.now()};function debounce(func,wait,options){var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime=0,leading=false,maxing=false,trailing=true;if(typeof func!="function"){throw new TypeError(FUNC_ERROR_TEXT)}wait=toNumber(wait)||0;if(isObject(options)){leading=!!options.leading;maxing="maxWait"in options;maxWait=maxing?nativeMax(toNumber(options.maxWait)||0,wait):maxWait;trailing="trailing"in options?!!options.trailing:trailing}function invokeFunc(time){var args=lastArgs,thisArg=lastThis;lastArgs=lastThis=undefined;lastInvokeTime=time;result=func.apply(thisArg,args);return result}function leadingEdge(time){lastInvokeTime=time;timerId=setTimeout(timerExpired,wait);return leading?invokeFunc(time):result}function remainingWait(time){var timeSinceLastCall=time-lastCallTime,timeSinceLastInvoke=time-lastInvokeTime,result=wait-timeSinceLastCall;return maxing?nativeMin(result,maxWait-timeSinceLastInvoke):result}function shouldInvoke(time){var timeSinceLastCall=time-lastCallTime,timeSinceLastInvoke=time-lastInvokeTime;return lastCallTime===undefined||timeSinceLastCall>=wait||timeSinceLastCall<0||maxing&&timeSinceLastInvoke>=maxWait}function timerExpired(){var time=now();if(shouldInvoke(time)){return trailingEdge(time)}timerId=setTimeout(timerExpired,remainingWait(time))}function trailingEdge(time){timerId=undefined;if(trailing&&lastArgs){return invokeFunc(time)}lastArgs=lastThis=undefined;return result}function cancel(){if(timerId!==undefined){clearTimeout(timerId)}lastInvokeTime=0;lastArgs=lastCallTime=lastThis=timerId=undefined}function flush(){return timerId===undefined?result:trailingEdge(now())}function debounced(){var time=now(),isInvoking=shouldInvoke(time);lastArgs=arguments;lastThis=this;lastCallTime=time;if(isInvoking){if(timerId===undefined){return leadingEdge(lastCallTime)}if(maxing){timerId=setTimeout(timerExpired,wait);return invokeFunc(lastCallTime)}}if(timerId===undefined){timerId=setTimeout(timerExpired,wait)}return result}debounced.cancel=cancel;debounced.flush=flush;return debounced}function isObject(value){var type=typeof value;return!!value&&(type=="object"||type=="function")}function isObjectLike(value){return!!value&&typeof value=="object"}function isSymbol(value){return typeof value=="symbol"||isObjectLike(value)&&objectToString.call(value)==symbolTag}function toNumber(value){if(typeof value=="number"){return value}if(isSymbol(value)){return NAN}if(isObject(value)){var other=typeof value.valueOf=="function"?value.valueOf():value;value=isObject(other)?other+"":other}if(typeof value!="string"){return value===0?value:+value}value=value.replace(reTrim,"");var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NAN:+value}module.exports=debounce}).call(exports,function(){return this}())}]);