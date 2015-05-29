
/**
 * Copyright (c) 2007-2011, Kaazing Corporation. All rights reserved.
 * 
 * Licensed under the Kaazing Corporation Developer Agreement (2010-02-22), see:
 * 
 *   http://www.kaazing.com/license
 */

function XmppClient(){
};
(function(){
var _1=XmppClient.prototype;
_1.onopen=function(){
};
_1.onclose=function(){
};
_1.onpresence=function(_2){
};
_1.onauthenticated=function(){
};
_1.onerror=function(_3){
};
_1.onmessage=function(_4){
};
_1.connect=function(_5,_6){
var _7=this;
if(_6){
_7._serverName=_6;
}else{
throw new Error("Missing argument: Server Name");
}
var _8=new WebSocket(_5);
_8.onopen=function(){
_connect(_7);
};
_8.onmessage=function(_9){
_readFragment(_7,_9);
};
_8.onclose=function(_a){
_doClose(_7);
};
_7._socket=_8;
_7._pingTimer=setInterval(function(){
_b(_7);
},1000*60*3);
_7._buffer="";
_7._hasStarted=0;
_7._firstStream=true;
_7._hasDisconnected=false;
_7._callbacks={};
_7._chatRooms={};
};
_1.setStatus=function(_c,_d){
var _d=_d||"available";
var _e=n("presence").c(n("status").val(_c)).c(n("show").val(_d));
if(!this._socket.send(_e.toString())){
throw new Error("Could not set status because the connection was closed.");
}
};
_1.disconnect=function(){
if(!this._hasDisconnected){
this._socket.send("</stream:stream>");
this._hasDisconnected=true;
}
};
var _10=function(){
return "KZNG"+Math.floor(Math.random()*Math.pow(2,31));
};
var _b=function(_11){
var _12=n("iq",{"type":"get","id":_10()}).c(n("ping",{"xmlns":"urn:xmpp:ping"}));
_11._socket.send(_12.toString());
};
_1.authenticate=function(_13){
if(typeof (_13.resolve)!="function"){
_authSaslPlain(this,_13);
}else{
var _14=this;
_13.resolve(function(_15){
_authSaslPlain(_14,_15);
});
}
};
function _authSaslPlain(_16,_17){
var _18=String.fromCharCode(0);
_16._jid=_17.username;
if(_16._jid.search("@")===-1){
_16._jid=_16._jid+"@"+_16._serverName;
}
var jid=_16._jid.split("@");
_16._username=jid[0];
_16._serverName=jid[1];
var _1a=_16._jid+_18+_16._username+_18+_17.password;
_1a=btoa(_1a);
var _1b=n("auth",{"xmlns":"urn:ietf:params:xml:ns:xmpp-sasl","mechanism":"PLAIN"}).val(_1a);
if(!_16._socket.send(_1b.toString())){
throw new Error("Could not authenticate because the connection was closed");
}
};
_1.bind=function(_1c){
var id=_10();
var _1e=n("iq",{"type":"set","to":this._serverName,"id":id}).c(n("bind",{"xmlns":"urn:ietf:params:xml:ns:xmpp-bind"}).c(n("resource").val(_1c)));
if(!this._socket.send(_1e.toString())){
throw new Error("Could not bind to resource because the connection was closed");
}
};
_1.sendMessage=function(jid,_20){
var _21=n("message",{"to":jid,"type":"chat","xml:lang":"en"}).c(n("body").val(_20));
if(!this._socket.send(_21.toString())){
throw new Error("Could not send message because the connection was closed");
}
};
_1.getRoster=function(_22){
var id=_10();
var _24=n("iq",{"id":id,"type":"get"}).c(n("query",{"xmlns":"jabber:iq:roster"}));
var cb=function(_26){
_22(_parseRoster(_26));
};
_registerCallback(this,id,cb);
if(!this._socket.send(_24.toString())){
throw new Error("Could not get roster because the connection was closed");
}
};
function _connect(_27,_28){
var _29="";
_29+="<?xml version='1.0'?>";
_29+=_constructStartOfStream(_27._serverName);
if(!_27._socket.send(_29)){
_27.onerror("Could not connect because the connection was closed");
}
};
function _constructStartOfStream(_2a){
frame="<stream:stream";
frame+=" to='"+_2a;
frame+="' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams' version='1.0'>";
return frame;
};
function _doClose(_2b){
clearInterval(_2b._pingTimer);
_2b.onclose();
};
function _registerCallback(_2c,id,cb){
_2c._callbacks[id]=cb;
};
function _readFragment(_2f,evt){
var buf=_2f._buffer;
buf+=evt.data;
var res=_33(buf);
_2f._buffer=res[1];
var _34=res[0];
for(var i=0;i<_34.length;i++){
var msg=_34[i];
if(msg=="START_TOKEN"){
if(_2f._firstStream){
_2f._firstStream=false;
_2f.onopen();
}
}else{
if(msg=="EOF"){
_2f.disconnect();
}else{
_dispatch(_2f,_37(_34[i]));
}
}
}
};
function _parseRoster(_38){
var _39=_38.childNodes[0].childNodes;
var _3a=[];
for(var i=0;i<_39.length;i++){
var _3c={};
_3c["jid"]=_39[i].getAttributeNode("jid").nodeValue;
_3a.push(_3c);
}
return _3a;
};
function _parsePresence(_3d,_3e){
var p={};
var _40=_3e.getAttributeNode("from").nodeValue;
p["from"]=_40;
if(_3e.getAttributeNode("type")){
var _41=_3e.getAttributeNode("type").nodeValue;
if(_41==="error"){
var _42=_40.split("/");
if(_3d._chatRooms[_42[0]]){
_3d._chatRooms[_42[0]].onerror(new Error("Groupchat Error: The nickname you have selected may already be in use."));
}else{
_3d.onerror("Error message received");
}
return;
}
p.status=_41;
}else{
p.status="Available";
}
var _43=_3e.childNodes;
for(var i=0;i<_43.length;i++){
var _45=_43[i].nodeName;
if(_45==="show"){
p[_45]=_43[i].childNodes[0].nodeValue;
}else{
if(_45==="status"){
if(_43[i].childNodes.length){
p[_45]=_43[i].childNodes[0].nodeValue;
}
}
}
}
var _42=_40.split("/");
var _46=_42[0];
if(_3d._chatRooms[_46]){
if(_3d._chatRooms[_46]){
p["from"]=_42[1];
_3d._chatRooms[_46].onpresence(p);
return;
}
}
_3d.onpresence(p);
};
function _dispatch(_47,msg){
var _49=msg.childNodes[0];
if(_49.nodeName==="iq"){
if(_49.getAttributeNode("id")){
var id=_49.getAttributeNode("id").nodeValue;
if(_47._callbacks[id]){
_47._callbacks[id](_49);
}
delete _47._callbacks[id];
}
}else{
if(_49.nodeName==="presence"){
_parsePresence(_47,_49);
}else{
if(_49.nodeName==="success"){
_47._buffer="";
_47._hasStarted=0;
if(!_47._socket.send(_constructStartOfStream(_47._serverName))){
_47.onerror("Could not connect because the connection was closed");
return;
}
_47.onauthenticated();
}else{
if(_49.nodeName==="failure"){
_47.onerror("Not Authorized");
}else{
if(_49.nodeName==="error"){
$thi.onerror("Not Authorized");
}else{
if(_49.nodeName==="message"){
var _4b=_49.childNodes;
var _4c="chat";
if(_49.getAttributeNode("type")){
_4c=_49.getAttributeNode("type").nodeValue;
}
for(var i=0;i<_4b.length;i++){
if(_4b[i].nodeName==="body"){
var _4e={};
var _4f=msg.childNodes[0].getAttributeNode("from").nodeValue;
_4e["body"]=_4b[i].childNodes[0].nodeValue;
if(_4c==="chat"){
_4e["from"]=_4f;
_47.onmessage(_4e);
}else{
if(_4c=="groupchat"){
var _50=_4f.split("/");
var _51=_50[0];
if(_50.length>1){
_4e["from"]=_50[1];
}else{
_4e["from"]=_50[0];
}
if(_47._chatRooms[_51]){
_47._chatRooms[_51].onmessage(_4e);
}
}
}
}
}
}
}
}
}
}
}
};
XmppRoom=function(_52,_53,_54){
this._client=_52;
this._roomName=_53;
this._handle=_54;
_52._chatRooms[_53]=this;
var jid=_53+"/"+_54;
var _56=n("presence",{"to":jid});
_groupSend(this,_56);
};
var _57=XmppRoom.prototype;
_57.onerror=function(_58){
};
_57.onpresence=function(_59){
};
_57.onmessage=function(_5a){
};
_57.sendMessage=function(_5b){
var _5c=n("message",{"to":this._roomName,"type":"groupchat","xml:lang":"en"}).c(n("body").val(_5b));
_groupSend(this,_5c);
};
_57.leave=function(){
var jid=this._roomName+"/"+this._handle;
var _5e=n("presence",{"to":jid,"type":"unavailable"});
_groupSend(this,_5e);
};
function _groupSend(_5f,_60){
if(!_5f._client._socket.send(_60.toString())){
throw new Error("Could not send message because the connection was closed");
}
};
var n=function(_61,_62,_63){
return new nd(_61,_62,_63);
};
var nd=function(_65,_66,_67){
this._node=_65;
this._attributes=_66||{};
this._childNodes=[];
this._text=_67;
};
var $nd=nd.prototype;
$nd.c=function(_69){
this._childNodes.push(_69);
return this;
};
$nd.val=function(_6a){
_6a=_6a.replace("&","&amp;","g").replace(">","&gt;","g").replace("<","&lt;","g");
this.c(n("#text",{},_6a));
return this;
};
$nd.toString=function(){
var s=_6c(this).join("");
return s;
};
var _6c=function(_6d,_6e){
var l=_6e||[];
if(typeof (_6d._text)==="string"){
return [_6d._text];
}
l.push("<");
l.push(_6d._node);
for(var _70 in _6d._attributes){
l.push(" ");
l.push(_70);
l.push("='");
l.push(String(_6d._attributes[_70]).replace("&","&#x26;","g").replace("'","&#39;","g"));
l.push("'");
}
if(_6d._childNodes.length){
l.push(">");
for(var i=0;i<_6d._childNodes.length;i++){
l.push(_6c(_6d._childNodes[i]).join(""));
}
l.push("</");
l.push(_6d._node);
l.push(">");
}else{
l.push("/>");
}
return l;
};
var _37=function(_72){
var _73;
if(typeof (ActiveXObject)==="function"){
_73=new ActiveXObject("Microsoft.XMLDOM");
_73.async="false";
_73.loadXML("<wrapper xmlns:stream=\"http://etherx.jabber.org/streams\" >"+_72+"</wrapper>");
_73=_73.childNodes[0];
}else{
var _74=new DOMParser();
_73=_74.parseFromString("<wrapper xmlns:stream=\"http://etherx.jabber.org/streams\" >"+_72+"</wrapper>","text/xml");
_73=_73.childNodes[0];
}
return _73;
};
_process=function(s){
return _33(s);
};
var _33=function(_76){
var _77=[];
var _78=[];
var i=0;
var tag;
while(i<_76.length-3){
if(_76==="</stream:stream>"){
_76="";
_77.push("EOF");
return [_77,_76];
}else{
if(_76.charAt(i)=="<"){
if(_76.charAt(i+1)==="?"){
var _7b=i;
while(c!==">"){
c=_76.charAt(i);
i++;
if(i>_76.length){
return [_77,_76];
}
}
_76=_76.slice(i);
i=0;
}else{
if(_76.charAt(i+1)=="/"){
var c="";
var _7b=i+2;
while(c!==">"){
c=_76.charAt(i);
i++;
if(i>_76.length){
return [_77,_76];
}
}
tag=_76.slice(_7b,i-1);
if(_78.pop()!==tag){
throw new Error("Bad XML Stream: "+_76+" \n\n With Stack: \n"+_78.toString());
}else{
if(_78.length==0){
_77.push(_76.slice(0,i));
_76=_76.slice(i);
i=0;
}
}
}else{
if(_76.charAt(i+1).match(/\D/)){
var c="x";
var _7b=i+1;
while(c!==" "&&c!=="/"&&c!==">"){
c=_76.charAt(i);
i++;
if(i>_76.length){
return [_77,_76];
}
}
tag=_76.slice(_7b,i-1);
while(c!==">"){
c=_76.charAt(i);
i++;
if(i>_76.length){
return [_77,_76];
}
}
if(_76.charAt(i-2)=="/"){
if(_78.length===0){
_77.push(_76.slice(0,i));
_76=_76.slice(i);
i=0;
}
}else{
if(tag!=="stream:stream"){
_78.push(tag);
}else{
_76=_76.slice(i);
i=0;
_77.push("START_TOKEN");
}
}
}
}
}
}else{
i++;
}
}
}
return [_77,_76];
};
})();
