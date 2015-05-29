
/**
 * Copyright (c) 2007-2011, Kaazing Corporation. All rights reserved.
 * 
 * Licensed under the Kaazing Corporation Developer Agreement (2010-02-22), see:
 * 
 *   http://www.kaazing.com/license
 */

function StompClient(){
};
(function(){
var _1=StompClient.prototype;
_1.onopen=function(_2){
};
_1.onmessage=function(_3,_4){
};
_1.onreceipt=function(_5){
};
_1.onerror=function(_6,_7){
};
_1.onclose=function(){
};
_1.connect=function(_8,_9,_a){
var _b=this;
_9=_9||{};
var _c=new ByteSocket(_8);
_c.onopen=function(){
var _d=_a||{};
if(typeof (_9.resolve)!="function"){
_d.login=_9.username;
_d.passcode=_9.password;
_writeFrame(_b,"CONNECT",_d);
}else{
_9.resolve(function(_e){
_d.login=_e.username;
_d.passcode=_e.password;
_writeFrame(_b,"CONNECT",_d);
});
}
};
_c.onmessage=function(_f){
_readFragment(_b,_f);
};
_c.onclose=function(evt){
_b.onclose();
};
_b._socket=_c;
_b._buffer=new ByteBuffer();
};
_1.disconnect=function(){
_writeFrame(this,"DISCONNECT",{});
};
_1.send=function(_11,_12,_13,_14,_15){
var _16=_15||{};
_16.destination=_12;
_16.transaction=_13;
_16.receipt=_14;
_writeFrame(this,"SEND",_16,_11);
};
_1.subscribe=function(_17,_18,_19,_1a){
var _1b=_1a||{};
_1b.destination=_17;
_1b.ack=_18;
_1b.receipt=_19;
_1b["activemq.subscriptionName"]=_1b["durable-subscriber-name"];
_writeFrame(this,"SUBSCRIBE",_1b);
};
_1.unsubscribe=function(_1c,_1d,_1e){
var _1f=_1e||{};
_1f.destination=_1c;
_1f.receipt=_1d;
_1f["activemq.subscriptionName"]=_1f["durable-subscriber-name"];
_writeFrame(this,"UNSUBSCRIBE",_1f);
};
_1.begin=function(id,_21,_22){
var _23=_22||{};
_23.transaction=id;
_23.receipt=_21;
_writeFrame(this,"BEGIN",_23);
};
_1.commit=function(id,_25,_26){
var _27=_26||{};
_27.transaction=id;
_27.receipt=_25;
_writeFrame(this,"COMMIT",_27);
};
_1.abort=function(id,_29,_2a){
var _2b=_2a||{};
_2b.transaction=id;
_2b.receipt=_29;
_writeFrame(this,"ABORT",_2b);
};
_1.ack=function(_2c,_2d,_2e,_2f){
var _30=_2f||{};
_30["message-id"]=_2c;
_30.transaction=_2d;
_30.receipt=_2e;
_writeFrame(this,"ACK",_30);
};
function _readFragment(_31,evt){
var _33=_31._buffer;
_33.skip(_33.remaining());
_33.putBuffer(evt.data);
_33.flip();
outer:
while(_33.hasRemaining()){
var _34={headers:{}};
if(_33.getAt(_33.position)==_35){
_33.skip(1);
}
_33.mark();
var _36=_33.indexOf(_35);
if(_36==-1){
_33.reset();
break;
}
var _37=_33.limit;
_33.limit=_36;
_34.command=_33.getString(Charset.UTF8);
_33.skip(1);
_33.limit=_37;
while(true){
var _38=_33.indexOf(_35);
if(_38==-1){
_33.reset();
break outer;
}
if(_38>_33.position){
var _37=_33.limit;
_33.limit=_38;
var _39=_33.getString(Charset.UTF8);
_33.limit=_37;
var _3a=_39.search(":");
_34.headers[_39.slice(0,_3a)]=_39.slice(_3a+1);
_33.skip(1);
}else{
_33.skip(1);
var _3b=Number(_34.headers["content-length"]);
var _3c=(_34.headers["content-type"]||"").split(/;\s?charset=/);
if(_34.command!="ERROR"&&!isNaN(_3b)&&_3c[0]!="text/plain"){
if(_33.remaining()<_3b+1){
_33.reset();
break outer;
}
var _37=_33.limit;
_33.limit=_33.position+_3b;
_34.body=_33.slice();
_33.limit=_37;
_33.skip(_3b);
if(_33.hasRemaining()){
_33.skip(1);
}
}else{
var _3d=_33.indexOf(_3e);
if(_3d==-1){
_33.reset();
break outer;
}
var _3f=(_3c[1]||"utf-8").toLowerCase();
if(_3f!="utf-8"&&_3f!="us-ascii"){
throw new Error("Unsupported character set: "+_3f);
}
_34.body=_33.getString(Charset.UTF8);
}
switch(_34.command){
case "CONNECTED":
_31.onopen(_34.headers);
break;
case "MESSAGE":
_31.onmessage(_34.headers,_34.body);
break;
case "RECEIPT":
_31.onreceipt(_34.headers);
break;
case "ERROR":
_31.onerror(_34.headers,_34.body);
break;
default:
throw new Error("Unrecognized STOMP command '"+_34.command+"'");
}
break;
}
}
}
_33.compact();
};
function _writeFrame(_40,_41,_42,_43){
var _44=new ByteBuffer();
_44.putString(_41,_45);
_44.put(_35);
for(var key in _42){
var _47=_42[key];
if(typeof (_47)=="string"){
_44.putString(key,_45);
_44.put(_48);
_44.putString(_47,_45);
_44.put(_35);
}
}
if(_43&&typeof (_43.remaining)=="function"){
_44.putString("content-length",_45);
_44.put(_48);
_44.put(_49);
_44.putString(String(_43.remaining()),_45);
_44.put(_35);
}
_44.put(_35);
switch(typeof (_43)){
case "string":
_44.putString(_43,_45);
break;
case "object":
_44.putBuffer(_43);
break;
}
_44.put(_3e);
_44.flip();
_40._socket.send(_44);
};
var _3e=0;
var _35=10;
var _48=58;
var _49=32;
var _45=Charset.UTF8;
})();
