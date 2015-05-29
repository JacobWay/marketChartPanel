

function Common()
{
}

var $ = function(s) { return document.getElementById(s); };

Common.isIE = function (v) {
    return navigator.appVersion.indexOf("MSIE") >= 0 &&
           (!v || navigator.appVersion.indexOf("MSIE "+v) >= 0);
}

Common.isIPhone = function () {
    return navigator.appVersion.indexOf("iPhone") >= 0;
}

Common.isIPad = function () {
    return navigator.appVersion.indexOf("iPad") >= 0;
}

Common.getWSLocation = function(service) {
    var protocol="wss";
    var authority = location.host;
    if (parent.location.hash.substr(0,10) === "#ws.scheme") {
        protocol=parent.location.hash.substr(11,parent.location.hash.length);
    }
    if (parent.location.hash === "#cleartext") {
        protocol="ws";
    }
    // return protocol + '://' + authority + '/' + service;
    return protocol + '://' + "demo.kaazing.com" + '/' + service;
/*
  // default the location
  var authority = location.host;
  if (location.search) {
    authority = location.search.slice(1) + "." + authority;
  } else if (location.port) {
    authority = location.host + ':' + location.port;
  } else {
    var port=80;
    if (location.protocol == "https:")
      port=443;
    authority = location.host + ':' + port;
  }

  service = service || "activemq";

  var subdomain = "";
  if (service == "activemq")
    subdomain = "stomp.";
  else if (service == "gtalk")
    subdomain = "xmpp.";
 
  return location.protocol.replace("http", "ws") + "//" + subdomain + "kaazing.me/" + service;
*/
}

Common.escapeHTML = function(s) {
  if (!s)
    return "";

  try {
    return s.replace("&", "&amp;", "g")
            .replace("<", "&lt;", "g")
            .replace(">", "&gt;", "g");
  } catch (e) {
      return "NOT A STRING";
  }
}

Common.escapeParam = function(v) {
  if (v == null)
    return "";
  else if (typeof v == "number")
    return v;

  //Careful: newline is actually platform dependent
  return v.replace(/&/g, '&amp;').replace(/\"/g, '&quot;').replace(/\n/g, '&#13;').replace(/>/g,"&gt;");
}

function show(s)
{
  var elt=document.createElement("div");
  elt.innerHTML=s;
  document.body.appendChild(elt);
}

function unparse(obj, options) {
  if (obj)
  {
    if (typeof obj == 'object')
      return unparseObject(obj, options);
    else
      return obj.toString();
  }
  else
  {
    if (obj === "")
      return "<empty string>";
    else if (obj === undefined)
      return "<undefined>";
    else if (obj === null)
      return "<null>";
    else if (obj === false)
      return "false";
    else if (obj === 0)
      return "0";
    else
      return "<unknown: "+obj+">";
  }
}

function unparseObject(obj, options) {
  var out='';
  options = options || null;

  if (obj.constructor && obj.constructor.name)
    out += '[object '+obj.constructor.name+':\n';
  else
    out += '[object:\n';

  try {
    for (name in obj)
    {
      try {
        var val=obj[name];

        if (typeof val == 'function')
        {
          if (options && options.includeFunctions)
            out += "  "+name+": "+val.name + "() {...}\n";
        }
        else
        {
          if (val && typeof val == 'object')
          {
            if (!val.constructor)
              val = typeof val;
            else
            {
              var constName=val.constructor.name || "???";
              val = "["+constName;
              if (options && options.depth > 0)
                val += "\n"+unparse(val);
              val += "]";
            }
          }
          else if (typeof val == 'string')
          {
            if (val.length > 1024)
              val=val.substring(0,1024);
          }

          out += "  "+name+": "+val+"\n";
        }
      } catch (e) {
        out += "  "+name+": [Error]\n";
      }
    }
  } catch (e) {
    try {
      out += "error while logging: "+e;
    } catch (e) {
      out += "error while logging: ???";
    }
  }

  out += "]";

  return out;
}

Common.domGetLeft = function(elt) {
  if (elt.x)
    return elt.x;

  var left=0;
  while (elt != null)
  {
    left += elt.offsetLeft;
    elt = elt.offsetParent;
  }

  return left;
}

Common.domGetTop = function(elt) {
  if (elt.y)
    return elt.y;

  var top=0;
  while (elt != null)
  {
    top += elt.offsetTop;
    elt = elt.offsetParent;
  }

  return top;
}

Common.domGetWidth = function(elt) {
    return elt.clientWidth;
}
    
Common.domGetHeight = function(elt) {
    return elt.clientHeight;
}

Common.domContains = function(outerElt, innerElt) {
    while (innerElt != null) {
        if (innerElt == outerElt) {
            return true;
        }
        innerElt = innerElt.parentNode;
    }

    return false;
}

Common.getWindowWidth = function() {
    if (Common.isIE())
	//	return document.body.clientWidth;
	return document.documentElement.clientWidth;
    else
	return window.innerWidth;
}
    
Common.getWindowHeight = function() {
    if (Common.isIE())
	// return document.body.clientHeight;
	return document.documentElement.clientHeight;
    else
	return window.innerHeight;
}

Common.getFormattedTime = function(ampm) {
    var currTime = new Date();    
    var currHour = currTime.getHours();
    var currMinutes = currTime.getMinutes();
    var currSeconds = currTime.getSeconds();
    var suffix="";

    if (ampm) {
      var isAM = (currHour < 12);
      if (currHour > 12) currHour -= 12;
      if (currHour == 0) currHour = 12;
      suffix = " "+(isAM ? "AM" : "PM");
    }

    if (!ampm && currHour < 10) currHour = ("0" + currHour);
    if (currMinutes < 10) currMinutes = ("0" + currMinutes);
    if (currSeconds < 10) currSeconds = ("0" + currSeconds);

    return currHour+":"+currMinutes+":"+currSeconds+suffix;
}

Common.getFormattedDate = function() {
    var now = new Date();    
    var s=now.toLocaleDateString();
    s=s.replace(/,/g,"");
    s=s.substr(0, s.length-4);
    return s;
}

Common.getEventKeyCode = function(ev) {
    ev = ev || window.event;
    return ev.keyCode ? ev.keyCode : ev.which ? ev.which : ev.charCode;
}

Common.getEventTarget = function(ev) {
    if (Common.isIE())
        return window.event.srcElement;
    else
        return ev.target;
}

/*
 * Sets the opacity for an image, where opacity has range [0..1]
 */
Common.setOpacity = function(elt, opacity) {
    if (Common.isIE())
        elt.style.filter = "alpha(opacity="+(opacity*100)+");";
    else
        elt.style.opacity = opacity;
}

Common.setClass = function(elt, className) {
    elt.setAttribute("class", className);
    elt.className = className;//IE6
}

/*
 * Message Dispatcher
 */
function MessageDispatcher(stompClient)
{
    this.stomp = stompClient;
    this.messageQueue = [];
    this.services = {};
}

MessageDispatcher.prototype.registerService = function(topic, service)
{
  this.services[topic] = service;
  this.stomp.subscribe(topic);
}

MessageDispatcher.prototype.handleMessage = function(headers, body)
{
    var destination = headers["destination"];

    var service = this.services[destination];
    if (service)
        try {
            service.onmessage(headers, body);
        } catch(e) {
            show("ERROR in onmessage for topic "+destination+": "+e);
        }
    else
        show(destination+": "+body);
}

/*
 * Tasks
 */
function Task(id, fun, numSteps, delay, wait)
{
    this.id = id;
    this.fun = fun;
    this.step = 0;
    this.numSteps = numSteps != undefined ? numSteps : 1;
    this.delay = delay || 100;
    this.nextTime = wait || delay || 0;
}

/*
 * Scheduler
 */
var t0 = new Date().getTime();
function now()
{
    return new Date().getTime()-t0;
}

function Scheduler()
{
    this.interval = 100;
    this.drift = true;
    this.tasks = {};
    this.stopping = false;
    this.nextId=0;

    this.startTime = new Date().getTime();
    this.nextTime = this.startTime + this.interval;

    this.stats = {};
    this.stats.longDrift=0;
    this.stats.longTask=0;
    this.stats.longSchedule=0;
    this.stats.skippedIntervals=0;
    
    var $this = this;
    function go() {
        if (!$this.stopping) {
	    var now = new Date().getTime();

	    var wait;
	    if ($this.drift) {
		wait = $this.interval;
	    } else {
		wait = $this.nextTime - now;
		if (wait < 0) {
		    wait = 0;
		    $this.stats.skippedIntervals++;
		}
	    }
	    
            setTimeout0(go, wait, "scheduler");
	    
	    $this.nextTime += $this.interval;
	    
            var tasks = $this.tasks;
	    var t0 = new Date().getTime();
            for (taskId in tasks) {
                var task = tasks[taskId];
                
                /* Determine whether task should execute at this time */
                var execute = true;
                if (task.nextTime > 0) {
                    task.nextTime -= $this.interval; // should compute and compare to now
                    if (task.nextTime > 0)
                        execute = false;
                }
                
                if (execute) {
                    if (++task.step == task.numSteps) {
                        $this.removeTask(task.id);
                    }
                    
                    if (task.delay) {
                        task.nextTime += task.delay;
                    }

                    try {                      
			var taskt0 = new Date().getTime();
			if (taskt0 - t0 > $this.stats.longDrift)
			    $this.stats.longDrift = taskt0 - t0;

                        task.fun();

			now = new Date().getTime();
			var t = now - taskt0;
			if (t > $this.stats.longTask)
			    $this.stats.longTask = t;
                    } catch (e) {
			//show("ERROR in task "+task.id+": "+unparse(e));
                    }
                }
            }

	    now = new Date().getTime();
	    var t = now - t0;
	    if (t > $this.stats.longSchedule)
		$this.stats.longSchedule = t;
        }
    }

    go();
}

Scheduler.prototype.addTask = function(fun, numSteps, delay, wait) {
    var id = this.nextId++;
    var task = new Task(id, fun, numSteps, delay, wait);
    this.tasks[id] = task;
}

Scheduler.prototype.removeTask = function(id) {
    delete this.tasks[id];
}

Scheduler.prototype.stop = function() {
    this.stopping = true;
}

var scheduler = new Scheduler();

var countTimeouts=0;
var whichTimeouts;
function setTimeout0(fun, ms, which)
{
    countTimeouts++;
    /*
    if (!whichTimeouts)
        whichTimeouts={};
    whichTimeouts[which] = (whichTimeouts[which]||0)+1;
    }

    if (countTimeouts % 100 == 0) {
	scheduler.stats.longDrift=0;
	scheduler.stats.longTask=0;
	scheduler.stats.longSchedule=0;
	scheduler.stats.skippedIntervals=0;
    }
    */
    setTimeout(fun, ms);
}
var countryNames = {
'AF':'Afghanistan',
'AX':'åland Islands',
'AL':'Albania',
'DZ':'Algeria',
'AS':'American Samoa',
'AD':'Andorra',
'AO':'Angola',
'AI':'Anguilla',
'AQ':'Antarctica',
'AG':'Antigua and Barbuda',
'AR':'Argentina',
'AM':'Armenia',
'AW':'Aruba',
'AU':'Australia',
'AT':'Austria',
'AZ':'Azerbaijan',
'BS':'Bahamas',
'BH':'Bahrain',
'BD':'Bangladesh',
'BB':'Barbados',
'BY':'Belarus',
'BE':'Belgium',
'BZ':'Belize',
'BJ':'Benin',
'BM':'Bermuda',
'BT':'Bhutan',
'BO':'Plurinational State of Bolivia',
'BA':'Bosnia and Herzegovina',
'BW':'Botswana',
'BV':'Bouvet Island',
'BR':'Brazil',
'IO':'British Indian Ocean Territory',
'BN':'Brunei Darussalam',
'BG':'Bulgaria',
'BF':'Burkina Faso',
'BI':'Burundi',
'KH':'Cambodia',
'CM':'Cameroon',
'CA':'Canada',
'CV':'Cape Verde',
'KY':'Cayman Islands',
'CF':'Central African Republic',
'TD':'Chad',
'CL':'Chile',
'CN':'China',
'CX':'Christmas Island',
'CC':'Cocos (Keeling) Islands',
'CO':'Colombia',
'KM':'Comoros',
'CG':'Congo',
'CD':'The Democratic Republic of The Congo',
'CK':'Cook Islands',
'CR':'Costa Rica',
'CI':'Côte D Ivoire',
'HR':'Croatia',
'CU':'Cuba',
'CY':'Cyprus',
'CZ':'Czech Republic',
'DK':'Denmark',
'DJ':'Djibouti',
'DM':'Dominica',
'DO':'Dominican Republic',
'EC':'Ecuador',
'EG':'Egypt',
'SV':'El Salvador',
'GQ':'Equatorial Guinea',
'ER':'Eritrea',
'EE':'Estonia',
'ET':'Ethiopia',
'FK':'Falkland Islands (Malvinas)',
'FO':'Faroe Islands',
'FJ':'Fiji',
'FI':'Finland',
'FR':'France',
'GF':'French Guiana',
'PF':'French Polynesia',
'TF':'French Southern Territories',
'GA':'Gabon',
'GM':'Gambia',
'GE':'Georgia',
'DE':'Germany',
'GH':'Ghana',
'GI':'Gibraltar',
'GR':'Greece',
'GL':'Greenland',
'GD':'Grenada',
'GP':'Guadeloupe',
'GU':'Guam',
'GT':'Guatemala',
'GG':'Guernsey',
'GN':'Guinea',
'GW':'Guinea-Bissau',
'GY':'Guyana',
'HT':'Haiti',
'HM':'Heard Island and Mcdonald Islands',
'VA':'Holy See (Vatican City State)',
'HN':'Honduras',
'HK':'Hong Kong',
'HU':'Hungary',
'IS':'Iceland',
'IN':'India',
'ID':'Indonesia',
'IR':'Islamic Republic of Iran',
'IQ':'Iraq',
'IE':'Ireland',
'IM':'Isle of Man',
'IL':'Israel',
'IT':'Italy',
'JM':'Jamaica',
'JP':'Japan',
'JE':'Jersey',
'JO':'Jordan',
'KZ':'Kazakhstan',
'KE':'Kenya',
'KI':'Kiribati',
'KP':'Democratic Peoples Republic of Korea',
'KR':'Republic of Korea',
'KW':'Kuwait',
'KG':'Kyrgyzstan',
'LA':'Lao Peoples Democratic Republic',
'LV':'Latvia',
'LB':'Lebanon',
'LS':'Lesotho',
'LR':'Liberia',
'LY':'Libyan Arab Jamahiriya',
'LI':'Liechtenstein',
'LT':'Lithuania',
'LU':'Luxembourg',
'MO':'Macao',
'MK':'The Former Yugoslav Republic of Macedonia',
'MG':'Madagascar',
'MW':'Malawi',
'MY':'Malaysia',
'MV':'Maldives',
'ML':'Mali',
'MT':'Malta',
'MH':'Marshall Islands',
'MQ':'Martinique',
'MR':'Mauritania',
'MU':'Mauritius',
'YT':'Mayotte',
'MX':'Mexico',
'FM':'Federated States of Micronesia',
'MD':'Republic of Moldova',
'MC':'Monaco',
'MN':'Mongolia',
'ME':'Montenegro',
'MS':'Montserrat',
'MA':'Morocco',
'MZ':'Mozambique',
'MM':'Myanmar',
'NA':'Namibia',
'NR':'Nauru',
'NP':'Nepal',
'NL':'Netherlands',
'AN':'Netherlands Antilles',
'NC':'New Caledonia',
'NZ':'New Zealand',
'NI':'Nicaragua',
'NE':'Niger',
'NG':'Nigeria',
'NU':'Niue',
'NF':'Norfolk Island',
'MP':'Northern Mariana Islands',
'NO':'Norway',
'OM':'Oman',
'PK':'Pakistan',
'PW':'Palau',
'PS':'Palestinian Territory, Occupied',
'PA':'Panama',
'PG':'Papua New Guinea',
'PY':'Paraguay',
'PE':'Peru',
'PH':'Philippines',
'PN':'Pitcairn',
'PL':'Poland',
'PT':'Portugal',
'PR':'Puerto Rico',
'QA':'Qatar',
'RE':'Réunion',
'RO':'Romania',
'RU':'Russian Federation',
'RW':'Rwanda',
'BL':'Saint Barthélemy',
'SH':'Saint Helena',
'KN':'Saint Kitts and Nevis',
'LC':'Saint Lucia',
'MF':'Saint Martin',
'PM':'Saint Pierre and Miquelon',
'VC':'Saint Vincent and The Grenadines',
'WS':'Samoa',
'SM':'San Marino',
'ST':'Sao Tome and Principe',
'SA':'Saudi Arabia',
'SN':'Senegal',
'RS':'Serbia',
'SC':'Seychelles',
'SL':'Sierra Leone',
'SG':'Singapore',
'SK':'Slovakia',
'SI':'Slovenia',
'SB':'Solomon Islands',
'SO':'Somalia',
'ZA':'South Africa',
'GS':'South Georgia and The South Sandwich Islands',
'ES':'Spain',
'LK':'Sri Lanka',
'SD':'Sudan',
'SR':'Suriname',
'SJ':'Svalbard and Jan Mayen',
'SZ':'Swaziland',
'SE':'Sweden',
'CH':'Switzerland',
'SY':'Syrian Arab Republic',
'TW':'Province of China, Taiwan',
'TJ':'Tajikistan',
'TZ':'United Republic of Tanzania',
'TH':'Thailand',
'TL':'Timor-Leste',
'TG':'Togo',
'TK':'Tokelau',
'TO':'Tonga',
'TT':'Trinidad and Tobago',
'TN':'Tunisia',
'TR':'Turkey',
'TM':'Turkmenistan',
'TC':'Turks and Caicos Islands',
'TV':'Tuvalu',
'UG':'Uganda',
'UA':'Ukraine',
'AE':'United Arab Emirates',
'GB':'United Kingdom',
'US':'United States',
'UM':'United States Minor Outlying Islands',
'UY':'Uruguay',
'UZ':'Uzbekistan',
'VU':'Vanuatu',
'VE':'Bolivarian Republic of Venezuela',
'VN':'Viet Nam',
'VG':'Virgin Islands, British',
'VI':'Virgin Islands, U.S.',
'WF':'Wallis and Futuna',
'EH':'Western Sahara',
'YE':'Yemen',
'ZM':'Zambia',
'ZW':'Zimbabwe'
};
function blink(elt, up, steps) {
    // don't try to blink elements that have not loaded
    if (typeof(elt) == "undefined") {
        return;
    }

    var BLINKCOUNT = 1;
    var DELAY = 15;
    n = typeof(steps) == "undefined" ? BLINKCOUNT: steps;

    if (n != 0) {
        var r = (up < 0) ? 255 : (255  *(BLINKCOUNT-n)/BLINKCOUNT);
        var g = (up >= 0) ? 255 : (255  *(BLINKCOUNT-n)/BLINKCOUNT);
        var b = 255 *(BLINKCOUNT-n)/BLINKCOUNT; 

        var color = ["rgb(", Math.floor(r), ",", Math.floor(g), ",", Math.floor(b), ")"];
        elt.style.backgroundColor = color.join("");

        setTimeout0(function () {
            blink(elt, up, n-1);
        }, DELAY, "box");
    }
    else
        elt.style.backgroundColor = "inherit";
}

// opacity of the gray masks
var BASE_OPACITY = 60;
var CLICKED_OPACITY = 95;

function setOpacity(elt, percentage) {
    // for most browsers
    elt.style.opacity = percentage/100;
    // IE filters
    elt.style.filter = ["alpha(opacity = ", percentage, ");"].join("");
}

function fadeIn(e) {
    if (!e) var e = window.event;
    var elt = e.target || e.srcElement;
    setOpacity(elt, 0);
}

function fadeOut(e) {   
    if (!e) var e = window.event;
    var elt = e.target || e.srcElement;
    
    // first turn the info overlay off
    if (elt.clouded) {
        toggleInfo(e);
    }
    
    setOpacity(elt, BASE_OPACITY);
}

function toggleInfo(e) {
    if (!e) var e = window.event;
    var elt = e.target || e.srcElement;
    var opacity = elt.clouded ? 0 : CLICKED_OPACITY;
    
    setOpacity(elt, opacity);
    elt.firstChild.style.display = elt.clouded ? "none" : "block";

    elt.clouded = !elt.clouded;
}


var grayMasks = [];

function toggleAllMasksVisibility(mode) {
    for (var i=0; i<grayMasks.length; i++) {
        grayMasks[i].style.display = mode;
    }
}

function initFading() {
    // turn off for ie6, 7
    if (/*temporarily off for all browsers*/ true || document.all && !window.postMessage) {
        return;
    }

    var ids = ["newsfeed", "currencyBlock", "stockBlock", "chatBlock"];

    for (var i=0; i<ids.length; i++) {
        var elt = $(ids[i]);
   
        var mask = document.createElement("div");
        mask.style.backgroundColor = "#CCCCCC";
        mask.style.position = "absolute";
        mask.style.zIndex = 9999;
        mask.style.left = elt.offsetLeft + "px";
        mask.style.top = elt.offsetTop + "px";
        mask.style.height = elt.clientHeight + "px";
        mask.style.width = elt.clientWidth + "px";
        mask.style.color = "#FFF";
        
        setOpacity(mask, BASE_OPACITY);
        
        // gray out divs for info
        var info = document.createElement("div");
        info.style.display = "none";
        info.innerHTML = "[example text]"
        info.style.padding = "50px";
        mask.appendChild(info);
        mask.clouded=false;
        mask.onclick = toggleInfo;        
        
        document.body.appendChild(mask);
        mask.onmouseover = fadeIn;
        mask.onmouseout = fadeOut;
        

        
        // remember this mask element so we can turn it off in 'uncomfortable' mode
        grayMasks.push(mask);
    }
}

function check() {    
    x = ""+parent.location;
    if (x.search("off") > -1)
      box();
    else
      action();
}

function box() {
    box1=document.getElementById('center-off');
    box2=document.getElementById('center-on');
    
    if (box1.style.display != "inline") {
        // turn off  fading masks
        toggleAllMasksVisibility("none")
    
        box1.style.display = "inline";
        box2.style.display = "none";
        document.getElementById("tab").src="/assets/Image/tab2.gif";
    } else action();
}

function action() {
    box1=document.getElementById('center-off');
    box2=document.getElementById('center-on');

        // turn on fading masks
        toggleAllMasksVisibility("block")

    if (box2.style.display != "inline") {
        box2.style.display = "inline";
        box1.style.display = "none";
        document.getElementById("tab").src="/assets/Image/tab.gif";
    }
}
/** * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/ * * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License: * http://www.opensource.org/licenses/mit-license.php * */if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;/**
 * Copyright (c) 2007-2009, Kaazing Corporation. All rights reserved.
 */

function Graph(vals)
{
    this.init(vals);
}

(function() {

    // total height of 254 minus fudge to account for top diamond
    var TOP = 161;
    var LEFT = 25;
    var HEIGHT = 110;
    var WIDTH = 50;
    var OFFSETX = 33.5;
    var OFFSETY = 11;
    var STARTVAL = .25;

    var STEPS = (Common.isIE(6)||Common.isIE(7)) ? 2 : 10;
    var TIMESTEP = 500 / STEPS;

    Graph.prototype.init = function(ratios) {
        this.vals = [STARTVAL,STARTVAL,STARTVAL,STARTVAL,STARTVAL];
	this.steps = 0;

        var wrapper = document.createElement("div");
        wrapper.style.position="relative";
        wrapper.style.left = "0px";
        wrapper.style.top = "0px";
        wrapper.style.width="260px";
        wrapper.style.height="240px";
        wrapper.style.overflow = "hidden";
        wrapper.style.backgroundColor = "white";
        this.wrapper = wrapper;

        var elt = document.createElement("div");
        wrapper.appendChild(elt);

        elt.style.overflow = "hidden";
        elt.style.position = "relative";
        elt.style.left = "0px";
        elt.style.top = "0px";
        elt.style.width="1000px";
        elt.style.height="240px";
        elt.style.backgroundImage = "url('/assets/Image/bg.png')";
        elt.style.backgroundRepeat = "no-repeat";
        elt.style.backgroundPosition = "5px 0px";

        this.bars = [];
        this.masks = [];

        for (var i=0; i<ratios.length; i++) {
            var bar = document.createElement("img");
            bar.src = "/assets/Image/bar.gif"; //need gif for IE6 transparency
            bar.style.zIndex = 2*i;
            bar.style.position = "absolute";
            bar.style.top = (TOP+OFFSETY*i) + "px";
            bar.style.left = (LEFT+OFFSETX*i) + "px";

            this.bars[i] = bar;
            elt.appendChild(this.bars[i]);
        }

        var bottomMask = document.createElement("img");
        bottomMask.src = "/assets/Image/mask.gif"; //need gif for IE6 transparency
        bottomMask.style.zIndex = 99;
        bottomMask.style.position = "absolute";
        bottomMask.style.top = "0px";
        bottomMask.style.left = "0px";
        elt.appendChild(bottomMask);

        this.update(ratios, 1);
	run(this);
    }

    Graph.prototype.getElement = function() {
        return this.wrapper;
    }

    var setHeight = function(bar, i, v) {
	// account for diagonal appearance of chart
        bar.style.top = Math.round(TOP+OFFSETY*i-v*HEIGHT) + "px";
    }

    function run($this) {
	scheduler.addTask(function() { 
            var steps = $this.steps;
            if (steps > 0) {
		var bars = $this.bars;
		var newvals = $this.vals;
		var oldvals = $this.oldvals;
		
		for (var i=0; i<bars.length; i++) {
		    var delta = (newvals[i] - oldvals[i])/steps;
		    oldvals[i] += delta;
		    setHeight(bars[i], i, oldvals[i]);
		}

		$this.steps--;
	    }
        }, 0, TIMESTEP);
    }

    Graph.prototype.update = function(vals, steps) {
        var steps = steps || STEPS;
        var oldvals = this.vals;   
        var newvals = [];

        for (var i =0; i<vals.length; i++) {
            var bar = this.bars[i];
            var v = vals[i];
            v = Math.max(v, 0);
            v = Math.min(v, 1); 
            newvals.push(v);
        }

        this.vals = newvals;
	this.oldvals = oldvals;
	this.steps = steps;
    }

// end of module closure
})();

/* This notice must be untouched at all times.

wz_jsgraphics.js    v. 3.05
The latest version is available at
http://www.walterzorn.com
or http://www.devira.com
or http://www.walterzorn.de

Copyright (c) 2002-2009 Walter Zorn. All rights reserved.
Created 3. 11. 2002 by Walter Zorn (Web: http://www.walterzorn.com )
Last modified: 2. 2. 2009

Performance optimizations for Internet Explorer
by Thomas Frank and John Holdsworth.
fillPolygon method implemented by Matthieu Haller.

High Performance JavaScript Graphics Library.
Provides methods
- to draw lines, rectangles, ellipses, polygons
	with specifiable line thickness,
- to fill rectangles, polygons, ellipses and arcs
- to draw text.
NOTE: Operations, functions and branching have rather been optimized
to efficiency and speed than to shortness of source code.

LICENSE: LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License (LGPL) as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA,
or see http://www.gnu.org/copyleft/lesser.html
*/


var jg_ok, jg_ie, jg_fast, jg_dom, jg_moz;


function _chkDHTM(wnd, x, i)
// Under XUL, owner of 'document' must be specified explicitly
{
	x = wnd.document.body || null;
	jg_ie = x && typeof x.insertAdjacentHTML != "undefined" && wnd.document.createElement;
	jg_dom = (x && !jg_ie &&
		typeof x.appendChild != "undefined" &&
		typeof wnd.document.createRange != "undefined" &&
		typeof (i = wnd.document.createRange()).setStartBefore != "undefined" &&
		typeof i.createContextualFragment != "undefined");
	jg_fast = jg_ie && wnd.document.all && !wnd.opera;
	jg_moz = jg_dom && typeof x.style.MozOpacity != "undefined";
	jg_ok = !!(jg_ie || jg_dom);
}

function _pntCnvDom()
{
	var x = this.wnd.document.createRange();
	x.setStartBefore(this.cnv);
	x = x.createContextualFragment(jg_fast? this._htmRpc() : this.htm);
	if(this.cnv) this.cnv.appendChild(x);
	this.htm = "";
}

function _pntCnvIe()
{
	if(this.cnv) this.cnv.insertAdjacentHTML("BeforeEnd", jg_fast? this._htmRpc() : this.htm);
	this.htm = "";
}

function _pntDoc()
{
	this.wnd.document.write(jg_fast? this._htmRpc() : this.htm);
	this.htm = '';
}

function _pntN()
{
	;
}

function _mkDiv(x, y, w, h)
{
	this.htm += '<div style="position:absolute;'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:' + w + 'px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';
}

function _mkDivIe(x, y, w, h)
{
	this.htm += '%%'+this.color+';'+x+';'+y+';'+w+';'+h+';';
}

function _mkDivPrt(x, y, w, h)
{
	this.htm += '<div style="position:absolute;'+
		'border-left:' + w + 'px solid ' + this.color + ';'+
		'left:' + x + 'px;'+
		'top:' + y + 'px;'+
		'width:0px;'+
		'height:' + h + 'px;'+
		'clip:rect(0,'+w+'px,'+h+'px,0);'+
		'background-color:' + this.color +
		(!jg_moz? ';overflow:hidden' : '')+
		';"><\/div>';
}

var _regex =  /%%([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);/g;
function _htmRpc()
{
	return this.htm.replace(
		_regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2px;top:$3px;width:$4px;height:$5px"></div>\n');
}

function _htmPrtRpc()
{
	return this.htm.replace(
		_regex,
		'<div style="overflow:hidden;position:absolute;background-color:'+
		'$1;left:$2px;top:$3px;width:$4px;height:$5px;border-left:$4px solid $1"></div>\n');
}

function _mkLin(x1, y1, x2, y2)
{
	if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while(dx > 0)
		{--dx;
			++x;
			if(p > 0)
			{
				this._mkDiv(ox, y, x-ox, 1);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this._mkDiv(ox, y, x2-ox+1, 1);
	}

	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if(y2 <= y1)
		{
			while(dy > 0)
			{--dy;
				if(p > 0)
				{
					this._mkDiv(x++, y, 1, oy-y+1);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this._mkDiv(x2, y2, 1, oy-y2+1);
		}
		else
		{
			while(dy > 0)
			{--dy;
				y += yIncr;
				if(p > 0)
				{
					this._mkDiv(x++, oy, 1, y-oy);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this._mkDiv(x2, oy, 1, y2-oy+1);
		}
	}
}

function _mkLin2D(x1, y1, x2, y2)
{
	if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1;

	var s = this.stroke;
	if(dx >= dy)
	{
		if(dx > 0 && s-3 > 0)
		{
			var _s = (s*dx*Math.sqrt(1+dy*dy/(dx*dx))-dx-(s>>1)*dy) / dx;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.ceil(s/2);

		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx,
		ox = x;
		while(dx > 0)
		{--dx;
			++x;
			if(p > 0)
			{
				this._mkDiv(ox, y, x-ox+ad, _s);
				y += yIncr;
				p += pru;
				ox = x;
			}
			else p += pr;
		}
		this._mkDiv(ox, y, x2-ox+ad+1, _s);
	}

	else
	{
		if(s-3 > 0)
		{
			var _s = (s*dy*Math.sqrt(1+dx*dx/(dy*dy))-(s>>1)*dx-dy) / dy;
			_s = (!(s-4)? Math.ceil(_s) : Math.round(_s)) + 1;
		}
		else var _s = s;
		var ad = Math.round(s/2);

		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy,
		oy = y;
		if(y2 <= y1)
		{
			++ad;
			while(dy > 0)
			{--dy;
				if(p > 0)
				{
					this._mkDiv(x++, y, _s, oy-y+ad);
					y += yIncr;
					p += pru;
					oy = y;
				}
				else
				{
					y += yIncr;
					p += pr;
				}
			}
			this._mkDiv(x2, y2, _s, oy-y2+ad);
		}
		else
		{
			while(dy > 0)
			{--dy;
				y += yIncr;
				if(p > 0)
				{
					this._mkDiv(x++, oy, _s, y-oy+ad);
					p += pru;
					oy = y;
				}
				else p += pr;
			}
			this._mkDiv(x2, oy, _s, y2-oy+ad+1);
		}
	}
}

function _mkLinDott(x1, y1, x2, y2)
{
	if(x1 > x2)
	{
		var _x2 = x2;
		var _y2 = y2;
		x2 = x1;
		y2 = y1;
		x1 = _x2;
		y1 = _y2;
	}
	var dx = x2-x1, dy = Math.abs(y2-y1),
	x = x1, y = y1,
	yIncr = (y1 > y2)? -1 : 1,
	drw = true;
	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1),
		p = pr-dx;
		while(dx > 0)
		{--dx;
			if(drw) this._mkDiv(x, y, 1, 1);
			drw = !drw;
			if(p > 0)
			{
				y += yIncr;
				p += pru;
			}
			else p += pr;
			++x;
		}
	}
	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1),
		p = pr-dy;
		while(dy > 0)
		{--dy;
			if(drw) this._mkDiv(x, y, 1, 1);
			drw = !drw;
			y += yIncr;
			if(p > 0)
			{
				++x;
				p += pru;
			}
			else p += pr;
		}
	}
	if(drw) this._mkDiv(x, y, 1, 1);
}

function _mkOv(left, top, width, height)
{
	var a = (++width)>>1, b = (++height)>>1,
	wod = width&1, hod = height&1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	ox = 0, oy = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1),
	w, h;
	while(y > 0)
	{
		if(st < 0)
		{
			st += bb2*((x<<1)+3);
			tt += bb4*(++x);
		}
		else if(tt < 0)
		{
			st += bb2*((x<<1)+3) - aa4*(y-1);
			tt += bb4*(++x) - aa2*(((y--)<<1)-3);
			w = x-ox;
			h = oy-y;
			if((w&2) && (h&2))
			{
				this._mkOvQds(cx, cy, x-2, y+2, 1, 1, wod, hod);
				this._mkOvQds(cx, cy, x-1, y+1, 1, 1, wod, hod);
			}
			else this._mkOvQds(cx, cy, x-1, oy, w, h, wod, hod);
			ox = x;
			oy = y;
		}
		else
		{
			tt -= aa2*((y<<1)-3);
			st -= aa4*(--y);
		}
	}
	w = a-ox+1;
	h = (oy<<1)+hod;
	y = cy-oy;
	this._mkDiv(cx-a, y, w, h);
	this._mkDiv(cx+ox+wod-1, y, w, h);
}

function _mkOv2D(left, top, width, height)
{
	var s = this.stroke;
	width += s+1;
	height += s+1;
	var a = width>>1, b = height>>1,
	wod = width&1, hod = height&1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1);

	if(s-4 < 0 && (!(s-2) || width-51 > 0 && height-51 > 0))
	{
		var ox = 0, oy = b,
		w, h,
		pxw;
		while(y > 0)
		{
			if(st < 0)
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				w = x-ox;
				h = oy-y;

				if(w-1)
				{
					pxw = w+1+(s&1);
					h = s;
				}
				else if(h-1)
				{
					pxw = s;
					h += 1+(s&1);
				}
				else pxw = h = s;
				this._mkOvQds(cx, cy, x-1, oy, pxw, h, wod, hod);
				ox = x;
				oy = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}
		}
		this._mkDiv(cx-a, cy-oy, s, (oy<<1)+hod);
		this._mkDiv(cx+a+wod-s, cy-oy, s, (oy<<1)+hod);
	}

	else
	{
		var _a = (width-(s<<1))>>1,
		_b = (height-(s<<1))>>1,
		_x = 0, _y = _b,
		_aa2 = (_a*_a)<<1, _aa4 = _aa2<<1, _bb2 = (_b*_b)<<1, _bb4 = _bb2<<1,
		_st = (_aa2>>1)*(1-(_b<<1)) + _bb2,
		_tt = (_bb2>>1) - _aa2*((_b<<1)-1),

		pxl = new Array(),
		pxt = new Array(),
		_pxb = new Array();
		pxl[0] = 0;
		pxt[0] = b;
		_pxb[0] = _b-1;
		while(y > 0)
		{
			if(st < 0)
			{
				pxl[pxl.length] = x;
				pxt[pxt.length] = y;
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				pxl[pxl.length] = x;
				st += bb2*((x<<1)+3) - aa4*(y-1);
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				pxt[pxt.length] = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}

			if(_y > 0)
			{
				if(_st < 0)
				{
					_st += _bb2*((_x<<1)+3);
					_tt += _bb4*(++_x);
					_pxb[_pxb.length] = _y-1;
				}
				else if(_tt < 0)
				{
					_st += _bb2*((_x<<1)+3) - _aa4*(_y-1);
					_tt += _bb4*(++_x) - _aa2*(((_y--)<<1)-3);
					_pxb[_pxb.length] = _y-1;
				}
				else
				{
					_tt -= _aa2*((_y<<1)-3);
					_st -= _aa4*(--_y);
					_pxb[_pxb.length-1]--;
				}
			}
		}

		var ox = -wod, oy = b,
		_oy = _pxb[0],
		l = pxl.length,
		w, h;
		for(var i = 0; i < l; i++)
		{
			if(typeof _pxb[i] != "undefined")
			{
				if(_pxb[i] < _oy || pxt[i] < oy)
				{
					x = pxl[i];
					this._mkOvQds(cx, cy, x, oy, x-ox, oy-_oy, wod, hod);
					ox = x;
					oy = pxt[i];
					_oy = _pxb[i];
				}
			}
			else
			{
				x = pxl[i];
				this._mkDiv(cx-x, cy-oy, 1, (oy<<1)+hod);
				this._mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
				ox = x;
				oy = pxt[i];
			}
		}
		this._mkDiv(cx-a, cy-oy, 1, (oy<<1)+hod);
		this._mkDiv(cx+ox+wod, cy-oy, 1, (oy<<1)+hod);
	}
}

function _mkOvDott(left, top, width, height)
{
	var a = (++width)>>1, b = (++height)>>1,
	wod = width&1, hod = height&1, hodu = hod^1,
	cx = left+a, cy = top+b,
	x = 0, y = b,
	aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
	st = (aa2>>1)*(1-(b<<1)) + bb2,
	tt = (bb2>>1) - aa2*((b<<1)-1),
	drw = true;
	while(y > 0)
	{
		if(st < 0)
		{
			st += bb2*((x<<1)+3);
			tt += bb4*(++x);
		}
		else if(tt < 0)
		{
			st += bb2*((x<<1)+3) - aa4*(y-1);
			tt += bb4*(++x) - aa2*(((y--)<<1)-3);
		}
		else
		{
			tt -= aa2*((y<<1)-3);
			st -= aa4*(--y);
		}
		if(drw && y >= hodu) this._mkOvQds(cx, cy, x, y, 1, 1, wod, hod);
		drw = !drw;
	}
}

function _mkRect(x, y, w, h)
{
	var s = this.stroke;
	this._mkDiv(x, y, w, s);
	this._mkDiv(x+w, y, s, h);
	this._mkDiv(x, y+h, w+s, s);
	this._mkDiv(x, y+s, s, h-s);
}

function _mkRectDott(x, y, w, h)
{
	this.drawLine(x, y, x+w, y);
	this.drawLine(x+w, y, x+w, y+h);
	this.drawLine(x, y+h, x+w, y+h);
	this.drawLine(x, y, x, y+h);
}

function jsgFont()
{
	this.PLAIN = 'font-weight:normal;';
	this.BOLD = 'font-weight:bold;';
	this.ITALIC = 'font-style:italic;';
	this.ITALIC_BOLD = this.ITALIC + this.BOLD;
	this.BOLD_ITALIC = this.ITALIC_BOLD;
}
var Font = new jsgFont();

function jsgStroke()
{
	this.DOTTED = -1;
}
var Stroke = new jsgStroke();

function jsGraphics(cnv, wnd)
{
	this.setColor = function(x)
	{
		this.color = x.toLowerCase();
	};

	this.setStroke = function(x)
	{
		this.stroke = x;
		if(!(x+1))
		{
			this.drawLine = _mkLinDott;
			this._mkOv = _mkOvDott;
			this.drawRect = _mkRectDott;
		}
		else if(x-1 > 0)
		{
			this.drawLine = _mkLin2D;
			this._mkOv = _mkOv2D;
			this.drawRect = _mkRect;
		}
		else
		{
			this.drawLine = _mkLin;
			this._mkOv = _mkOv;
			this.drawRect = _mkRect;
		}
	};

	this.setPrintable = function(arg)
	{
		this.printable = arg;
		if(jg_fast)
		{
			this._mkDiv = _mkDivIe;
			this._htmRpc = arg? _htmPrtRpc : _htmRpc;
		}
		else this._mkDiv = arg? _mkDivPrt : _mkDiv;
	};

	this.setFont = function(fam, sz, sty)
	{
		this.ftFam = fam;
		this.ftSz = sz;
		this.ftSty = sty || Font.PLAIN;
	};

	this.drawPolyline = this.drawPolyLine = function(x, y)
	{
		for (var i=x.length - 1; i;)
		{--i;
			this.drawLine(x[i], y[i], x[i+1], y[i+1]);
		}
	};

	this.fillRect = function(x, y, w, h)
	{
		this._mkDiv(x, y, w, h);
	};

	this.drawPolygon = function(x, y)
	{
		this.drawPolyline(x, y);
		this.drawLine(x[x.length-1], y[x.length-1], x[0], y[0]);
	};

	this.drawEllipse = this.drawOval = function(x, y, w, h)
	{
		this._mkOv(x, y, w, h);
	};

	this.fillEllipse = this.fillOval = function(left, top, w, h)
	{
		var a = w>>1, b = h>>1,
		wod = w&1, hod = h&1,
		cx = left+a, cy = top+b,
		x = 0, y = b, oy = b,
		aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
		st = (aa2>>1)*(1-(b<<1)) + bb2,
		tt = (bb2>>1) - aa2*((b<<1)-1),
		xl, dw, dh;
		if(w) while(y > 0)
		{
			if(st < 0)
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0)
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				xl = cx-x;
				dw = (x<<1)+wod;
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				dh = oy-y;
				this._mkDiv(xl, cy-oy, dw, dh);
				this._mkDiv(xl, cy+y+hod, dw, dh);
				oy = y;
			}
			else
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
			}
		}
		this._mkDiv(cx-a, cy-oy, w, (oy<<1)+hod);
	};

	this.fillArc = function(iL, iT, iW, iH, fAngA, fAngZ)
	{
		var a = iW>>1, b = iH>>1,
		iOdds = (iW&1) | ((iH&1) << 16),
		cx = iL+a, cy = iT+b,
		x = 0, y = b, ox = x, oy = y,
		aa2 = (a*a)<<1, aa4 = aa2<<1, bb2 = (b*b)<<1, bb4 = bb2<<1,
		st = (aa2>>1)*(1-(b<<1)) + bb2,
		tt = (bb2>>1) - aa2*((b<<1)-1),
		// Vars for radial boundary lines
		xEndA, yEndA, xEndZ, yEndZ,
		iSects = (1 << (Math.floor((fAngA %= 360.0)/180.0) << 3))
				| (2 << (Math.floor((fAngZ %= 360.0)/180.0) << 3))
				| ((fAngA >= fAngZ) << 16),
		aBndA = new Array(b+1), aBndZ = new Array(b+1);
		
		// Set up radial boundary lines
		fAngA *= Math.PI/180.0;
		fAngZ *= Math.PI/180.0;
		xEndA = cx+Math.round(a*Math.cos(fAngA));
		yEndA = cy+Math.round(-b*Math.sin(fAngA));
		_mkLinVirt(aBndA, cx, cy, xEndA, yEndA);
		xEndZ = cx+Math.round(a*Math.cos(fAngZ));
		yEndZ = cy+Math.round(-b*Math.sin(fAngZ));
		_mkLinVirt(aBndZ, cx, cy, xEndZ, yEndZ);

		while(y > 0)
		{
			if(st < 0) // Advance x
			{
				st += bb2*((x<<1)+3);
				tt += bb4*(++x);
			}
			else if(tt < 0) // Advance x and y
			{
				st += bb2*((x<<1)+3) - aa4*(y-1);
				ox = x;
				tt += bb4*(++x) - aa2*(((y--)<<1)-3);
				this._mkArcDiv(ox, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
				oy = y;
			}
			else // Advance y
			{
				tt -= aa2*((y<<1)-3);
				st -= aa4*(--y);
				if(y && (aBndA[y] != aBndA[y-1] || aBndZ[y] != aBndZ[y-1]))
				{
					this._mkArcDiv(x, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
					ox = x;
					oy = y;
				}
			}
		}
		this._mkArcDiv(x, 0, oy, cx, cy, iOdds, aBndA, aBndZ, iSects);
		if(iOdds >> 16) // Odd height
		{
			if(iSects >> 16) // Start-angle > end-angle
			{
				var xl = (yEndA <= cy || yEndZ > cy)? (cx - x) : cx;
				this._mkDiv(xl, cy, x + cx - xl + (iOdds & 0xffff), 1);
			}
			else if((iSects & 0x01) && yEndZ > cy)
				this._mkDiv(cx - x, cy, x, 1);
		}
	};

/* fillPolygon method, implemented by Matthieu Haller.
This javascript function is an adaptation of the gdImageFilledPolygon for Walter Zorn lib.
C source of GD 1.8.4 found at http://www.boutell.com/gd/

THANKS to Kirsten Schulz for the polygon fixes!

The intersection finding technique of this code could be improved
by remembering the previous intertersection, and by using the slope.
That could help to adjust intersections to produce a nice
interior_extrema. */
	this.fillPolygon = function(array_x, array_y)
	{
		var i;
		var y;
		var miny, maxy;
		var x1, y1;
		var x2, y2;
		var ind1, ind2;
		var ints;

		var n = array_x.length;
		if(!n) return;

		miny = array_y[0];
		maxy = array_y[0];
		for(i = 1; i < n; i++)
		{
			if(array_y[i] < miny)
				miny = array_y[i];

			if(array_y[i] > maxy)
				maxy = array_y[i];
		}
		for(y = miny; y <= maxy; y++)
		{
			var polyInts = new Array();
			ints = 0;
			for(i = 0; i < n; i++)
			{
				if(!i)
				{
					ind1 = n-1;
					ind2 = 0;
				}
				else
				{
					ind1 = i-1;
					ind2 = i;
				}
				y1 = array_y[ind1];
				y2 = array_y[ind2];
				if(y1 < y2)
				{
					x1 = array_x[ind1];
					x2 = array_x[ind2];
				}
				else if(y1 > y2)
				{
					y2 = array_y[ind1];
					y1 = array_y[ind2];
					x2 = array_x[ind1];
					x1 = array_x[ind2];
				}
				else continue;

				 //  Modified 11. 2. 2004 Walter Zorn
				if((y >= y1) && (y < y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);

				else if((y == maxy) && (y > y1) && (y <= y2))
					polyInts[ints++] = Math.round((y-y1) * (x2-x1) / (y2-y1) + x1);
			}
			polyInts.sort(_CompInt);
			for(i = 0; i < ints; i+=2)
				this._mkDiv(polyInts[i], y, polyInts[i+1]-polyInts[i]+1, 1);
		}
	};

	this.drawString = function(txt, x, y)
	{
		this.htm += '<div style="position:absolute;white-space:nowrap;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt +
			'<\/div>';
	};

/* drawStringRect() added by Rick Blommers.
Allows to specify the size of the text rectangle and to align the
text both horizontally (e.g. right) and vertically within that rectangle */
	this.drawStringRect = function(txt, x, y, width, halign)
	{
		this.htm += '<div style="position:absolute;overflow:hidden;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			'width:'+width +'px;'+
			'text-align:'+halign+';'+
			'font-family:' +  this.ftFam + ';'+
			'font-size:' + this.ftSz + ';'+
			'color:' + this.color + ';' + this.ftSty + '">'+
			txt +
			'<\/div>';
	};

	this.drawImage = function(imgSrc, x, y, w, h, a)
	{
		this.htm += '<div style="position:absolute;'+
			'left:' + x + 'px;'+
			'top:' + y + 'px;'+
			// w (width) and h (height) arguments are now optional.
			// Added by Mahmut Keygubatli, 14.1.2008
			(w? ('width:' +  w + 'px;') : '') +
			(h? ('height:' + h + 'px;'):'')+'">'+
			'<img src="' + imgSrc +'"'+ (w ? (' width="' + w + '"'):'')+ (h ? (' height="' + h + '"'):'') + (a? (' '+a) : '') + '>'+
			'<\/div>';
	};

	this.clear = function()
	{
		this.htm = "";
		if(this.cnv) this.cnv.innerHTML = "";
	};

	this._mkOvQds = function(cx, cy, x, y, w, h, wod, hod)
	{
		var xl = cx - x, xr = cx + x + wod - w, yt = cy - y, yb = cy + y + hod - h;
		if(xr > xl+w)
		{
			this._mkDiv(xr, yt, w, h);
			this._mkDiv(xr, yb, w, h);
		}
		else
			w = xr - xl + w;
		this._mkDiv(xl, yt, w, h);
		this._mkDiv(xl, yb, w, h);
	};
	
	this._mkArcDiv = function(x, y, oy, cx, cy, iOdds, aBndA, aBndZ, iSects)
	{
		var xrDef = cx + x + (iOdds & 0xffff), y2, h = oy - y, xl, xr, w;

		if(!h) h = 1;
		x = cx - x;

		if(iSects & 0xff0000) // Start-angle > end-angle
		{
			y2 = cy - y - h;
			if(iSects & 0x00ff)
			{
				if(iSects & 0x02)
				{
					xl = Math.max(x, aBndZ[y]);
					w = xrDef - xl;
					if(w > 0) this._mkDiv(xl, y2, w, h);
				}
				if(iSects & 0x01)
				{
					xr = Math.min(xrDef, aBndA[y]);
					w = xr - x;
					if(w > 0) this._mkDiv(x, y2, w, h);
				}
			}
			else
				this._mkDiv(x, y2, xrDef - x, h);
			y2 = cy + y + (iOdds >> 16);
			if(iSects & 0xff00)
			{
				if(iSects & 0x0100)
				{
					xl = Math.max(x, aBndA[y]);
					w = xrDef - xl;
					if(w > 0) this._mkDiv(xl, y2, w, h);
				}
				if(iSects & 0x0200)
				{
					xr = Math.min(xrDef, aBndZ[y]);
					w = xr - x;
					if(w > 0) this._mkDiv(x, y2, w, h);
				}
			}
			else
				this._mkDiv(x, y2, xrDef - x, h);
		}
		else
		{
			if(iSects & 0x00ff)
			{
				if(iSects & 0x02)
					xl = Math.max(x, aBndZ[y]);
				else
					xl = x;
				if(iSects & 0x01)
					xr = Math.min(xrDef, aBndA[y]);
				else
					xr = xrDef;
				y2 = cy - y - h;
				w = xr - xl;
				if(w > 0) this._mkDiv(xl, y2, w, h);
			}
			if(iSects & 0xff00)
			{
				if(iSects & 0x0100)
					xl = Math.max(x, aBndA[y]);
				else
					xl = x;
				if(iSects & 0x0200)
					xr = Math.min(xrDef, aBndZ[y]);
				else
					xr = xrDef;
				y2 = cy + y + (iOdds >> 16);
				w = xr - xl;
				if(w > 0) this._mkDiv(xl, y2, w, h);
			}
		}
	};

	this.setStroke(1);
	this.setFont("verdana,geneva,helvetica,sans-serif", "12px", Font.PLAIN);
	this.color = "#000000";
	this.htm = "";
	this.wnd = wnd || window;

	if(!jg_ok) _chkDHTM(this.wnd);
	if(jg_ok)
	{
		if(cnv)
		{
			if(typeof(cnv) == "string")
				this.cont = document.all? (this.wnd.document.all[cnv] || null)
					: document.getElementById? (this.wnd.document.getElementById(cnv) || null)
					: null;
			else if(cnv == window.document)
				this.cont = document.getElementsByTagName("body")[0];
			// If cnv is a direct reference to a canvas DOM node
			// (option suggested by Andreas Luleich)
			else this.cont = cnv;
			// Create new canvas inside container DIV. Thus the drawing and clearing
			// methods won't interfere with the container's inner html.
			// Solution suggested by Vladimir.
			this.cnv = this.wnd.document.createElement("div");
			this.cnv.style.fontSize=0;
			this.cont.appendChild(this.cnv);
			this.paint = jg_dom? _pntCnvDom : _pntCnvIe;
		}
		else
			this.paint = _pntDoc;
	}
	else
		this.paint = _pntN;

	this.setPrintable(false);
}

function _mkLinVirt(aLin, x1, y1, x2, y2)
{
	var dx = Math.abs(x2-x1), dy = Math.abs(y2-y1),
	x = x1, y = y1,
	xIncr = (x1 > x2)? -1 : 1,
	yIncr = (y1 > y2)? -1 : 1,
	p,
	i = 0;
	if(dx >= dy)
	{
		var pr = dy<<1,
		pru = pr - (dx<<1);
		p = pr-dx;
		while(dx > 0)
		{--dx;
			if(p > 0)    //  Increment y
			{
				aLin[i++] = x;
				y += yIncr;
				p += pru;
			}
			else p += pr;
			x += xIncr;
		}
	}
	else
	{
		var pr = dx<<1,
		pru = pr - (dy<<1);
		p = pr-dy;
		while(dy > 0)
		{--dy;
			y += yIncr;
			aLin[i++] = x;
			if(p > 0)    //  Increment x
			{
				x += xIncr;
				p += pru;
			}
			else p += pr;
		}
	}
	for(var len = aLin.length, i = len-i; i;)
		aLin[len-(i--)] = x;
};

function _CompInt(x, y)
{
	return(x - y);
}

/*
 * Usage
 * var stockService=new StockService();
 * stockService.onQuoteReceived = function(quote) { ...doSomething... }
 */

function StockService()
{
}

StockService.prototype.onmessage = function(headers, body)
{
  var destination = headers.destination;
  if (destination.indexOf("/topic/PRICE") == 0)
  {
    // Extract stock data fields
    // e.g. MSFT:25.28:.43:22.38:27.33:24.85
    var fields = body.split(':');
    this.onQuoteReceived({
      ticker: fields[0],
      price:  fields[1],
      change: fields[2],
      low:    fields[3],
      high:   fields[4],
      open:   fields[5]
    });
  }
  else if (destination == "/topic/stockExchange")
  {
    // Extract the stock data fields
    // e.g. MSFT|24.50
    var fields = body.split('|');
    this.onQuoteReceived({
      ticker: fields[0],
      price:  fields[1]
    });
  }
}
/*
 * Usage
 * var currencyService=new CurrencyService();
 * currencyService.onQuoteReceived = function(quote) { ...doSomething... }
 */

function CurrencyService()
{
    this.quotes = {};

    this.quotes["GBP/USD"] = {
        name:"GBP/USD",
        BBig:"1.49",BMed:"88",BSmall:"5",BVal:1.49885,
        SBig:"1.49",SMed:"93",SSmall:"0",SVal:1.49930,
        Diff:"4.5",Time:""
    };

    this.quotes["EUR/USD"] = {
        name:"EUR/USD",
        BBig:"1.82",BMed:"30",BSmall:"0",BVal:1.82300,
        SBig:"1.82",SMed:"40",SSmall:"0",SVal:1.82400,
        Diff:"10.0",Time:""
    };
}

CurrencyService.prototype.getQuote = function(name)
{
    return this.quotes[name];
}

CurrencyService.prototype.onmessage = function(headers, body)
{
    // extract the data fields
    var fields = body.split('|');
    var exchange = fields[0];
    var sellQuote = fields[1];
    var buyQuote = fields[2];

    var quote = this.getQuote(exchange);

    if (sellQuote === '-') {
        quote.BVal = parseFloat(buyQuote);
        quote.BBig = buyQuote.substr(0,4);
        quote.BMed = buyQuote.substr(4,2);
        quote.BSmall = buyQuote.substr(6,1);
    } else if (buyQuote === '-') {
        quote.SVal = parseFloat(sellQuote);
        quote.SBig = sellQuote.substr(0,4);
        quote.SMed = sellQuote.substr(4,2);
        quote.SSmall = sellQuote.substr(6,1);
    }

    var diff = Math.floor((quote.BVal - quote.SVal)*100000+.5)+"";
    quote.Diff = diff.substr(0,diff-1)+"."+diff.substr(diff.length-1);
    if (quote.Diff.length == 2)
        quote.Diff = "0"+quote.Diff;

    quote.Time = Common.getFormattedTime();

    this.onQuoteReceived(quote);
}
/*
 * Usage
 * var service=new TwitterService();
 * service.onTweetReceived = function(tweet) { ...doSomething... }
 */

function TwitterService()
{
}

TwitterService.prototype.onmessage = function(headers, body)
{
  /* By default, ignore headers, callback with body */
  var fields = body.split('|');
  this.onTweetReceived({
    user:   fields[0],
    status: fields[1]
  });
}
/*
 * Usage
 * var service=new NewsService();
 * service.onArticleReceived = function(article) { ...doSomething... }
 *
 * E.g. article = {story: 
 *                  {source: "The New York Times", 
 *                   updated: "2009-11-12 22:21:04"
 *                   byline: "By BRUCE WEBER",
 *                   newsUrl: "http://www.nytimes.com/2009/11/13/arts/television/13lloyd.html",
 *                   headline: "David Lloyd, 75, Dies; Wrote &#8216;Chuckles&#8217; Episode",
 *                   media: "",
 *                   section: "Arts",
 *                   summary: "Mr. Lloyd wrote scores of scripts for some of the most\
 *                             popular television sitcoms of the 1970s, 80's and 90's."
 *                  }
 *                }
 */

function NewsService()
{
}


NewsService.prototype.onmessage = function(headers, body)
{
  var article;
  eval("article = "+body);
  this.onArticleReceived(article);
}
/*
 * Usage
 * var service=new AccessService();
 * service.onEntryReceived = function(entry) { ...doSomething... }
 *
 * E.g. entry = {log:"Log message",country:countryCode}
 */

function AccessService()
{
}


AccessService.prototype.onmessage = function(headers, body)
{
    var access;
    eval("access = "+body+";");

    var cc=access.log.country.toLowerCase();

    var logEntry = "";
    if (access.log.org) {
       logEntry = access.log.org + " from ";
    }
    else {
       logEntry = 'Anonymous from ';
    }
    if (access.log.city) {
        logEntry = logEntry + access.log.city + ', ';
    }
    if (access.log.region == '(null)' ) {
        access.log.region = 'an iPhone'; // hacked for Jonas
    }
    if (access.log.country && access.log.country.toUpperCase() == "US" &&
        access.log.region) {
        logEntry = logEntry + access.log.region + ', ';
    }
    if (access.log.country) {
        var countryName = countryNames[access.log.country.toUpperCase()];
        logEntry = logEntry + countryName + ' is ';
    }

    var actionLookup = { '/blog' : 'reading Kaazing blogs',
                         '/support' : 'reading Kaazing support info',
                         '/industries' : 'reading case studies from Kaazing',
                         '/products' : 'reading Kaazing product info',
                         '/contact' : 'reading Kaazing contact info',
                         '/forums' : 'accessing Kaazing forums',
                         'demo' : 'executing Kaazing demos',
                         '/company' : 'reading company information',
                         '/download' : 'downloading Kaazing products'
    };

    function getAction(msg) {
        var action = 'visiting Kaazing.com';
        for (var key in actionLookup) { 
            if (msg.indexOf(key) > 0) {
                return actionLookup[key];
            }
        }
        return action;
    }

    logEntry = logEntry + ' ' + getAction(msg);

    this.onEntryReceived({log:logEntry,countryCode:cc});
}
/*
 * Usage
 * var service=new BaseService();
 * service.onMessageReceived = function(msg) { ...doSomething... }
 */

function BaseService()
{
}

BaseService.prototype.onmessage = function(headers, body)
{
  /* By default, ignore headers, callback with body */
  this.onMessageReceived(body);
}
function Panel(elt, title)
{
    this.elt=elt;

    Common.setClass(elt, "panel");

    var id=elt.getAttribute("id");

    var header=document.createElement("div");
    Common.setClass(header, "panelHeader");

    if (id)
        header.setAttribute("id", id+"Header"); // hack to allow IE6 to find the elt by id

    elt.appendChild(header);

    header.innerHTML = '<a href="#" class="tab">'+
                       '<img src="/assets/Image/tabs-left.png">'+
                       '<span class="panelTitle">'+Common.escapeHTML(title)+'</span></a>'+
                       '<img src="/assets/Image/tabs-right-3.gif">';

    this.header=header;

    var body=document.createElement("div");
    Common.setClass(body, "panelBody");

    if (id)
        body.setAttribute("id", id+"Body"); // hack to allow IE6 to find the elt by id

    elt.appendChild(body);
    this.body=body;

    var panel = this;  // required for closure
    elt.onmouseover = function (ev) {
        var target = Common.getEventTarget(ev);
        if (panel.handleMouseOver) {
            return panel.handleMouseOver(ev);
        }
    };

    elt.onmouseout = function (ev) {
        var target = Common.getEventTarget(ev);
        if (elt == target || !Common.domContains(elt, target)) {
            if (panel.handleMouseOut) {
                return panel.handleMouseOut(ev);
            }
        }
    };
}

Panel.prototype.getElement = function() { return this.elt; }
Panel.prototype.getHeaderElement = function() { return this.header; }
Panel.prototype.getBodyElement = function() { return this.body; }
function FloatingPanel(elt, title)
{
    this.elt = elt;
    if (Common.isIE(6))
        elt.style.position="absolute";

    this.numframes = (Common.isIE(6)||Common.isIE(7)) ? 2 : 12;

    var header=document.createElement("div");
    Common.setClass(header, "floatingPanelHeader");

    elt.appendChild(header);
    this.header=header;
    this.setTitle(title);

    var body=document.createElement("div");
    Common.setClass(body, "floatingPanelBody");

    elt.appendChild(body);
    this.body=body;

    var floatingPanel = this;  // required for closure
    header.onclick = function (ev) { floatingPanel.handleClick(ev); };
}

FloatingPanel.zIndex = 1000;
FloatingPanel.prototype.getHeaderElement = function() { return this.header; }
FloatingPanel.prototype.getBodyElement = function() { return this.body; }

FloatingPanel.prototype.setTitle = function(title) {
    this.header.innerHTML = '<img class="floatingPanelTopLeft" src="/assets/Image/window-top-left-corner.png">'+
                            '<span class="floatingPanelBackground">'+
                            '<span class="floatingPanelTitle">'+
                            Common.escapeHTML(title)+
                            '</span>'+
                            '<img class="floatingPanelClose" src="/assets/Image/close.png">'+
                            '</span>'+
                            '<img class="floatingPanelTopRight" '+
                              'src="/assets/Image/window-top-right-corner.png">';
}

FloatingPanel.prototype.show = function() {
    Common.setOpacity(this.elt, 1);
    this.elt.style.visibility = "visible";
    this.elt.style.zIndex = FloatingPanel.zIndex++;
    this.elt.style.display = "block";
}

FloatingPanel.prototype.hide = function() {
    this.frame=0;
    this.animateClosing();
}

FloatingPanel.prototype.animateClosing = function()
{
    this.frame++;

    if (this.frame < this.numframes) {
        Common.setOpacity(this.elt, 1-this.frame/this.numframes);

        var panel=this; // required for closure
        setTimeout(function () {
            panel.animateClosing();
        }, 50);
    }
    else {
        this.elt.style.display = "none";
    }
}

FloatingPanel.prototype.handleClick = function (ev) {
    var target = Common.getEventTarget(ev);
    if (target.getAttribute("class") == "floatingPanelClose")
        this.hide();
    else
        this.show();
}
function HoverPanel(top, left) {
    var elt=document.createElement("div");
    elt.setAttribute("class", "hoverPanel floatingPanel");

    elt.style.position = "fixed";
    elt.style.left = left+"px";
    elt.style.top = top+"px";
    this.elt = elt;

    document.body.appendChild(elt);

    var panel = new FloatingPanel(elt, "HOVER");
    this.panel = panel;

    var bodyElt=panel.getBodyElement();

    var textElt = document.createElement("div");
    Common.setClass(textElt, "hoverText");
    textElt.innerHTML = "";
    bodyElt.appendChild(textElt);
    this.textElt = textElt;

    var hoverPanel = this;  // required for closure
    elt.onmouseout = function (ev) { hoverPanel.handleMouseOut(ev); return true; };
}

HoverPanel.prototype.show = function(title, text, left, top) {
    this.panel.setTitle(title);

    this.elt.style.left = left+"px";
    this.elt.style.top = top+"px";

    var height = Common.domGetHeight(this.panel.getHeaderElement()) +
                 Common.domGetHeight(this.panel.getBodyElement());
    this.elt.style.height = height+"px";

    this.textElt.innerHTML = text;
    this.textElt.scrollTop = this.textElt.scrollHeight;
    this.panel.show();
    this.elt.style.zIndex = this.panel.elt.style.zIndex;
}

HoverPanel.prototype.hide = function() {
    this.panel.hide();
}

HoverPanel.prototype.handleKeyDown = function (ev) {
}

HoverPanel.prototype.handleClick = function (ev) {
}

HoverPanel.prototype.handleMouseOut = function (ev) {
}
/*
 * Requires script graph.js
 */

function MonitorPanel(elt)
{
    var panel=new Panel(elt, "Monitor");
    this.panel = panel;

    var vals = [.1, .1, .1, .1, .1];
    this.graph = new Graph(vals);

    var bodyElt = panel.getBodyElement();

    var graphElt = this.graph.getElement();
    graphElt.style.width = "230px";
    graphElt.style.backgroundColor = "transparent";
    bodyElt.appendChild(graphElt);

    var div = document.createElement("div");
    div.innerHTML = '<span class="title">Monitor for Data Center</span><br>'+
                    'Higher bar = larger ratio<br>'+
                    'Left-to-right displays<br>'+
                    '<b>cpu:</b> % of CPU utilized<br>'+
                    '<b>memory:</b> % of memory used<br>'+
                    '<b>network:</b> % network saturation<br>'+
                    '<b>hdd:</b> % disk in use<br>'+
                    '<b>temperature:</b> % of max allowed temp<br>';
    //hack for IE6
    div.style.backgroundColor = "#f6f6f6";
    div.style.zIndex = 100;
    div.style.position = "relative";
    div.style.left = "0px";
    div.style.top = "0px";

    bodyElt.appendChild(div);

    this.graph.update(vals);
}

MonitorPanel.prototype.update = function(msg)
{
    var vals = msg.split(",");
    for (var i=0; i<vals.length; i++) {
        vals[i] = Number(vals[i]);
    }
    this.graph.update(vals);
}
function CurrencyPanel(elt)
{
    var panel=new Panel(elt, "Currency Exchange");
    this.panel = panel;
    this.quoteElts={};
    this.timeElts={};
}

CurrencyPanel.prototype.addQuote = function(currencyName1, currencyName2) {
    var body = this.panel.getBodyElement();

    var quoteDiv = document.createElement("div");
    body.appendChild(quoteDiv);

    var name = currencyName1 + currencyName2;
    var title = '<b>'+currencyName1+'</b> / '+currencyName2;

    quoteDiv.innerHTML = 
        '<table class="currencyTable">'+
        '<tr><td style="white-space:nowrap" colspan="3">'+
            '<img width="115" height="7" src="/assets/Image/curr-top1.gif">'+
            '<img width="70" height="7" src="/assets/Image/curr-top2.gif">'+
            '<img width="25" height="7" src="/assets/Image/curr-top3.gif">'+
        '</td></tr>'+
        '<tr class="currencyRow">'+
            '<td class="stb1">'+title+'</td>'+
            '<td class="stb2" colspan="2" id="'+name+'Time">00:00:00</td>'+
        '</tr>'+
        '<tr class="currencyRow"><td class="zz" colspan="3">&nbsp;</td></tr>'+
        '<tr class="currencyRow">'+
            '<td class="sth">SELL</td>'+
            '<td class="sth"></td>'+
            '<td class="sth">BUY</td>'+
        '</tr>'+
        '<tr class="currencyRow" id="'+name+'Quote">'+
            '<td class="quote"></td>'+
            '<td class="diff"></td>'+
            '<td class="quote"></td>'+
        '</tr>'+
        '<tr><td style="white-space:nowrap" colspan="3">'+
            '<img width="50" height="9" src="/assets/Image/curr-end1.gif">'+
            '<img width="110" height="9" src="/assets/Image/curr-end2.gif">'+
            '<img width="50" height="9" src="/assets/Image/curr-end3.gif">'+
        '</td></tr>'+
        '</table>';

    this.quoteElts[name] = $(name+"Quote");
    this.timeElts[name] =  $(name+"Time");
}

CurrencyPanel.prototype.update = function(quote) {

    var name = quote.name.replace("/","");

    var quoteElt=this.quoteElts[name];
    if (quoteElt) {
        if (!Common.isIE())
            quoteElt.innerHTML = 
                '<td class="quote">'+
                    '<span class="sm">'+quote.SBig+'</span>'+
                    '<span class="big">'+quote.SMed+'</span>'+
                    '<span class="super">'+quote.SSmall+'</span>'+
                '</td><td class="diff">'+
                    '<span class="tiny">'+quote.Diff+'</span>'+
                '</td><td class="quote">'+
                    '<span class="sm">'+quote.BBig+'</span>'+
                    '<span class="big">'+quote.BMed+'</span>'+
                    '<span class="super">'+quote.BSmall+'</span>'+
                '</td>';
        else {
            var cells = quoteElt.cells;
            cells.item(0).innerHTML = 
                '<span class="sm">'+quote.SBig+'</span>'+
                '<span class="big">'+quote.SMed+'</span>'+
                '<span class="super">'+quote.SSmall+'</span>';

            cells.item(1).innerHTML = 
                '<span class="tiny">'+quote.Diff+'</span>';

            cells.item(2).innerHTML = 
                '<span class="sm">'+quote.BBig+'</span>'+
                '<span class="big">'+quote.BMed+'</span>'+
                '<span class="super">'+quote.BSmall+'</span>';
        }
    }

    var timeElt=this.timeElts[name];
    if (timeElt) {
        timeElt.innerHTML = quote.Time;
    }
}
/*
 * Requires script /js/wz_jsgraphics.js
 */

function MarketChartPanel(elt) {
    var panel = new Panel(elt, "Market Ticker");
    this.panel = panel;

    var bodyElt = panel.getBodyElement();
    var canvas = document.createElement("div");
    canvas.style.width="200px";
    canvas.style.height="130px";
    canvas.style.backgroundImage = "url(/assets/Image/stock_bg.png)";
    canvas.style.backgroundRepeat = "no-repeat";
    bodyElt.appendChild(canvas);

    this.graph = new jsGraphics(canvas);
    this.stockList = [];
    this.valueLists = [];
    this.table = {};
    this.colors = [];

    this.width = 199; // 200-1 to prevent drawing over the 200px bg image
    this.height = 130;
    this.offsetX = Common.domGetLeft(bodyElt)+7;
    this.centerY = Common.domGetTop(bodyElt)+this.height/2+3;
    this.range = 8; // should be +/-5% range by default
    this.lineWidth = 2;

    var tableElt = document.createElement("table");
    Common.setClass(tableElt, "stockTable");
    bodyElt.appendChild(tableElt);

    var tbodyElt = document.createElement("tbody");
    tableElt.appendChild(tbodyElt);

    this.tableElt = tbodyElt;
}

MarketChartPanel.prototype.drawLineGraph = function(which) {
    var vals = this.valueLists[which];

    var dx = this.width/(vals.length-1);

    var x1 = this.offsetX;
    var y1 = this.normalizePrice(vals[0]);

    for (var i=1; i<vals.length; i++) {
        var y = this.normalizePrice(vals[i]);

        var y2 = y;
        var x2 = dx*i + this.offsetX;

        this.graph.drawLine(x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
    }
}

MarketChartPanel.prototype.normalizePrice = function(pct) {
    return - pct * this.height / this.range / 2 + this.centerY;
}

MarketChartPanel.prototype.paintGraph = function() {
    var graph=this.graph;

    graph.clear();
    graph.setStroke(this.lineWidth);

    for (var i=0; i<this.stockList.length; i++) {
      graph.setColor(this.colors[i]);
      this.drawLineGraph(i);
    }

    graph.paint();
}

MarketChartPanel.prototype.redraw = function() {
    var stockList = this.stockList;
    var valueLists = this.valueLists;
    var table = this.table;

    for (var i=0; i<stockList.length; i++) {
        var stock = stockList[i];
        var list = valueLists[i];
        list.shift();
        list.push(table[stock].lastPct);
    }

    this.paintGraph();
}

MarketChartPanel.prototype.display = function() {
    var stockList = this.stockList;
    var table = this.table;

    for (var i=0; i<stockList.length; i++) {
        var stock = stockList[i];
        var stockEntry = table[stock];

	if (stockEntry.dirty) {
	    stockEntry.valElt.innerHTML = stockEntry.val;
	    stockEntry.changeElt.innerHTML = stockEntry.change;
	    stockEntry.percentElt.innerHTML = stockEntry.percent;
	    
	    var blinkState = stockEntry.blinkState;
	    if (blinkState == 1) {
		var elt=stockEntry.valElt;
		var delta=stockEntry.delta;
		if (delta < 0)
		    elt.style.backgroundColor = "rgb(255,0,0)";
		else
		    elt.style.backgroundColor = "rgb(0,255,0)";
		stockEntry.blinkState = 2;
	    }
	    else if (blinkState == 2) {
		var elt=stockEntry.valElt;
		elt.style.backgroundColor = "inherit";
		stockEntry.blinkState = 0;
		stockEntry.dirty=false;
	    }
	}
    }
}

MarketChartPanel.prototype.run = function() {
    this.paintGraph();

    var panel = this; // required for closure
    scheduler.addTask(function () {
        panel.display();
    }, 0);

    scheduler.addTask(function () {
        panel.redraw();
    }, 0, 3000);
}

MarketChartPanel.prototype.update = function(quote) {

    var table = this.table;
    var stock = quote.ticker;
    var price = quote.price;

    var stockEntry = table[stock];
    if (stockEntry) {
        var start = stockEntry.start;
        if (!start)
	    stockEntry.start = start = price;
	
        var last=stockEntry.lastValue;
        if (!last)
          last=price;

        var change = price-start;
        var delta = price-last;
        var pct = change/start*100;

        if (pct > 0 && pct > this.range)
          this.range = pct;
        else if (pct < 0 && -pct > this.range)
          this.range = -pct;
	
	stockEntry.dirty = true;
        stockEntry.lastPct = pct;
        stockEntry.lastValue = price;
        stockEntry.val = price;
        stockEntry.change = change.toFixed(2);
        stockEntry.percent = "("+pct.toFixed(2)+"%)";
        stockEntry.blinkState = 1;
        stockEntry.delta = delta;
    }
}

MarketChartPanel.prototype.addStock = function(symbol, color) {
    this.stockList.push(symbol);
    this.colors.push(color);

    var values = [];
    for (var j=0; j<50; j++)
        values.push(0);
    this.valueLists.push(values);

    var row = document.createElement("tr");
    this.tableElt.appendChild(row);

    var stock = document.createElement("td");
    Common.setClass(stock, "stockSymbol");
    stock.style.color = color;
    stock.innerHTML = Common.escapeHTML(symbol);
    row.appendChild(stock);

    var val = document.createElement("td");
    Common.setClass(val, "stockPrice");
    row.appendChild(val);

    var change = document.createElement("td");
    Common.setClass(change, "stockChange");
    row.appendChild(change);

    var percent = document.createElement("td");
    Common.setClass(percent, "stockPercent");
    row.appendChild(percent);

    var stockEntry = {};
    stockEntry.start = 0;
    stockEntry.lastPct = 0;

    stockEntry.valElt = val;
    stockEntry.changeElt = change;
    stockEntry.percentElt = percent;

    this.table[symbol] = stockEntry;
}

function ScrollingPanel(elt, title)
{
    var panel = new Panel(elt, title);
    this.panel = panel;
    //this.scrollingEnabled = !(Common.isIE(6) || Common.isIE(7));
    this.scrollingEnabled = false;
    
    var bodyElt = this.getBodyElement();
    this.scrollingElt = document.createElement("div");
    bodyElt.appendChild(this.scrollingElt);

    if (this.scrollingEnabled) {
	this.step = 0;
	this.numSteps = 0;
	this.diff = 0;

	var $this = this;
	scheduler.addTask(function () {
	    $this.animateScrolling();
        }, 0, 100);
    }
}

ScrollingPanel.prototype.getBodyElement = function() {
    return this.panel.getBodyElement();
}

ScrollingPanel.prototype.getScrollingElement = function() {
    return this.scrollingElt;
}

ScrollingPanel.prototype.append = function(html) {
    var scrollingElt = this.scrollingElt;
    var div=document.createElement("div");
    div.innerHTML = html;
    scrollingElt.appendChild(div);

    while (scrollingElt.childNodes.length > 10)
	scrollingElt.removeChild(scrollingElt.firstChild);

    if (this.scrollingEnabled) {
	this.step = 0;
	this.numSteps = 8;
	this.diff = scrollingElt.scrollHeight-scrollingElt.clientHeight-scrollingElt.scrollTop;
    } else {
	scrollingElt.scrollTop = scrollingElt.scrollHeight;
    }
}

ScrollingPanel.prototype.animateScrolling = function() {
    var scrollingElt = this.scrollingElt;

    if (this.step++ < this.numSteps) {
	scrollingElt.scrollTop += this.diff / this.numSteps;
    } else {
        scrollingElt.scrollTop = scrollingElt.scrollHeight;
    }
}
function TwitterPanel(elt)
{
    var panel = new ScrollingPanel(elt, "Twitter");
    this.scrollingPanel = panel;

    var bodyElt = panel.getBodyElement();
    var scrollingElt = panel.getScrollingElement();
    Common.setClass(scrollingElt, "tweets");

    var logo = document.createElement("img");
    logo.setAttribute("src", "/assets/Image/logo-twitter.gif"); // gif required for IE6 transparency
    Common.setClass(logo, "twitterLogo");

    // ugly temp hack for IE6
    logo.setAttribute("width", "100");
    logo.setAttribute("height", "37");
    bodyElt.appendChild(logo);
}

TwitterPanel.prototype.update = function(tweet)
{
    var status = Common.escapeHTML(tweet.status);

    // make bit.ly links clickable
    var linkSubstr = status.match(/\s(http:\/\/\S+)(?=\s|$)/);
    if (linkSubstr) {
        linkSubstr = linkSubstr.slice(1);
        var linkNew = '<a href="' + linkSubstr + '" class="link"'+
                      ' target="'+Math.random().toString().slice(2)+'">'+linkSubstr+'</a>';
        status = status.replace(linkSubstr, linkNew);
    }

    var html = '<p class="tweet"><a class="link" href="http://twitter.com">'+
                    Common.escapeHTML(tweet.user)+
                    '</a> '+
                    '<span class="status">'+status+'</span></p>';
    this.scrollingPanel.append(html);
}

/*
<div id="disclaimer">The opinions expressed on Twitter do not reflect the views of Kaazing. See Twitter <a href="http://twitter.com/tos">Terms of Service.</a></div>
*/
function NewsPanel(elt, title)
{
    var panel = new ScrollingPanel(elt, title);
    this.scrollingPanel = panel;

    var bodyElt = panel.getBodyElement();
    var scrollingElt = panel.getScrollingElement();
    Common.setClass(scrollingElt, "news");

    this.scrollingPanel.append('<div><br><br><br><br></div>');

    var logo = document.createElement("img");
    logo.setAttribute("src", "/assets/Image/logo-nyt-2.gif"); //gif for IE6 transparency
    Common.setClass(logo, "logo");
    bodyElt.appendChild(logo);
}

NewsPanel.prototype.update = function(article)
{
    var html = '<div class="article">'+
                    '<a class="link" href="'+Common.escapeParam(article.story.newsUrl)+'"'+
                    ' target="_blank">'+
                    article.story.headline+
                    '</a> '+
                    '<br>'+
                    '<div class="summary">'+article.story.summary+
                    '<span class="byline">'+Common.escapeHTML(article.story.byline)+'</span>'+
                    '</div>'+
                    '</div>';
    this.scrollingPanel.append(html);
}
/*
 * Set options.numframes = total frames to show during transition 
 *     (higher frames, better quality, but uses compute power so performance can suffer)
 *     options.transitionTime = total time in ms for transition (default 2 seconds=2000)
 *     options.waitTime = time to wait in ms between transitions (default 5 seconds=5000)
 */
function AdsPanel(elt, options)
{
    this.elt = elt;
    this.images = [];
    this.adIndex = 0;
    this.frame = 0;

    this.numframes=      (options && options.numframes) || 20;
    this.transitionTime= (options && options.transitionTime) || 1000;
    this.waitTime=       (options && options.waitTime) || 5000;

    var panel=this;
    scheduler.addTask(function () {
        panel.animate();
    }, this.numframes, this.transitionTime/this.numframes, this.waitTime);
}

AdsPanel.prototype.add = function(url, altText, linkUrl) {
    var img=document.createElement("img");
    img.src = url;
    img.setAttribute("altText", altText);

    if (this.images.length > 0)
        img.style.visibility = "hidden";
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.top = "0px";

    this.elt.appendChild(img);
    this.images.push(img);

    if (Common.isIE())
        img.onclick = function () {
            parent.window.open(linkUrl);
        };
    else
        img.addEventListener("click", function () {
            parent.window.open(linkUrl);
        }, "true");
}

AdsPanel.prototype.animate = function() {
    var elt = this.elt;

    this.frame++;

    var topImg=this.images[this.adIndex];
    var topOpacity = 1-(this.frame/this.numframes);
    Common.setOpacity(topImg, topOpacity);

    var nextIndex = (this.adIndex+1)%this.images.length;
    var nextImg=this.images[nextIndex];
    var nextOpacity = this.frame/this.numframes;
    Common.setOpacity(nextImg, nextOpacity);

    if (this.frame == 1) {
	/* Start transition */
	topImg.style.zIndex = 1;

	nextImg.style.visibility = "visible";
	nextImg.style.zIndex = 0;
    }

    var timeout;
    if (this.frame == this.numframes) {
        topImg.style.visibility = "hidden";
        topImg.style.zIndex = 0;

        this.adIndex = nextIndex;
        this.frame = 0;
        timeout = this.waitTime;

        var panel=this;
        scheduler.addTask(function () {
	    panel.animate();
	}, this.numframes, this.transitionTime/this.numframes, this.waitTime);
    }
}
function RosterPanel(elt)
{
    RosterPanel.rosterPanel = this;
    RosterPanel.chatPanels = {};

    var panel = new FloatingPanel(elt, "Buddy List");
    this.panel = panel;

    var body=panel.getBodyElement();
    body.style.overflow = "hidden";
    body.innerHTML = '<input type="text" value="On Kaazing" id="status" class="status" spellcheck="false"/>'+
                     '<div id="setAvailability">'+
                     '<select id="availability" class="availability">'+
                     '<option value="available" selected="true">Available</option>'+
                     '<option value="away">Away</option>'+
                     '<option value="dnd">Do Not Disturb</option>'+
                     '</select>'+
                     '</div>';

    var loginElt = document.createElement("iframe");
    loginElt.src = "login.html";
    this.loginElt = loginElt;
    Common.setClass(loginElt, "login");
    loginElt.style.border = "none";
    loginElt.style.width = "100%";
    loginElt.style.height = "100%";
    body.appendChild(loginElt);

    var rosterElt = document.createElement("div");
    this.rosterElt = rosterElt;
    Common.setClass(rosterElt, "roster");
    rosterElt.style.display = "none";
    body.appendChild(rosterElt);

    /* Event handler dispatch */
    var rosterPanel = this;
    rosterElt.onclick= function (ev) { rosterPanel.handleClick(ev); }

    $("status").onblur =         function () { rosterPanel.setStatus(); }
    $("status").onkeydown =      function (ev) { rosterPanel.handleKeyDown(ev); }
    $("availability").onchange = function () { rosterPanel.setStatus(); }

    /* XMPP Client dispatch */
    var xmppClient = new XmppClient();
    this.xmppClient = xmppClient;
    this.lastUpdate = 0;
    this.needsUpdate = false;

    var rosterPanel = this;  // required for closures
    xmppClient.onopen =          function () { rosterPanel.handleOpen(); };
    xmppClient.onauthenticated = function () { rosterPanel.handleAuthenticated(); };
    xmppClient.onmessage =       function (msg) { rosterPanel.handleMessage(msg); };
    xmppClient.onpresence =      function (p){ rosterPanel.handlePresence(p); };
    xmppClient.onerror =         function (e) { rosterPanel.handleError(e); };
    xmppClient.onclose =         function () { rosterPanel.handleClose(); };

    RosterPanel.xmppClient = xmppClient;
}

RosterPanel.getRosterPanel = function() { 
    return RosterPanel.rosterPanel;
}

RosterPanel.getChatPanel = function(jid) { 
    var chatPanel = RosterPanel.chatPanels[jid];
    if (!chatPanel) {
        var shortName = RosterPanel.shortName(jid);
        chatPanel = new ChatPanel(shortName, jid, RosterPanel.xmppClient);
    }

    return chatPanel;
}

RosterPanel.shortName = function(jid) {
    return jid.split('@')[0];
}

RosterPanel.prototype.connect = function(username, password) {
    this.username = username;
    this.password = password;
    this.resource = "Home"

    this.server = "gmail.com";
    if (username.indexOf("@") >= 0)
        this.server = username.split("@")[1];

    //var url = "wss://xmpp.kaazing.me:80/gtalk";
    var url=Common.getWSLocation("gtalk");
    this.xmppClient.connect(url, this.server);
}

RosterPanel.prototype.handleOpen = function() {
    if (this.setConnectionStatus)
        this.setConnectionStatus("Chat Connecting...");

    this.xmppClient.userJid = this.username;
    this.xmppClient.authenticate({username:this.username, password:this.password});
}

RosterPanel.prototype.handleAuthenticated = function() {
    this.xmppClient.bind(this.resource);

    this.setStatus();

    var rosterPanel = this;
    this.xmppClient.getRoster(function(roster) {
        for (var i=0; i<roster.length; i++) {
            var entity = roster[i];
            entity.shortName = RosterPanel.shortName(entity.jid);
	}

        rosterPanel.roster = roster;
        rosterPanel.updateRoster();
    });

    this.loginElt.style.display = "none";
    this.rosterElt.style.display = "block";
    this.panel.show();
}

RosterPanel.prototype.setStatus = function() {
    var status = $("status").value;
    var availability = $("availability").value.toLowerCase();
    this.xmppClient.setStatus(status, availability);
}

RosterPanel.prototype.sortRoster = function(roster) {
    // sort the list by status
    var chatList = new Array();
    var availableList = new Array();
    var awayList = new Array();
    var extendedList  = new Array();
    var dndList  = new Array();
    var offlineList = new Array();

    for (var j=0; j<roster.length; j++) {
        var entity = roster[j];
        if (entity.show == 'chat')
            chatList.push(entity);
        else if (entity.show == 'away')
            awayList.push(entity);
        else if (entity.show == 'xa')
            extendedList.push(entity);
        else if (entity.show == 'dnd')
            dndList.push(entity);
        else if (('show' in entity) || entity.status == 'Available')
            availableList.push(entity);
        else
            offlineList.push(entity);
    }

    function entitySort(a,b) {
        var aname = a.shortName;
        var bname = b.shortName;
        return aname < bname ? -1 : (aname > bname ? 1 : 0);
    }

    /* Sort by short name */
    chatList = chatList.sort(entitySort);
    availableList = availableList.sort(entitySort);
    awayList = awayList.sort(entitySort);
    extendedList = extendedList.sort(entitySort);
    dndList = dndList.sort(entitySort);
    offlineList = offlineList.sort(entitySort);

    return chatList.concat(availableList)
                   .concat(awayList)
                   .concat(extendedList)
                   .concat(dndList)
                   .concat(offlineList);
}

RosterPanel.prototype.handleMessage = function(msg) {
    var jid=msg.from.split("/")[0];
    var chatPanel = RosterPanel.getChatPanel(jid);
    chatPanel.showMessage(jid, msg.body);
}

RosterPanel.prototype.handlePresence = function(p) {
    var rosterName = p.from.slice(0, p.from.indexOf("/"))
    if (this.roster) {
        var roster = this.roster;
        for (var i=0; i<roster.length; i++) {
            if (roster[i].jid === rosterName) {
                roster[i].status = p.status;
                roster[i].show = p.show;
            }
        }

        this.updateRoster();
    }
}

RosterPanel.prototype.handleError = function(e) {
    alert("While attempting to chat: " + e)
    this.setConnectionStatus("Chat Error");//should check connection status here
}

RosterPanel.prototype.handleClose = function() {
    this.xmppClient.userJid = null;
    this.setConnectionStatus("Chat Disconnected");
    this.hide();
}

RosterPanel.prototype.handleKeyDown = function (ev) {
    var field = $("status");
    var code=Common.getEventKeyCode(ev);
    if (code == 13 && field.value != "")
        this.setStatus();
}

RosterPanel.prototype.handleClick = function(ev) {
    var target = Common.getEventTarget(ev);
    while (target) {
        if (target.nodeName == "DIV" && 
            target.getAttribute("class") == "chat_friend") {

            var jid = target.getAttribute("recipientjid");
            this.displayChat(jid);
            break;
        }
        target = target.parentNode;
    }
}

RosterPanel.prototype.sendMessage = function(jid, msg) {
    this.xmppClient.sendMessage(jid, msg);
}

RosterPanel.prototype.countFriendsOnline = function() {
    var roster = this.roster;
    var count=0;
    for (var i=0; i<roster.length; i++) {
        var entity = roster[i];
        if (entity.status || entity.show)
            count++;
    }
    return count;
}

RosterPanel.prototype.updateRoster = function() {

    var rosterPanel = this;  // required for closures
    function doUpdate() {
        if (rosterPanel.needsUpdate) {
            rosterPanel.needsUpdate = false;

            var friendsOnline = rosterPanel.countFriendsOnline();
            rosterPanel.setConnectionStatus(friendsOnline+" Friends Online");
            rosterPanel.rosterElt.innerHTML = rosterPanel.getRosterContent();

	    lastUpdate = new Date().getTime();
        }
    }

    this.needsUpdate = true;

    var now = new Date().getTime();
    if (this.lastUpdate < now - 2000) {
        doUpdate();
    }
    else {
        setTimeout0(doUpdate, 2000, "chat delay");
    }
}

RosterPanel.prototype.getRosterContent = function() {

    // populate the friends list
    var roster = this.sortRoster(this.roster);

    var s = '';
    for (var i=0; i<roster.length; i++) {
        var entity = roster[i];
        var presenceState;
        if (entity.show)
            presenceState = entity.show;
        else {
            presenceState = 
                (entity.status && entity.status != "unavailable") ? "Available" : "Offline";
        }

        var presenceImageUrl = "/assets/Image/presence-offline.png";
        var status;
        var showClass = "chat_show " + (entity.show ? ("chat_show_" + entity.show)
                                                     : "chat_show_available");

        switch (presenceState.toLowerCase())
        {
          case "available": case "chat":
              presenceImageUrl = "/assets/Image/presence-available.png";
              status = entity.status || "Available";
              break;

          case "away": case "xa":
              presenceImageUrl = "/assets/Image/presence-away.png";
	      if (entity.status && entity.status != 'Available')
		  status = entity.status;
	      else
		  status = "Away";
              break;

          case "dnd":
              presenceImageUrl = "/assets/Image/presence-busy.png";
	      if (entity.status && entity.status != 'Available')
		  status = entity.status;
	      else
		  status = "Do Not Disturb";
              break;

          case "offline": case "unavailable":
              presenceImageUrl = "/assets/Image/presence-offline.png";
              status = entity.status || "Offline";
              showClass="chat_show chat_show_offline";
              break;
        }
        s += '<div class="chat_friend"'+
             ' recipientjid="'+entity.jid+'">'+
             '<img class="presence" id="presence_'+entity.shortName+'"'+
             ' src="'+presenceImageUrl+'">'+
             '<a href="#">'+
             '<span class="name ' + showClass + '">' + entity.shortName + '</span>' +
             ' - '+
             '<span class="' + showClass + '">'+ status + '</span>'+
             '</a></div>';
    }

    return s;
}

RosterPanel.prototype.hide = function() {
  this.panel.hide();
}

RosterPanel.prototype.show = function() {
  this.panel.show();
}

RosterPanel.prototype.close = function() {
  this.xmppClient.disconnect();

  this.panel.animateClosing();
}

RosterPanel.prototype.displayChat = function(jid) {
    var chatPanel = RosterPanel.getChatPanel(jid);
    chatPanel.show();
}

function ChatPanel(recipientName, recipientJid, xmppClient) {
  var elt=document.createElement("div");
  elt.setAttribute("class", "chatPanel floatingPanel"); //doesn't work in IE6

  elt.style.position = "fixed";
  elt.style.left = ChatPanel.left+"px";
  elt.style.top = ChatPanel.left+"px";
  ChatPanel.left += 20;
  ChatPanel.left = ((ChatPanel.left-50)%160)+50;

  document.body.appendChild(elt);

  var panel = new FloatingPanel(elt, recipientName);
  this.panel = panel;
  this.recipientName = recipientName;
  this.recipientJid = recipientJid;

  var bodyElt=panel.getBodyElement();

  var chatElt = document.createElement("div");
  Common.setClass(chatElt, "chat");
  bodyElt.appendChild(chatElt);
  this.chatElt = chatElt;

  var chatInputAreaElt=document.createElement("div");
  Common.setClass(chatInputAreaElt, "chatinputarea");
  bodyElt.appendChild(chatInputAreaElt);

  var chatInputElt=document.createElement("input");
  chatInputElt.setAttribute("type","text");
  chatInputAreaElt.appendChild(chatInputElt);
  this.chatInputElt = chatInputElt;

  var sendElt=document.createElement("img");
  sendElt.setAttribute("src","/assets/Image/btn-send.gif");
  Common.setClass(sendElt, "chatSendButton");
  chatInputAreaElt.appendChild(sendElt);
  
  var chatPanel = this;
  chatInputElt.onkeydown = function (ev) { chatPanel.handleKeyDown(ev); };
  sendElt.onclick = function (ev) { chatPanel.handleClick(ev); };

  this.xmppClient = xmppClient;

  RosterPanel.chatPanels[recipientJid] = this;
  chatInputElt.focus();
}
ChatPanel.left=50;

ChatPanel.prototype.handleKeyDown = function (ev) {
    var field = this.chatInputElt;
    var code=Common.getEventKeyCode(ev);
    if (code == 13 && field.value != "") {
        this.send(this.recipientJid, field.value);
        field.value = "";
        return false;
    }
    else
        return true;
}

ChatPanel.prototype.handleClick = function (ev) {
    var field = this.chatInputElt;
    this.send(this.recipientJid, field.value);
    field.value = "";
    return false;
}

ChatPanel.prototype.send = function(jid, body) {
    this.xmppClient.sendMessage(jid, body);
    this.showMessage(this.xmppClient.userJid, body, "chat_me");
}

ChatPanel.prototype.show = function() {
  this.panel.show();
}

ChatPanel.prototype.showMessage = function(from, body, chatClass) {
    this.show();

    var xbody = Common.escapeHTML(body);
    var from = RosterPanel.shortName(from);
    var chatLine = document.createElement("div");
    Common.setClass(chatLine, "chat_line");
    chatLine.innerHTML = '<span class="' + (chatClass||"chat_user") + '">'+
                         '<a href="#">' + from + '</a>: </span>' + xbody;
    this.chatElt.appendChild(chatLine);

    this.chatElt.scrollTop = this.chatElt.scrollHeight;
}

/*
ChatPanel.prototype.handleClose = function (ev) {
    RosterPanel.chatPanels[this.recipientJid] = null;// can we use delete?
}
*/
