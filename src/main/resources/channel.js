var WPC = {};
function AssertException(message) {
	this.message = message
}
AssertException.prototype.toString = function () {
	return"AssertException: " + this.message
};
function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message)
	}
}
if (!window.console)console = {log: function () {
}};
function log(o) {
	if (top.console && top.console.log) {
		top.console.log(o)
	} else if (top.jash) {
		top.jash.print(o)
	}
}
function acquire(key, fgot, flose) {
	var r_ = Math.random();
	var race_check = function () {
		var foo = WPC.cookie.get(key);
		if (foo == r_)fgot && fgot(); else flose && flose()
	};
	WPC.cookie.set(key, r_);
	setTimeout(race_check, 40)
}
var imHelper = {getCookie: function (key) {
	return WPC.cookie.get(key)
}, setCookie: function (key, value, expire) {
	WPC.cookie.set(key, value, expire)
}, playSound: function () {
	if (top.webpager.service.preferences.get("quiet_mode"))return;
	WPC.sound.playSound()
}};
!function (ns) {
	var ua = navigator.userAgent.toLowerCase();
	var domain = "renren.com";

	function isArray(object) {
		return Object.prototype.toString.call(object) === "[object Array]"
	}

	function textNodeValue(node) {
		var c = node.firstChild;
		while (c) {
			if (!c.isElementContentWhitespace) {
				return c.textContent
			}
			c = c.nextSibling
		}
		return null
	}

	function nodeValue(ele, nodeName) {
		var node = ele.getElementsByTagName(nodeName)[0];
		if (node) {
			return node.textContent
		} else {
			return""
		}
	}

	ns.startXnclient = function () {
		var a;
		try {
			a = new ActiveXObject("xntalk.Application.2")
		} catch (e) {
			return false
		}
		if (!a)return false;
		var res;
		try {
			res = a.login()
		} catch (e) {
			return false
		}
		if (res == 1) {
			return false
		}
		return true
	};
	ns.getLoginUin = function () {
		var uin = ns.cookie.get("id");
		if (!uin) {
			uin = ns.cookie.get("hostid")
		}
		if (!uin) {
			uin = ns.cookie.get("userid")
		}
		return uin
	};
	ns.xmlEncode = function (str) {
		str = str.replace(/&/g, "&amp;");
		str = str.replace(/</g, "&lt;");
		str = str.replace(/>/g, "&gt;");
		str = str.replace(/'/g, "&apos;");
		str = str.replace(/\"/g, "&quot;");
		return str
	};
	ns.countStr = function (b, a) {
		try {
			var tmp = b.split(a)
		} catch (e) {
			return 0
		}
		return tmp.length - 1
	};
	ns.isInArray = function (v, ary) {
		for (var i = 0; i < ary.length; i++) {
			if (ary[i] == v) {
				return true
			}
		}
		return false
	};
	ns.distinct = function (a) {
		var ret = [];
		var b = {};
		for (var i = 0; i < a.length; i++) {
			b[a[i]] = 1
		}
		for (key in b) {
			ret.push(key)
		}
		return ret
	};
	ns.parseUserInfo = function (str) {
		var regx = /(\d+)@([^\/]+)\/(.*)/;
		return regx.exec(str)
	};
	ns.browser = {isFirefox: /gecko/.test(ua) && /rv/.test(ua), isOpera: /opera/.test(ua), isChrome: /chrome/.test(ua), isWebkit: /webkit/.test(ua) && !/opera/.test(ua) && !/chrome/.test(ua), isIE: /msie/.test(ua) && !/opera/.test(ua), browserOK: false, type: ""};
	var bs = ["isFirefox", "isOpera", "isChrome", "isWebkit", "isIE"];
	for (var i = 0; i < bs.length; i++) {
		if (ns.browser[bs[i]]) {
			ns.browser["type"] = bs[i].substr(2);
			break
		}
	}
	ns.cookie = {get: function (name) {
		var results = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
		if (results) {
			return decodeURIComponent(results[2])
		}
		return null
	}, set: function (name, value, expires) {
		var s = name + "=" + encodeURIComponent(value);
		if (expires) {
			expires = expires * 1e3 * 60 * 60 * 24;
			var expDate = new Date((new Date).getTime() + expires);
			s += ";expires=" + expDate.toGMTString()
		}
		document.cookie = s
	}};
	var ck = ns.cookie;
	var spCare = ["229406110", "85432256", "103113664", "236467077"].join("&");
	try {
		var userid = top.XN.user.id
	} catch (e) {
		var userid = "x"
	}
	if (spCare.indexOf(userid) < 0) {
		window.log_all = false
	} else {
		window.log_all = true
	}
	ns.report = function (url, t) {
		if (!t) {
			t = (new Date).getTime()
		}
		var n = "plog_" + t;
		var c = window[n] = new top.Image;
		c.onload = c.onerror = function () {
			window[n] = null
		};
		c.src = url;
		c = null;
		return c
	};
	var logurl = "http://60.28.212.53";
	ns.reportLogMsg = function (task, msgstr) {
		var t = (new Date).getTime();
		if (!msgstr) {
			var url = logurl + "/nlog/" + userid + "/webpager/" + task + "/?t=" + t
		} else {
			var url = logurl + "/mlog/" + userid + "/webpager/" + task + "/?" + msgstr + "&t=" + t
		}
		ns.report(url, t)
	};
	var checkin_time = ck.get("today");
	var checkin_screen;
	if (checkin_time == null) {
		var tt = new Date;
		checkin_time = tt.getHours() + "." + tt.getMinutes();
		try {
			checkin_screen = window.screen.width + "x" + window.screen.height
		} catch (e) {
		}
		var checkin_url = logurl + "/ckin/" + userid + "/?screen=" + checkin_screen + "&td=" + tt.getMonth() + tt.getDate();
		ns.report(checkin_url, tt.getTime());
		tt.setHours(23);
		tt.setMinutes(59);
		tt.setSeconds(59);
		document.cookie = "today=" + checkin_time + ";expires=" + tt.toGMTString()
	}
	var _report_tasks = {};
	ns.reportExpt = function (task, err, context) {
		var ts = _report_tasks;
		if (!ts[task]) {
			ts[task] = 0
		} else if (ts[task] >= 5) {
			return
		}
		var t = (new Date).getTime();
		try {
			var encode = encodeURIComponent;
			var NLINE = "[~]";
			context = context ? context.replace(/\n/g, NLINE) : "";
			var expt = err.toString();
			if (err.number) {
				expt += err.number
			}
			if (err.description) {
				expt += err.description
			}
			expt = expt.replace(/\n/g, NLINE);
			var url = [logurl + "/expt/" + userid + "/webpager/" + task + "/?b=" + ns.browser.type, "v=" + imVer, "e=" + encode(expt), "context=" + encode(context), "t=" + t].join("&")
		} catch (e) {
			var url = logurl + "/expt/" + userid + "/global/reportExpt?checkin=" + checkin_time + "&e=" + (e.description || e.toString())
		}
		ts[task]++;
		var n = "expt_" + t;
		var c = window[n] = new top.Image;
		c.onload = c.onerror = function () {
			window[n] = null
		};
		c.src = url;
		c = null
	};
	ns.json = function () {
		function f(n) {
			return n < 10 ? "0" + n : n
		}

		Date.prototype.toJSON = function () {
			return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"
		};
		var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g, gap, indent, meta = {"\b": "\\b", "	": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"}, rep;

		function quote(string) {
			return escapeable.test(string) ? '"' + string.replace(escapeable, function (a) {
				var c = meta[a];
				if (typeof c === "string") {
					return c
				}
				c = a.charCodeAt();
				return"\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
			}) + '"' : '"' + string + '"'
		}

		function str(key, holder) {
			var i, k, v, length, mind = gap, partial, value = holder[key];
			if (value && typeof value === "object" && typeof value.toJSON === "function") {
				value = value.toJSON(key)
			}
			if (typeof rep === "function") {
				value = rep.call(holder, key, value)
			}
			switch (typeof value) {
				case"string":
					return quote(value);
				case"number":
					return isFinite(value) ? String(value) : "null";
				case"boolean":
				case"null":
					return String(value);
				case"object":
					if (!value) {
						return"null"
					}
					gap += indent;
					partial = [];
					if (typeof value.length === "number" && !value.propertyIsEnumerable("length")) {
						length = value.length;
						for (i = 0; i < length; i += 1) {
							partial[i] = str(i, value) || "null"
						}
						v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
						gap = mind;
						return v
					}
					if (typeof rep === "object") {
						length = rep.length;
						for (i = 0; i < length; i += 1) {
							k = rep[i];
							if (typeof k === "string") {
								v = str(k, value, rep);
								if (v) {
									partial.push(quote(k) + (gap ? ": " : ":") + v)
								}
							}
						}
					} else {
						for (k in value) {
							v = str(k, value, rep);
							if (v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v)
							}
						}
					}
					v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
					gap = mind;
					return v
			}
		}

		return{stringify: function (value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (space) {
				if (typeof space === "number") {
					for (i = 0; i < space; i += 1) {
						indent += " "
					}
				} else if (typeof space === "string") {
					indent = space
				}
			}
			if (!replacer) {
				rep = function (key, value) {
					if (!Object.hasOwnProperty.call(this, key)) {
						return undefined
					}
					return value
				}
			} else if (typeof replacer === "function" || typeof replacer === "object" && typeof replacer.length === "number") {
				rep = replacer
			} else {
				throw new Error("JSON.stringify")
			}
			return str("", {"": value})
		}, parse: function (text, reviver) {
			return eval("(" + text + ")")
		}, quote: quote}
	}();
	ns.event = {addEvent: function (obj, type, fn) {
		if (!obj._listeners) {
			obj._listeners = {}
		}
		if (!obj._listeners[type]) {
			obj._listeners[type] = []
		}
		obj._listeners[type].push(fn);
		return obj
	}, removeEvent: function (obj, type, fn) {
		if (!obj._listeners || !obj._listeners[type]) {
			return
		} else if (fn) {
			for (var i = 0; i < obj._listeners[type].length; ++i) {
				if (obj._listeners[type][i] === fn) {
					var removed = obj._listeners[type].splice(i, 1)
				}
			}
		} else {
			obj._listeners[type] = []
		}
	}, fireEvent: function (obj, type, args) {
		if (!obj._listeners)return null;
		if (!obj._listeners[type] || !obj._listeners[type].length) {
			return null
		}
		var elistener = obj._listeners[type];
		if (!elistener)return null;
		for (var i = 0; i < elistener.length; i++) {
			try {
				elistener[i].apply(obj, args)
			} catch (e) {
			}
		}
		return obj
	}, enableCustomEvent: function (obj) {
		var This = this;
		obj.addEvent = function (type, fn) {
			This.addEvent(obj, type, fn)
		};
		obj.removeEvent = function (type, fn) {
			This.removeEvent(obj, type, fn)
		};
		obj.fireEvent = function (type) {
			var args = Array.prototype.slice.call(arguments, 1, arguments.length);
			This.fireEvent(obj, type, args)
		}
	}};
	ns.net = {ajax: function (obj) {
		var xhr = ns.net.getXhr();
		xhr.open(obj.method || "get", obj.url, true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (!xhr.aborted && xhr.status >= 200 && xhr.status < 300) {
					if (obj.onSuccess) {
						obj.onSuccess(xhr)
					}
				} else {
					if (obj.onError) {
						obj.onError(xhr)
					}
				}
			}
		};
		xhr.send(obj.data);
		return xhr
	}, getXhr: function () {
		try {
			return new XMLHttpRequest
		} catch (e) {
		}
		try {
			return new ActiveXObject("microsoft.xmlhttp")
		} catch (e) {
		}
		try {
			return new ActiveXObject("msxml2.xmlhttp")
		} catch (e) {
		}
		return null
	}};
	ns.xml = {extractMessage: function (text) {
		var t = text.replace(/<title>/i, "<title><![CDATA[");
		text = t.replace(/<\/title>/i, "]]></title>");
		t = text.replace(/<body>/i, "<body><![CDATA[");
		text = t.replace(/<\/body>/i, "]]></body>");
		t = text.replace(/<attachment>/i, "<attachment><![CDATA[");
		text = t.replace(/<\/attachment>/i, "]]></attachment>");
		var doc, res = [];
		if (window.ActiveXObject) {
			if (text.indexOf("/>") >= 0)text = text.replace(/<\w+\s*\/>/, "");
			try {
				doc = new ActiveXObject("Microsoft.XMLDOM")
			} catch (e) {
				ns.reportExpt("xmlparser_IE", e, navigator.userAgent)
			}
			doc.async = false;
			doc.loadXML(text);
			if (0 != doc.parseError.errorCode)return res;
			var msgv = doc.getElementsByTagName("message");
			for (var i = 0; i < msgv.length; ++i) {
				var n = msgv[i];
				if (n.attributes) {
					var m = {};
					var type = n.getAttribute("type");
					m.msg_id = n.getAttribute("id");
					if (type == "chat") {
						m.from = n.getAttribute("from");
						m.to = n.getAttribute("to");
						m.fname = n.getAttribute("fname");
						if (n.firstChild && n.firstChild.firstChild)m.msg_content = n.firstChild.firstChild.data
					} else if (type == "notify" || type == "notify2") {
						m.touin = ns.getLoginUin();
						for (var j = 0; j < n.childNodes.length; j++) {
							if (n.childNodes[j].tagName == "subject") {
								m.title = n.childNodes[j].childNodes[0].data
							} else if (n.childNodes[j].tagName == "body") {
								m.content = n.childNodes[j].childNodes[0].data
							}
						}
					} else if (type == "spam") {
						for (var j = 0; j < n.childNodes.length; j++) {
							m[n.childNodes[j].tagName] = n.childNodes[j].childNodes[0].data
						}
						m["content"] = m["body"]
					} else {
						m.from = n.getAttribute("from");
						m.to = n.getAttribute("to");
						m.content = n.childNodes[0].childNodes[0].data
					}
					m.type = type;
					if (n.childNodes[1] && n.childNodes[1].tagName == "attachment") {
						if (n.childNodes[1].firstChild)m.attachment = n.childNodes[1].firstChild.data
					}
				}
				res.push(m)
			}
		} else {
			var parser = new DOMParser;
			doc = parser.parseFromString(text, "text/xml");
			var rootNode = doc.documentElement;
			var cnt = rootNode.childNodes.length;
			for (var i = 0; i < cnt; ++i) {
				var n = rootNode.childNodes[i];
				if (n.hasAttributes()) {
					var m = {};
					m.type = n.getAttribute("type");
					m.msg_id = n.getAttribute("id");
					m.from = n.getAttribute("from");
					m.to = n.getAttribute("to");
					m.content = nodeValue(n, "body");
					m.msg_content = nodeValue(n, "body");
					m.attachment = nodeValue(n, "attachment");
					m.touin = ns.getLoginUin();
					if (m.type == "chat") {
						m.fname = n.getAttribute("fname")
					}
					if (m.type == "spam") {
						m.from = nodeValue(n, "from");
						m.to = nodeValue(n, "to");
						m.code = nodeValue(n, "code")
					}
					res.push(m)
				}
			}
		}
		return res
	}};
	ns.sound = {soundLoadCnt: 0, init: function () {
		this.loadSound()
	}, loadSound: function () {
		var snd_url = "http://wpi.renren.com/wtalk/wpsound.swf";
		var html = '<object width="10" height="10" id="webpagersound" type="application/x-shockwave-flash" data="' + snd_url + '">' + '<param name="allowScriptAccess" value="sameDomain" />' + '<param name="movie" value="wpsound.swf" />' + '<param name="scale" value="noscale" />' + '<param name="salign" value="lt" />' + "</object>";
		var sp = document.createElement("div");
		sp.innerHTML = html;
		document.body.appendChild(sp)
	}, playSound: function (type) {
		var This = this;
		if (!ns.Profile.isPlaySound())return;
		var snd = document.getElementById("webpagersound");
		if (!snd) {
			if (++this.soundLoadCnt < 20) {
				if (this.soundLoadCnt == 1) {
					this.loadSound()
				}
				setTimeout(function () {
					This.playSound(type)
				}, 200)
			}
			return
		}
		try {
			if (type == "notify") {
				snd.playNotifySound()
			} else {
				snd.playMessageSound()
			}
		} catch (e) {
		}
	}};
	ns.seqq = {seqn: 40, SEQ_EXPIRE_DAYS: 10 * 365, init: function () {
		this.seqn = ck.get("wpseqn") || this.seqn
	}, getMsgSeq: function (m) {
		var n = parseInt(ck.get(m || "wpseq"));
		if (isNaN(n)) {
			return-1
		}
		return n >= 0 ? n : 0
	}, setMsgSeq: function (seq, m) {
		ck.set(m || "wpseq", seq, this.SEQ_EXPIRE_DAYS)
	}, getNextSeq: function (seqn) {
		var newseq = this.getMsgSeq() + 1;
		this.setMsgSeq(newseq);
		if (seqn && seqn > this.seqn) {
			this.seqn = seqn;
			this.setSeqn(this.seqn)
		}
		return"s" + newseq % this.seqn
	}, setSeqn: function (num) {
		ck.set("wpseqn", num)
	}};
	ns.seqq.init();
	var USE_IM_BIT = 1;
	var PLAY_SOUND_BIT = 2;
	var BLIST_TOP_BIT = 4;
	var STORE_HISTORY_BIT = 8;
	ns.Profile = {expire: 10 * 365, setting: 27, init: function () {
		this.load()
	}, load: function () {
		var v = ns.cookie.get("wpsetting");
		if (v != null) {
			this.setting = parseInt(v)
		}
		return true
	}, isUseIm: function () {
		this.load();
		return this.setting & USE_IM_BIT
	}, isPlaySound: function () {
		return this.setting & PLAY_SOUND_BIT
	}, isStoreHistory: function () {
		return this.setting & STORE_HISTORY_BIT
	}, setUseIm: function (b, deep) {
		if (b) {
			this.setting |= USE_IM_BIT
		} else {
			this.setting &= ~USE_IM_BIT
		}
		if (deep) {
			ck.set("wpsetting", this.setting, this.expire);
			this.fireEvent("profile_useIM_switch", b ? "1" : "0")
		}
	}, setPlaySound: function (b, deep) {
		if (b)this.setting |= PLAY_SOUND_BIT; else this.setting &= ~PLAY_SOUND_BIT;
		if (deep) {
			ck.set("wpsetting", this.setting, this.expire);
			this.fireEvent("profile_sound_switch", b ? "1" : "0")
		}
	}, setStoreHistory: function (b, deep) {
		if (b)this.setting |= STORE_HISTORY_BIT; else this.setting &= ~STORE_HISTORY_BIT;
		if (deep) {
			ck.set("wpsetting", this.setting, this.expire);
			this.fireEvent("profile_setHistory_switch", b ? "1" : "0")
		}
	}};
	ns.event.enableCustomEvent(ns.Profile);
	ns.Profile.init()
}(WPC);
!function (ns) {
	ns.PersistMgr = {write_seq: 0, qLen: 10, MONIT_INTERV: 513, _storage: null, lastModify: {lastKeys: "", keys: []}, lastModKeys: [], init: function () {
		var ok = this.initStorage();
		if (!ok) {
			return ok
		}
		var obj = this.getLastMod();
		this.timestamp = obj.timestamp;
		var lm = this.lastModify;
		lm.timestamp = this.timestamp;
		lm.keys = obj.keysAry;
		lm.lastKeys = obj.keys;
		this.storageMonit();
		return ok
	}, initStorage: function () {
		var ok = true;
		if (window.localStorage) {
			this._storage = this.localStorage
		} else {
			this._storage = this.userDataStorage;
			this._storage.init();
			ok = this._storage.isAvailable()
		}
		return ok
	}, lastModToStr: function (obj) {
		return obj.timestamp + "\n" + obj.keys.join(",")
	}, pushLastModKey: function (key) {
		var lm = this.lastModify;
		if (lm.length > 20) {
		} else {
		}
	}, getWriteSeq: function () {
		return this.write_seq++
	}, setLastMod: function (key, save) {
		var o = this.getLastMod();
		var qLen = this.qLen;
		var ts = (new Date).getTime();
		var lm = this.lastModify;
		try {
			var temp = {keys: o.keys.split(","), lastKeys: o.keys, timestamp: ts};
			if (temp.keys.length > qLen) {
				temp.keys.length = qLen
			}
			var pos = this.getWriteSeq() % qLen;
			temp.keys[pos] = key;
			var str_ = this.lastModToStr(temp)
		} catch (e) {
			ns.reportExpt("setLastMod", e, o.keys);
			return
		}
		this._storage.setItemTo("last" + pos, ts + " " + key, "webpager_control");
		this._storage.setItemTo("lastMod", str_, "webpager_control", save)
	}, clearLastMod: function () {
		var ts = (new Date).getTime();
		var lm = this.lastModify;
		lm.keys = [];
		var str_ = this.lastModToStr(lm);
		this._storage.setItemTo("lastMod", str_, "webpager_control")
	}, setItemTo: function (key, value, zone, noEvent) {
		var This = this;
		try {
			if (!this._storage) {
				this.initStorage()
			}
			var ok = this._storage.setItemTo(key, value, zone);
			if (!noEvent) {
				this.setLastMod(zone + "." + key)
			}
			return ok
		} catch (e) {
			ns.reportExpt("setItemTo", e, key + "=" + value);
			return false
		}
	}, removeItem: function (key) {
		if (!this._storage) {
			this.initStorage()
		}
		this._storage.removeItem(key)
	}, getItemFrom: function (key, zone) {
		try {
			if (!this._storage) {
				this.initStorage()
			}
			var v = this._storage.getItemFrom(key, zone);
			return v
		} catch (e) {
			ns.reportExpt("getItemFrom", e, key + "=" + zone);
			return""
		}
	}, clear: function () {
		this._storage.clear()
	}, lock: function () {
		this._storage.setItemTo("l", true, "webpager_control")
	}, unlock: function () {
		this._storage.setItemTo("l", false, "webpager_control")
	}, isLock: function () {
		return this._storage.getItemFrom("l", "webpager_control") == "true"
	}, getStamp: function () {
		return this.getItemFrom("timestamp", "webpager_control")
	}, getLastMod: function () {
		var lm = this.getItemFrom("lastMod", "webpager_control");
		var obj = {timestamp: (new Date).getTime(), keys: "", keysAry: []};
		try {
			if (lm) {
				var ary = lm.split("\n");
				if (ary) {
					obj.timestamp = ary[0];
					obj.keys = ary[1] || "";
					obj.keysAry = ary[1] ? ary[1].split(",") : []
				}
			}
		} catch (e) {
			ns.reportExpt("getLastMod", e, lm)
		}
		return obj
	}, getNewKeys: function (keys_new, keys_old) {
		var tmp = {};
		var tmp_new = {};
		var ret = [];
		if (keys_new.join("") == keys_old.join("")) {
			return[keys_new[0]]
		}
		for (var i = 0; i < keys_old.length; i++) {
			if (tmp[keys_old[i]] === undefined) {
				tmp[keys_old[i]] = 0
			} else {
				tmp[keys_old[i]]++
			}
		}
		for (i = 0; i < keys_new.length; i++) {
			if (tmp_new[keys_new[i]] === undefined) {
				tmp_new[keys_new[i]] = 0
			} else {
				tmp_new[keys_new[i]]++
			}
		}
		var mayBeNew;
		for (var j = 0; j < keys_new.length; j++) {
			mayBeNew = keys_new[j];
			if (tmp[mayBeNew] === undefined || tmp_new[mayBeNew] > tmp[mayBeNew]) {
				if (!ns.isInArray(mayBeNew, ret)) {
					ret.push(mayBeNew)
				}
			}
		}
		return ret
	}, getNewKeys2: function (start_stmp, end_stmp) {
		var ret = [];
		var ret2 = [];
		var tmp;
		for (var i = 0; i < this.qLen; i++) {
			tmp = this._storage.getItemFrom("last" + i, "webpager_control");
			if (!tmp)continue;
			tmp = this.getLastObj(tmp);
			if (tmp.timestamp > start_stmp && tmp.timestamp <= end_stmp) {
				ret.push(tmp)
			}
		}
		ret.sort(function (a, b) {
			return a.timestamp > b.timestamp
		});
		for (var j = 0; j < ret.length; j++) {
			ret2.push(ret[j].key)
		}
		return ret2
	}, getLastObj: function (str) {
		var ary = str.split(" ");
		return{timestamp: parseInt(ary[0]), key: ary[1]}
	}, storageMonit: function () {
		var o = this.getLastMod();
		if (this.timestamp != o.timestamp) {
			try {
				var aLast = o.keys.split(",");
				var aLk = this.lastModify.lastKeys.split(",");
				var newKeys = this.getNewKeys2(this.timestamp, o.timestamp);
				var p = {keys_raw: newKeys.join(","), keys: ns.distinct(newKeys).join(",")};
				this.lastModify.lastKeys = o.keys;
				this.lastModify.keys = aLast;
				this.timestamp = o.timestamp;
				this.fireEvent("storage", p)
			} catch (e) {
				ns.reportExpt("storageMonit", e, o.keys)
			}
		}
		var This = this;
		this.monitTimer = setTimeout(function () {
			This.storageMonit()
		}, this.MONIT_INTERV)
	}, getNid: function (m) {
		var nid = null;
		if (m) {
			try {
				var obj = eval("(" + m.content + ")");
				if (obj && obj.nid) {
					nid = obj.nid
				}
			} catch (e) {
			}
		}
		return nid
	}, localStorage: {setItemTo: function (key, value, zone) {
		try {
			localStorage.setItem(zone + "_" + key, value)
		} catch (e) {
			ns.reportExpt("w3cStorage_set", e, key + "=" + value);
			return false
		}
		return true
	}, getItemFrom: function (key, zone) {
		try {
			return localStorage.getItem(zone + "_" + key)
		} catch (e) {
			ns.reportExpt("w3cStorage_get", e, key);
			return""
		}
	}, removeItem: function (key) {
		localStorage.removeItem(key)
	}, clear: function () {
		localStorage.clear()
	}, save: function () {
	}}, userDataStorage: {getItemFrom: function (key, zone) {
		if (zone == "webpager_control") {
			return this.get(this.controlNode, zone, key)
		} else if (zone == "webpager_msg") {
			return this.get(this.hisNode, zone, key)
		} else if (key == "friendbook") {
			return this.get(this.fridNode, "friendbook", key)
		} else if (key == "ubbList") {
			return this.get(this.ubbNode, "ubbList", key)
		} else {
			return this.get(this.msgNode, zone, key)
		}
	}, setItemTo: function (key, value, zone, save) {
		if (zone == "webpager_control") {
			return this.set(this.controlNode, zone, key, value, save)
		} else if (zone == "webpager_msg") {
			return this.set(this.hisNode, zone, key, value, save)
		} else if (key == "friendbook") {
			return this.set(this.fridNode, "friendbook", key, value, save)
		} else if (key == "ubbList") {
			return this.set(this.ubbNode, "ubbList", key, value, save)
		} else {
			return this.set(this.msgNode, zone, key, value, save)
		}
	}, removeItem: function (key) {
		this.msgNode.removeAttribute(key)
	}, clear: function () {
		try {
			var d = this.msgNode;
			d.load("webpager_common");
			var now = new Date;
			now = new Date(now.getTime() - 1);
			d.expires = now.toUTCString();
			d.save("webpager_common");
			var prefix = "webpager_common" + ns.getLoginUin();
			d.load(prefix);
			d.expires = now.toUTCString();
			d.save(prefix)
		} catch (e) {
			ns.reportExpt("clearStorage", e)
		}
		this.init()
	}, isAvailable: function () {
		try {
			this.msgNode.save()
		} catch (e) {
			if (e.number && Math.abs(parseInt(e.number)) == 2146827838) {
				return true
			}
			if (e.description && (e.description.indexOf("Wrong number") != -1 || e.description.indexOf("错误的参数个数") != -1)) {
				return true
			}
			if (!ns.PersistMgr._retry_flag) {
				setTimeout(function () {
					ns.PersistMgr.init()
				});
				ns.PersistMgr._retry_flag = 1
			}
			if (ns.PersistMgr._retry_flag) {
				t += "retryOnce"
			}
			ns.reportExpt("userDataCheck", e, "");
			return false
		}
	}, save: function (zone) {
		this.msgNode.save(zone)
	}, init: function () {
		this.msgNode = this.createStorgeNode();
		this.controlNode = this.createStorgeNode();
		this.hisNode = this.createStorgeNode();
		this.fridNode = this.createStorgeNode();
		this.ubbNode = this.createStorgeNode();
		if (!ns.browser.isIE) {
			ns.reportExpt("noLocalStorage", new Error("标准浏览器,怎么也选用userData实现呢???"), ns.browser.type)
		}
	}, createStorgeNode: function () {
		var n = document.createElement("input");
		n.style.display = "none";
		n.style.behavior = "url(#default#userData)";
		document.body.appendChild(n);
		return n
	}, set: function (node, name, key, value, save) {
		var t = key;
		try {
			node.setAttribute(key, value);
			node.save(name);
			if (save !== false) {
				node.save(name)
			}
		} catch (e) {
			ns.reportExpt("userData_set", e, key + "=" + value);
			return false
		}
		return true
	}, get: function (node, name, key) {
		try {
			node.load(name);
			return node.getAttribute(key)
		} catch (e) {
			ns.reportExpt("userData_get", e, name + key);
			return""
		}
	}}, flashStorage: {getItemFrom: function (key, zone) {
		return this.flash.getItem(zone + "_" + key)
	}, setItemTo: function (key, value, zone, save) {
		try {
			this.flash.setItem(zone + "_" + key, value)
		} catch (e) {
			return false
		}
		return true
	}, removeItem: function (key) {
		try {
			this.flash.removeItem(zone + "_" + key)
		} catch (e) {
			return false
		}
		return true
	}, test: function () {
		this.init()
	}, clear: function () {
	}, init: function () {
		var name = "webpager_flash_localStorage";
		var url = "http://wpi.renren.com/PObject.swf";
		var movie = document.createElement("embed");
		movie.setAttribute("id", name);
		movie.setAttribute("name", name);
		movie.setAttribute("type", "application/x-shockwave-flash");
		movie.setAttribute("src", url);
		movie.setAttribute("width", 1);
		movie.setAttribute("height", 1);
		movie.setAttribute("style", "position:absolute; right:0px; bottom:0px;");
		document.body.appendChild(movie);
		this.flash = movie
	}}};
	ns.event.enableCustomEvent(ns.PersistMgr)
}(WPC);
!function (ns) {
	var ck = ns.cookie;
	var pm = ns.PersistMgr;
	var debug = false;
	if (top.location.href.indexOf("cometbug=1") != -1) {
		debug = true
	}
	var debug_time = function () {
		var now = new Date;
		return" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
	};
	var xml = ns.xml;
	var pf = ns.Profile;
	var status403Time = 0;
	var d2 = new Date;
	d2.setMonth(0);
	d2.setDate(1);
	var week = Math.ceil(Math.ceil((new Date - d2) / (24 * 60 * 60 * 1e3)) / 7);
	var date = pm.getItemFrom("clear_cache_date", "webpager_common");
	if (date == null) {
		pm.setItemTo("clear_cache_date", week, "webpager_common")
	} else {
		if (date != week) {
			var sn = pm.getItemFrom("wp_sn_list", "webpager_common" + ns.getLoginUin());
			pm.clear();
			pm.setItemTo("wp_sn_list", sn, "webpager_common" + ns.getLoginUin());
			pm.setItemTo("clear_cache_date", week, "webpager_common")
		}
	}
	ns.Comet = {messageId: 0, connErrCnt: 0, connErrCntMax: 5, errTryCnt: 0, pollBackNum: 0, errTryCntMax: 5, connTimer: null, _xhrPoll: null, _xhrConn: null, sendQueue: [], offlineCheck: 0, connect: function () {
		var This = this;
		if (debug)console.log("开始连接服务器" + debug_time());
		if (This._xhrConn) {
			This.connAbort();
			This.abort()
		}
		This._xhrConn = new ns.net.ajax({url: "/comet_get?mid=0&r=" + Math.random() + "&ins", onSuccess: function () {
			This.connSucc()
		}, onError: function () {
			This.connError()
		}})
	}, testConnect: function () {
		var This = this;
		This._xhrConn = new ns.net.ajax({url: "/comet_get?mid=0&r=" + Math.random() + "&ins", onSuccess: function () {
			This.connSucc()
		}, onError: function () {
			This.connError()
		}})
	}, abort: function () {
		var This = this;
		if (debug)console.log("abort" + debug_time());
		This.commonAbort = true;
		if (This._xhrPoll && !This._xhrPoll.aborted) {
			This._xhrPoll.aborted = true;
			This._xhrPoll.abort()
		}
	}, connAbort: function () {
		var This = this;
		if (debug)console.log("connAbort" + debug_time());
		if (This._xhrConn) {
			This._xhrConn.aborted = true;
			This._xhrConn.abort()
		}
	}, disconnect: function () {
		var This = this;
		if (debug)console.log("disconnect" + debug_time());
		This.abort();
		return This.connState(0)
	}, connSucc: function (r) {
		var This = this;
		if (debug)console.log("connSucc" + debug_time());
		This.connState(1);
		This.errTryCnt = 0;
		This.connErrCnt = 0;
		This.doLongPoll();
		This.fireEvent("comet_connected", r)
	}, connError: function () {
		var This = this;
		if (debug)console.log("connError" + debug_time());
		This.connState(0);
		This._xhrConn = null;
		++This.connErrCnt;
		if (This.connErrCnt == This.connErrCntMax) {
			This.fireEvent("comet_connect_fail")
		} else if (This.connErrCnt > This.connErrCntMax) {
			return
		}
	}, release: function () {
		var This = this;
		if (This._xhrPoll) {
			This._xhrPoll.aborted = true;
			This._xhrPoll.abort()
		}
		if (This._xhrConn) {
			This._xhrConn.aborted = true;
			This._xhrConn.abort()
		}
		This._xhrPoll = null;
		This._xhrConn = null
	}, pollBack: function (r) {
		var This = this;
		try {
			if (r.status == 211) {
				This.release();
				This.fireEvent("comet_release");
				return
			}
			This.errTryCnt = 0;
			This._analyzePollBackMsg(r.responseText)
		} catch (e) {
			ns.reportExpt("pollBack", e, r.responseText)
		}
		This._reportAllPollBack(r.responseText);
		This.doLongPoll()
	}, _reportAllPollBack: function (str) {
		var o = xml.extractMessage(str);
		if (window.log_all) {
			try {
				var ol = o.slice(0);
				var logm, _m, _k;
				while (_m = ol.shift()) {
					logm = [];
					for (_k in _m) {
						logm.push(_k + "=" + encodeURIComponent(_m[_k]))
					}
					ns.reportLogMsg("message", logm.join("&"))
				}
			} catch (e) {
				ns.reportExpt("cometLogMsg", e, r.responseText)
			}
		}
	}, _handleOutMsg: function (_pollData) {
		var This = this;
		if (_pollData.domain == "group") {
			if (_pollData.data.type || _pollData.data.from) {
				This.fireEvent("group_handle", _pollData.data);
				return
			}
		}
		if (_pollData.domain == "chat") {
			if (_pollData.data.type || _pollData.data.latestmsgs || _pollData.data.xmlns) {
				This.fireEvent("chat_handle", _pollData.data);
				return
			}
		}
	}, _analyzePollBackMsg: function (str) {
		var This = this;
		if (debug)console.log("%c" + str, "color:green; background-color:yellow");
		var reg = /<mucmsg.*\"(\d{1,})\">(.*)<\/mucmsg>/gim;
		var more_group_reg = /<mucmsg id="\d{1,}">(.*?)<\/mucmsg>/gim;
		if (reg.test(str)) {
			function gh(s) {
				s.replace(reg, function (str, id, item) {
					var d = top.XN.json.parse(item);
					This.messageId = id;
					var _pollData = {domain: "group", data: d};
					This._handleOutMsg(_pollData);
					return str
				})
			}

			var r = str.match(more_group_reg);
			if (r.length >= 2) {
				for (var i = 0; i < r.length; i++) {
					var j = i;
					!function (j) {
						setTimeout(function () {
							gh(r[j])
						}, j * 10)
					}(j)
				}
			} else {
				gh(str)
			}
			return
		}
		var chat_reg = /<common\s?id=\"(\d{1,})\">(.*)<\/common>/gim;
		var more_chat_reg = /<common id="\d{1,}">(.*?)<\/common>/gim;
		if (chat_reg.test(str)) {
			function h(s) {
				s.replace(chat_reg, function (str, id, item) {
					var d = top.XN.json.parse(item);
					This.messageId = id;
					var domain = "chat";
					if (d.type == "mcu_retry") {
						domain = "group"
					}
					var _pollData = {domain: domain, data: d};
					This._handleOutMsg(_pollData);
					return str
				})
			}

			var r = str.match(more_chat_reg);
			if (r.length >= 2) {
				for (var i = 0; i < r.length; i++) {
					var j = i;
					!function (j) {
						setTimeout(function () {
							h(r[j])
						}, j * 10)
					}(j)
				}
			} else {
				h(str)
			}
			return
		}
		var o = xml.extractMessage(str);
		if (o.length) {
			this.messageId = o[o.length - 1].msg_id
		}
		This.fireEvent("comet_got", o)
	}, pollError: function (r) {
		var This = this;
		if (debug)console.log("pollError" + debug_time());
		if (This.errTryCnt >= This.errTryCntMax) {
			This.connState(0);
			This.fireEvent("comet_failed");
			This._xhrPoll = null;
			return
		}
		This.errTryCnt++;
		if (This.commonAbort) {
			This.commonAbort = false;
			This.fireEvent("comet_disconnected");
			This._xhrPoll = null;
			return
		}
		This.doLongPoll()
	}, doLongPoll: function () {
		if (debug)console.log("新建一个长轮询" + debug_time());
		var This = this;
		try {
			This._xhrPoll = new ns.net.ajax({url: "/comet_get?mid=" + This.messageId + "&r=" + Math.random(), onSuccess: function (r) {
				This.pollBack(r)
			}, onError: function (r) {
				This.pollError(r)
			}})
		} catch (e) {
			ns.reportExpt("doLongPoll", e)
		}
	}, connState: function (state) {
		var This = this;
		if (state !== undefined) {
			ck.set("wimconn", state);
			return true
		} else {
			var c = ck.get("wimconn");
			return c != null && c != "0"
		}
	}, send: function (str, callback, type) {
		var This = this, url = type ? "/muc_chat" : "/comet_broadcast", fn = arguments.callee;
		if (debug)console.log("%c" + str + "%c发送数据到URL" + url, "color:lime; background-color:#000", "color:white;background-color:#fff");
		new ns.net.ajax({url: url, data: str, method: "post", onSuccess: function (r) {
			if (debug)console.log("发送成功", debug_time());
			try {
				This.fireEvent("comet_send_succ");
				if (callback)callback();
				status403Time = 0
			} catch (e) {
			}
		}, onError: function (r) {
			if (debug)console.log("发送失败", debug_time());
			if (status403Time < 4) {
				if (debug)console.log("403!!! send onError" + debug_time());
				setTimeout(function () {
					status403Time++;
					fn(str, callback, type)
				}, 500);
				ns.reportExpt("cometSend", new Error("comet send error : status " + r.status), str);
				return
			}
			This.fireEvent("send_msg_faild", r);
			if (debug)console.log({r: r}, "send onError");
			ns.reportExpt("cometSend", new Error("comet send error : status " + r.status), str)
		}})
	}};
	var comet = ns.Comet;
	ns.event.enableCustomEvent(ns.Comet);
	ns.CometMgr = {id: 0, CONN_CHECK_INTERV: 2e3, CONN_INTERV_CYCLE: 60, autoReconnect: true, curCheckTime: 0, aliveCycle: 65, isLocalConn: false, lastConnState: null, userLogout: false, init: function () {
		this.bindEvent();
		this.connMonit()
	}, tryToConnect: function () {
		if (debug)console.log("tryToConnect" + debug_time());
		if (!ns.getLoginUin()) {
			return
		}
		var h = location.href;
		var This = this;
		if (!comet.connState()) {
			acquire("wimconn", function () {
				This.isLocalConn = true;
				comet.connect();
				if (comet._xhrPoll) {
				}
			}, function () {
				comet.abort();
				This.isLocalConn = false
			})
		}
	}, retryConnect: function () {
		this.isLocalConn = false;
		comet.disconnect();
		this.tryToConnect()
	}, reloadWebpager: function () {
		top.XN.user.id = ns.cookie.get("id");
		new top.XN.net.xmlhttp({url: "http://notify.renren.com/wpi/getuserinfo2.do", data: "uids=" + top.XN.user.id, method: "get", onSuccess: function (r) {
			var obj = top.XN.json.parse(r.responseText);
			if (debug)console.log(obj[top.XN.user.id], "reloadWebpager");
			top.XN.user.name = obj[top.XN.user.id].userName;
			top.XN.user.tinyPic = obj[top.XN.user.id].tiny;
			var td = top.document;
			td.getElementById("bottombar").removeChild(td.getElementById("webpager"));
			top.webpager = null;
			window.webpager = null;
			var imframe = td.getElementById("imengine");
			imframe.src = imframe.src
		}})
	}, connMonit: function () {
		if (debug)console.log("connMonit");
		var This = this;
		var uid = ns.cookie.get("id");
		if (this.getConnState() == false) {
			if (this.offlineCheck > 5) {
				this.fireEvent("check_online_status", 0)
			}
			this.offlineCheck++
		} else if (uid == null) {
			this.userLogout = true;
			this.fireEvent("check_online_status", 0)
		} else {
			if (this.userLogout) {
				this.reloadWebpager();
				this.userLogout = false
			}
			this.offlineCheck = 0;
			this.fireEvent("check_online_status", 1)
		}
		try {
			if (comet.isUnload) {
				clearTimeout(this.connTimer);
				if (!ns.browser.isIE) {
					return
				}
				var _now = new Date;
				if (_now - comet.isUnload >= 6e3) {
					comet.isUnload = 0
				} else {
					this.connTimer = setTimeout(function () {
						clearTimeout(This.connTimer);
						This.connMonit()
					}, this.CONN_CHECK_INTERV);
					return
				}
			}
			var conn = comet.connState();
			this.curCheckTime++;
			if (this.lastConnState != conn) {
				if (0 == conn) {
					this.tryToConnect();
					this.fireEvent("cometmgr_disconnected")
				} else {
					this.fireEvent("cometmgr_connected")
				}
			} else {
				if (this.autoReconnect && this.isLocalConn && this.curCheckTime == this.CONN_INTERV_CYCLE) {
					this.curCheckTime = 0;
					this.retryConnect();
					this.fireEvent("monit_cycle")
				}
				if (!this.isAlive()) {
					this.isLocalConn = false;
					comet.disconnect();
					this.tryToConnect()
				} else {
					if (this.isLocalConn && !this.isMyConn()) {
						this.isLocalConn = false;
						comet.release()
					}
				}
			}
			this.lastConnState = conn
		} catch (e) {
			ns.reportExpt("connMonit", e, ck.get("wimconn"))
		}
		this.connTimer = setTimeout(function () {
			clearTimeout(This.connTimer);
			This.connMonit()
		}, this.CONN_CHECK_INTERV)
	}, getConnState: function () {
		var state = comet.connState();
		return state
	}, bindEvent: function () {
		var This = this;
		comet.addEvent("comet_connected", function () {
			if (This.isLocalConn) {
				This.keepAlive();
				This.autoReconnect = true
			}
			while (ns.Comet.sendQueue.length > 0) {
				var sendObj = ns.Comet.sendQueue.shift();
				this.send(sendObj.m_list, sendObj.type, sendObj.callback)
			}
			This.fireEvent("cometmgr_connected")
		});
		comet.addEvent("comet_release", function () {
			This.isLocalConn = false
		});
		comet.addEvent("comet_connect_fail", function () {
			This.isLocalConn = false
		});
		comet.addEvent("comet_got", function (m) {
			This.fireEvent("comet_got", m)
		});
		comet.addEvent("group_handle", function (m) {
			This.fireEvent("group_handle", m)
		});
		comet.addEvent("chat_handle", function (m) {
			This.fireEvent("chat_handle", m)
		});
		comet.addEvent("comet_failed", function () {
			This.isLocalConn = false;
			This.autoReconnect = false;
			This.fireEvent("comet_disconnected")
		});
		comet.addEvent("comet_send_succ", function () {
			This.fireEvent("cometmgr_send_succ")
		});
		comet.addEvent("check_online_status", function (m) {
			This.fireEvent("check_online_status", m)
		});
		comet.addEvent("send_msg_faild", function (m) {
			This.fireEvent("send_msg_faild", m)
		});
		var onWindowClose = function () {
			WPC.Comet.isUnload = new Date - 0;
			if (This.isLocalConn) {
				comet.disconnect()
			}
		};
		window.onbeforeunload = onWindowClose;
		window.onunload = onWindowClose
	}, send: function (m_list, type, callback) {
		var conn = comet.connState();
		var uid = ns.cookie.get("id");
		if (!conn || uid == null) {
			if (debug)console.log(ns.Comet.sendQueue, "保存发送信息到队列");
			ns.Comet.sendQueue.push({m_list: m_list, type: type, callback: callback});
			return
		}
		if (type == "newProtocal") {
			comet.send(m_list, callback, type);
			return
		}
		comet.send(this.buildMessage(m_list, type), callback)
	}, buildMessage: function (message_list, type) {
		assert(message_list.length > 0);
		var p = {fromserver: "@talk.renren.com"};
		switch (type) {
			case"groupchat":
			{
				p.toserver = "@group.talk.renren.com";
				p.type = "groupchat";
				break
			}
			default:
			{
				p.toserver = "@talk.renren.com";
				p.type = "chat";
				break
			}
		}
		var xml = ["<sendlist>\n"];
		for (var i = 0; i < message_list.length; ++i) {
			var m = message_list[i];
			xml.push('<message type="' + p.type + '" from="');
			xml.push(m.from + p.fromserver);
			xml.push('"');
			xml.push(' to="');
			xml.push(m.to + p.toserver);
			xml.push('">\n<body>');
			xml.push(ns.xmlEncode(m.msg_content));
			xml.push("</body>\n");
			xml.push("<attachment>" + (m.attachment ? m.attachment : ""));
			xml.push("</attachment>\n");
			if (m.icode) {
				xml.push("<code>" + (m.icode ? m.icode : ""));
				xml.push("</code>\n")
			}
			xml.push("</message>\n")
		}
		xml.push("</sendlist>\n\0");
		return xml.join("")
	}, keepAlive: function () {
		this.curCheckTime = 0;
		this.id = (new Date).getTime();
		ck.set("wkl", this.id)
	}, isAlive: function () {
		var t = ck.get("wkl");
		t = parseInt(t);
		tNow = (new Date).getTime();
		if (isNaN(t)) {
			return false
		}
		if (tNow - t < this.aliveCycle * this.CONN_CHECK_INTERV) {
			return true
		} else {
			return false
		}
	}, isMyConn: function () {
		var t = ck.get("wkl");
		t = parseInt(t);
		return t = this.id
	}, connect: function () {
		this.isLocalConn = true;
		comet.connect()
	}, disconnect: function () {
		comet.disconnect()
	}};
	ns.event.enableCustomEvent(ns.CometMgr)
}(WPC);
!function (ns) {
	var pm = ns.PersistMgr;
	var cm = ns.CometMgr;
	var ck = ns.cookie;

	function analyzeMsg(richbody, from) {
		var reg_type = /<richbody.*?\stype=["|'](.*?)["|']/;
		var types = richbody.match(reg_type);
		var type = "";
		if (types != null && types.length == 2) {
			type = types[1]
		}
		var reg = /<richbody.*(localid=\"(\d{1,})\")?.*><\/richbody>/gim, lid, content, headsrc, originalsrc, audiosrc, audiotime, img_reg = /<img\s*headsrc=\"(.*?)\".*?originalsrc=\"(.*?)\".*?\/>/, localid_reg = /localid=\"(\d{1,})\"/, body_reg = /<font.*?>([.\n\w\s\W\S]*)<\/font>/, audio_reg = /<voice.*?src="*(.*?)\.spx/, audio_time_reg = /<voice.*?playtime="*(.*?)\".*\/>/, emo_reg = /<emotion>(.*)<\/emotion>/, feed2talk_reg = /<feed_to_talk(.*?)\/>/gim, businesscard_reg = /<businesscard(.*?)\/>/gim, readsecret_reg = /<richbody.*type=\"secret\".*>.*<\/richbody>/gim, group_invite = /<richbody.*type=\"invitetogroup\".*>.*<\/richbody>/gim;
		switch (type) {
			case"dialog":
				richbody.replace(body_reg, function (str, body) {
					content = body;
					return str
				});
				richbody.replace(localid_reg, function (str, localid) {
					lid = localid;
					return str
				});
				if (img_reg.test(richbody)) {
					richbody.replace(img_reg, function (str, h, o) {
						headsrc = h;
						originalsrc = o;
						content = "";
						return str
					})
				}
				if (audio_reg.test(richbody)) {
					richbody.replace(audio_reg, function (str, v) {
						audiosrc = v + ".mp3";
						var text = from == top.XN.user.id ? "发送一段语音！" : "给你发来一段语音！";
						content = text;
						richbody.replace(audio_time_reg, function (str, val) {
							audiotime = val
						});
						return str
					})
				}
				break;
			case"feed_to_talk":
				richbody.replace(feed2talk_reg, function (str, feed_to_talk) {
					content = "&lt;" + str.substr(1, str.length - 2) + "&gt;";
					return str
				});
				break;
			case"bigemj":
				if (emo_reg.test(richbody)) {
					richbody.replace(emo_reg, function (str, v) {
						content = v;
						return str
					})
				}
				break;
			case"invitetogroup":
				var group_title, group_id;
				richbody.replace(/.*group_title=\"(.*?)\".*/gim, function (txt, title) {
					group_title = title;
					return txt
				});
				richbody.replace(/.*group_id=\"(.*?)\".*/gim, function (txt, id) {
					group_id = id;
					return txt
				});
				content = "我是" + group_title + "新生群群主，邀请你加入我们。点击这里查看详细信息 http://lbsgroup.renren.com?gid=" + group_id + " 期待你的加入~~";
				break;
			case"secret":
				content = "这是一张私密照片";
				break;
			case"readsecret":
				content = "阅读了私密照片";
				break;
			case"location":
				var matches = richbody.match(/<poi.*address=[\"|'](\S*)[\"|']/);
				if (matches) {
					content = matches[1]
				}
				matches = richbody.match(/<poi.*mapurl=[\"|'](\S*)[\"|']/);
				if (matches) {
					var mapurl = matches[1];
					content += '<img width="180" src="' + mapurl + '"/>'
				}
				break;
			case"voip":
				content = "我用最新人人语音公测版给你打了一个免费电话，参加公测就有机会得话费、人人VIP等礼品。你也来加入吧：<a href='http://blog.renren.com/blog/600002246/920450701' target='_blank'>http://blog.renren.com/blog/600002246/920450701</a>";
				break;
			default:
				content = "网页版尚不支持此动态信息，可到<a href='http://mobile.renren.com' target='_blank'>mobile.renren.com</a>下载最新人人手机客户端查看";
				break
		}
		return{lid: lid, content: content, headsrc: headsrc, originalsrc: originalsrc, audiosrc: audiosrc, audiotime: audiotime}
	}

	function formatMsg(msgs) {
		if (msgs && msgs.length > 0) {
			for (var i = 0; i < msgs.length; i++) {
				var m = msgs[i];
				var amsg = analyzeMsg(m.richbody, m.from);
				if (typeof amsg.content == "undefined")amsg.content = "";
				var p = {fromuin: m.from, fromname: m.fname, touin: m.to, msg_content: amsg.content.replace(/\n/gim, "</br>").replace(/\s{2}/gim, "　　") || m.msg_content || "", timestamp: m.time, last_msgkey: m.last_msgkey || "", msgkey: m.msgkey, attachment: "", msg_headsrc: amsg.headsrc || "", msg_originalsrc: amsg.originalsrc || "", msg_audiosrc: amsg.audiosrc || "", msg_audiotime: amsg.audiotime || "", localid: m.localid || amsg.lid || +new Date, chat_tag: m.chat_tag || ""};
				msgs[i] = p
			}
		}
		return msgs
	}

	function formatGroupMsg(msgs) {
		if (msgs && msgs.length > 0) {
			for (var i = 0; i < msgs.length; i++) {
				var m = msgs[i];
				var amsg = analyzeMsg(m.richbody, m.fromid);
				if (typeof amsg.content == "undefined")return;
				var content = amsg.content.replace(/\r\n/g, "<br/>").replace(/\n/g, "<br/>").replace(/\s{2}/gim, "　　").replace(/\\/gim, "\\\\").replace(/\"/gim, '\\"');
				var p = {from: m.fromid, mfrom: m.fromid + "@talk.xiaonei.com/WTalkProxy6_0", fname: m.fname, roomid: m.groupid, mtype: "group", content: '{type:"groupchat",info:{roomid:' + m.groupid + ",userid:" + m.fromid + '},chat:"' + content + '"}', timestamp: m.time, last_msgkey: m.last_msgkey || "", msgkey: m.msgkey, attachment: "", msg_headsrc: amsg.headsrc || "", msg_originalsrc: amsg.originalsrc || "", msg_audiosrc: amsg.audiosrc || "", msg_audiotime: amsg.audiotime || "", localid: m.localid || amsg.lid || +new Date, chat_tag: m.chat_tag || ""};
				msgs[i] = p
			}
		}
		return msgs
	}

	function concatMsgs(aMsgs, bMsgs, limit) {
		var cMsgs = [];
		if (aMsgs && aMsgs.length > 0) {
			if (bMsgs && bMsgs.length > 0) {
				cMsgs = bMsgs.concat(aMsgs);
				cMsgs.sort(function (a, b) {
					if (+a.msgkey > +b.msgkey)return 1;
					if (+a.msgkey == +b.msgkey)return 0;
					if (+a.msgkey < +b.msgkey)return-1
				});
				var n = {}, r = [];
				for (var i = 0; i < cMsgs.length; i++) {
					if (!n[cMsgs[i].msgkey]) {
						n[cMsgs[i].msgkey] = true;
						r.push(cMsgs[i])
					}
				}
				cMsgs = r;
				if (cMsgs.length > limit) {
					cMsgs.splice(0, cMsgs.length - limit)
				}
				return cMsgs
			}
			return aMsgs
		}
	}

	function getHistoryMsgs(to, type) {
		type = type == "chat" ? "m_u" : "m_g";
		var tmp = pm.getItemFrom(type + to, "webpager_msg" + ns.getLoginUin());
		var msgs = tmp && tmp != "" ? ns.json.parse(tmp) : [];
		return msgs
	}

	ns.MsgMgr = {MSG_HISRY_COUNT: 32, SEQ_EXPIRE_DAYS: 10 * 365, MSG_HISRY_GROUP_COUNT: 5, MSG_HISRY_LIST_COUNT: 20, msg_list: [], zone: {2: "webpager_msg", 3: "webpager_notify"}, init: function () {
		this.bindEvent()
	}, bindEvent: function () {
		var This = this;
		var cm = ns.CometMgr;
		cm.addEvent("comet_got", function (m) {
			var log_realtime_count = 0;
			var log_nids = "";
			var len = m.length;
			for (var i = 0; i < len; i++) {
				var ret = m[i];
				if (!ret) {
					continue
				}
				var content = ret.content;
				var obj;
				try {
					obj = ns.json.parse(content)
				} catch (e) {
					obj = null
				}
				if (ret.content && ret.content.indexOf('{"show":"hidden"') != -1) {
					continue
				}
				if (ret.touin && obj && ret.touin - 0 == obj.from_id - 0) {
					log_realtime_count++;
					try {
						log_nids += ns.PersistMgr.getNid(m[i]) + ","
					} catch (e) {
					}
					continue
				}
				switch (ret.type) {
					case"chat":
					{
						This.addMsgHistory(ret);
						break
					}
					case"notify2":
					{
						This.fireEvent("realTime_got", ret);
						break
					}
					case"groupchat":
					{
						if (ret.from.indexOf("-" + ns.getLoginUin()) != -1) {
							return
						}
						This.addGroupChat(ret, len);
						break
					}
					case"spam":
					{
						This.fireEvent("spam_got", ret);
						break
					}
					default:
					{
						This.addOtherMsg(ret);
						break
					}
				}
			}
			if (log_realtime_count) {
				try {
				} catch (e) {
				}
			}
		});
		cm.addEvent("chat_handle", function (e) {
			if (e.type == "error") {
			}
			if (e.type == "sr") {
				This.fireEvent("chat_sr", e)
			} else if (e.type == "sn") {
				This.fireEvent("chat_sn", e)
			} else if (e.type == "chat_self") {
				e.chat_tag = "self";
				This.addMsgHistory(e);
				This.fireEvent("chat_message", e)
			} else if (e.type == "chat") {
				if (e.info) {
					This.fireEvent("chat_error", e);
					return
				}
				This.fireEvent("chat_message", e);
				This.addMsgHistory(e)
			} else if (e.xmlns && (e.blockvalue == 0 || e.blockvalue == 1)) {
				This.fireEvent("getStrangeInfo", e)
			} else if (e.xmlns && e.id) {
				This.fireEvent("setStrangeInfo", e)
			} else if (e.from && e.info) {
				This.fireEvent("superGroupTxt", e);
				if (e.inviterid && e.xmlns == "http://muc.talk.renren.com/user") {
					e.type = 1;
					This.fireEvent("group_inviteuser", e)
				}
			} else {
			}
		});
		cm.addEvent("group_handle", function (e) {
			if (e.type == "error") {
				var er = e.error.description;
				if (er)top.XN.DO.showMessage(er);
				This.fireEvent("group_error", e);
				return
			}
			var url_pre = "http://muc.talk.renren.com/";
			if (e.xmlns == url_pre + "create") {
				This.fireEvent("group_open", e)
			} else if (e.xmlns == url_pre + "createitem") {
				This.fireEvent("group_createitem", e)
			} else if (e.xmlns == url_pre + "items") {
				This.fireEvent("group_item", e)
			} else if (e.xmlns == url_pre + "grouplist") {
				This.fireEvent("group_list", e)
			} else if (e.xmlns == url_pre + "group") {
				This.fireEvent("group_name", e)
			} else if (e.xmlns == url_pre + "config") {
				This.fireEvent("group_config", e)
			} else if (e.xmlns == url_pre + "inviteitem") {
				This.fireEvent("group_inviteitem", e)
			} else if (e.xmlns == url_pre + "invite") {
				This.fireEvent("group_invite", e)
			} else if (e.xmlns == url_pre + "quit") {
				This.fireEvent("group_quit", e)
			} else if (e.xmlns == url_pre + "quititem") {
				This.fireEvent("group_quititem", e)
			} else if (e.inviterid && e.xmlns == url_pre + "user") {
				This.fireEvent("group_inviteuser", e)
			} else if (e.type == "sr") {
				This.fireEvent("group_sr", e)
			} else if (e.type == "info") {
				This.fireEvent("group_info", e)
			} else if (e.type == "result" && e.grouptype) {
				This.fireEvent("get_group_type", e)
			} else if (e.xmlns == url_pre + "message") {
				if (e.type == "muc_self") {
					e.chat_tag = "self"
				}
				This.addGroupMsgHistory(e);
				This.fireEvent("group_message", e)
			} else {
			}
		});
		This.addEvent("chat_sr", function (e) {
			if (!+e.msgkey) {
				This.fireEvent("chat_error", e);
				return
			}
			if (/^0\d{1,}/.test(e.local_id))return;
			var o = {from: top.XN.user.id, fname: top.XN.user.name, to: e.to, msgkey: e.msgkey, richbody: e.richbody, time: e.time, chat_tag: "self"};
			This.addMsgHistory(o)
		});
		This.addEvent("group_sr", function (e) {
			if (!+e.msgkey) {
				This.fireEvent("chat_error", e);
				return
			}
			var o = {fromid: top.XN.user.id, fname: top.XN.user.name, groupid: e.to, msgkey: e.msgkey, richbody: e.richbody, time: +new Date, chat_tag: "self"};
			This.addGroupMsgHistory(o)
		});
		cm.addEvent("cometmgr_send_succ", function () {
			This.msg_list.length = 0
		});
		pm.addEvent("storage", function (e) {
			var keys = e.keys.split(","), key;
			var temp, zone;
			for (var i = 0; i < keys.length; i++) {
				key = keys[i];
				temp = key.split(".");
				zone = temp[0];
				key = temp[1];
				if (zone != "webpager_msgs") {
					continue
				}
				var strMsg = pm.getItemFrom(key, "webpager_msgs");
				var type;
				type = This.getMsgType(strMsg);
				if (type == "group") {
					This.fireEvent("groupmsg_got", This.strToGroupChat(pm.getItemFrom(key, zone)))
				} else if (type == "notify2") {
				} else if (type == "chat") {
					var val = pm.getItemFrom(key, zone);
					var obj = This.strToMsg(val);
					This.fireEvent("message_got", obj)
				} else {
					This.fireEvent("other_got", This.str2other(pm.getItemFrom(key, zone)))
				}
			}
		})
	}, getMsgType: function (str) {
		var ary = str.split("\n");
		return ary[0]
	}, getMsgSeq: function (m) {
		var n = parseInt(ck.get(m || "wimmseq"));
		if (isNaN(n)) {
			return-1
		}
		return n >= 0 ? n : 0
	}, setMsgSeq: function (seq, m) {
		ck.set(m || "wimmseq", seq, this.SEQ_EXPIRE_DAYS)
	}, send: function (m, type, callback) {
		if (type == "newProtocal") {
			cm.send(m, type, callback);
			return
		}
		var p = {from: m.fromuin, fname: m.fromname, to: m.touin, msg_content: m.msg_content, attachment: m.attachment, icode: m.icode};
		cm.send([p], type, callback)
	}, loadMsgHistory: function (uid) {
		var t = uid.charAt(0), id = uid.substr(1);
		var cnt = this.MSG_HISRY_COUNT;
		var ret = [], m;
		var curUser = ns.getLoginUin();
		if (t == "g") {
			for (var i = 0; i < cnt; i++) {
				m = pm.getItemFrom("m" + i, "webpager_msg");
				if (!m) {
					continue
				}
				m = this.strToGroupChat(m);
				if (!m.timestamp)m.timestamp = (new Date).getTime();
				if (m.roomid == id) {
					ret.push(m)
				}
			}
		} else {
			for (var i = 0; i < cnt; i++) {
				m = pm.getItemFrom("m" + i, "webpager_msg");
				if (!m) {
					continue
				}
				m = this.strToMsg(m);
				if (!m.timestamp)m.timestamp = (new Date).getTime();
				if (m.fromuin == id && m.touin == curUser || m.fromuin == curUser && m.touin == id) {
					ret.push(m)
				}
			}
		}
		if (ret.length) {
			ret.sort(function (a, b) {
				var aa = parseInt(a.timestamp);
				var bb = parseInt(b.timestamp);
				if (aa < bb)return 1;
				if (aa > bb)return-1;
				return 0
			})
		}
		return ret
	}, msgToStr: function (obj) {
		return"chat\n" + obj.fromuin + "\n" + obj.fromname + "\n" + obj.touin + "\n" + obj.msg_content + "\n" + obj.timestamp + "\n" + (obj.attachment ? obj.attachment : "") + "\n" + obj.last_msgkey + "\n" + obj.msgkey + "\n" + obj.msg_headsrc + "\n" + obj.msg_originalsrc + "\n" + obj.msg_audiosrc + "\n" + obj.msg_audiotime + "\n" + obj.localid + "\n" + obj.chat_tag
	}, strToMsg: function (str) {
		var obj = {};
		if (!str) {
			return obj
		}
		var ary = str.split("\n");
		if (!ary)return obj;
		obj.fromuin = ary[1];
		obj.fromname = ary[2];
		obj.touin = ary[3];
		obj.msg_content = ary[4];
		obj.timestamp = ary[5];
		obj.attachment = ary[6] ? ary[6] : "";
		obj.last_msgkey = ary[7] ? ary[7] : "";
		obj.msgkey = ary[8] ? ary[8] : "";
		obj.msg_headsrc = ary[9] ? ary[9] : "";
		obj.msg_originalsrc = ary[10] ? ary[10] : "";
		obj.msg_audiosrc = ary[11] ? ary[11] : "";
		obj.msg_audiotime = ary[12] ? ary[12] : "";
		obj.localid = ary[13] ? ary[13] : "";
		obj.chat_tag = ary[14] ? ary[14] : "";
		return obj
	}, addMsgHistory: function (m) {
		var This = this;
		try {
			var p = formatMsg(new Array(m))[0];
			var targetUid = m.from == ns.getLoginUin() ? m.to : m.from;
			var tmp = pm.getItemFrom("m_u" + targetUid, "webpager_msg" + ns.getLoginUin());
			var msgs = tmp && tmp != "" ? ns.json.parse(tmp) : [];
			if (msgs && msgs.length > 0) {
				var _msg = msgs[msgs.length - 1];
				if (_msg.msgkey < m.last_msgkey) {
					This.fireEvent("chat_msg_losted", {id: targetUid, msgid: _msg.msgkey});
					var xml = ['<iq id="', targetUid, '" type="get">\n', '<query xmlns="http://chat.talk.renren.com/latestmsgs">\n', '<item id="', targetUid, '" lmax_msgid="0" count="10"/>\n', "</query>\n", "</iq>\n\0"].join("");
					This.send(xml, "newProtocal");
					return
				} else if (_msg.msgkey == m.msgkey) {
					return
				} else if (_msg.last_msgkey >= m.msgkey) {
					return
				} else {
					This.addMsgListHistory(new Array(m), targetUid)
				}
			}
			var s_m = this.msgToStr(p);
			var seq = ns.seqq.getNextSeq();
			pm.setItemTo(seq, s_m, "webpager_msgs");
			var newSeq = this.getMsgSeq() + 1;
			pm.setItemTo("m" + newSeq % this.MSG_HISRY_COUNT, s_m, "webpager_msg", true);
			this.setMsgSeq(newSeq)
		} catch (e) {
		}
	}, addMsgListHistory: function (msgs, to) {
		var This = this;
		var _oMsgs = getHistoryMsgs(to, "chat");
		var _nMsgs = concatMsgs(formatMsg(msgs), _oMsgs, This.MSG_HISRY_LIST_COUNT);
		var ms = pm.getItemFrom("ms", "webpager_msg" + ns.getLoginUin());
		ms = ms && ms != "" ? ns.json.parse(ms) : [];
		for (var i = 0; i < ms.length; i++) {
			if (ms[i] == "m_u" + to) {
				ms.splice(i, 1);
				break
			}
		}
		if (ms.length > This.MSG_HISRY_GROUP_COUNT) {
			var o = ms.shift();
			pm.removeItem(o, "webpager_msg" + ns.getLoginUin())
		}
		ms.push("m_u" + to);
		pm.setItemTo("ms", ns.json.stringify(ms), "webpager_msg" + ns.getLoginUin());
		pm.setItemTo("m_u" + to, ns.json.stringify(_nMsgs), "webpager_msg" + ns.getLoginUin())
	}, addGroupMsgHistory: function (m) {
		var This = this;
		try {
			var p = formatGroupMsg(new Array(m))[0];
			var roomid = p.roomid;
			var tmp = pm.getItemFrom("m_g" + roomid, "webpager_msg" + ns.getLoginUin());
			var msgs = tmp && tmp != "" ? ns.json.parse(tmp) : [];
			if (msgs && msgs.length > 0) {
				var _msg = msgs[msgs.length - 1];
				if (_msg.msgkey < p.last_msgkey) {
					This.fireEvent("group_msg_losted", {id: roomid, msgid: _msg.msgkey});
					var xml = ['<iq id="', roomid, '" type="get">\n', '<query xmlns="http://muc.talk.renren.com/latestmsgs">\n', '<item id="', roomid, '" lmax_msgid="0" count="10"/>\n', "</query>\n", "</iq>\n\0"].join("");
					This.send(xml, "newProtocal");
					return
				} else if (_msg.msgkey == m.msgkey) {
					return
				} else if (_msg.last_msgkey >= m.msgkey) {
					return
				} else {
					This.addGroupMsgListHistory(new Array(m), roomid)
				}
			}
			var s_r = this.groupChatToStr(p);
			var seq = ns.seqq.getNextSeq();
			pm.setItemTo(seq, s_r, "webpager_msgs");
			var newSeq = this.getMsgSeq() + 1;
			pm.setItemTo("m" + newSeq % this.MSG_HISRY_COUNT, s_r, "webpager_msg", true);
			this.setMsgSeq(newSeq)
		} catch (e) {
		}
	}, addGroupMsgListHistory: function (msgs, to) {
		var This = this;
		var _oMsgs = getHistoryMsgs(to, "group");
		var _nMsgs = concatMsgs(formatGroupMsg(msgs), _oMsgs, This.MSG_HISRY_LIST_COUNT);
		var ms = pm.getItemFrom("ms", "webpager_msg" + ns.getLoginUin());
		ms = ms && ms != "" ? ns.json.parse(ms) : [];
		for (var i = 0; i < ms.length; i++) {
			if (ms[i] == "m_g" + to) {
				ms.splice(i, 1);
				break
			}
		}
		if (ms.length > This.MSG_HISRY_GROUP_COUNT) {
			var o = ms.shift();
			pm.removeItem(o, "webpager_msg" + ns.getLoginUin())
		}
		ms.push("m_g" + to);
		pm.setItemTo("ms", ns.json.stringify(ms), "webpager_msg" + ns.getLoginUin());
		pm.setItemTo("m_g" + to, ns.json.stringify(_nMsgs), "webpager_msg" + ns.getLoginUin())
	}, addNotifyHistory: function (n) {
	}, strToRealTime: function (str) {
		var obj = {};
		if (!str) {
			return obj
		}
		var ary = str.split("\n");
		if (!ary)return obj;
		obj.type = ary[0];
		obj.touin = ary[1];
		obj.msg_id = ary[2];
		obj.content = ary[3];
		return obj
	}, realTimeToStr: function (r) {
		return r.type + "\n" + r.touin + "\n" + r.msg_id + "\n" + r.content
	}, groupChatToStr: function (r) {
		return"group\n" + r.from + "\n" + r.msgkey + "\n" + r.content + "\n" + (r.attachment ? r.attachment : "") + "\n" + r.roomid + "\n" + r.timestamp + "\n" + r.msg_headsrc + "\n" + r.msg_originalsrc + "\n" + r.msg_audiosrc + "\n" + r.msg_audiotime + "\n" + r.localid + "\n" + r.fname + "\n" + r.chat_tag
	}, strToGroupChat: function (str) {
		var obj = {};
		if (!str) {
			return obj
		}
		var ary = str.split("\n");
		if (!ary)return obj;
		obj.mtype = ary[0];
		obj.mfrom = ary[1];
		obj.msgkey = ary[2];
		obj.content = ary[3];
		obj.attachment = ary[4];
		obj.roomid = ary[5];
		obj.timestamp = ary[6];
		obj.msg_headsrc = ary[7] ? ary[7] : "";
		obj.msg_originalsrc = ary[8] ? ary[8] : "";
		obj.msg_audiosrc = ary[9] ? ary[9] : "";
		obj.msg_audiotime = ary[10] ? ary[10] : "";
		obj.localid = ary[11] ? ary[11] : +new Date;
		obj.fname = ary[12] ? ary[12] : "";
		obj.chat_tag = ary[13] ? ary[13] : "";
		return obj
	}, str2other: function (str) {
		var obj = {};
		if (!str) {
			return obj
		}
		var ary = str.split("\n");
		if (!ary)return obj;
		obj.mtype = ary[0];
		obj.from = ary[1];
		obj.touin = ary[2];
		obj.msg_id = ary[3];
		obj.content = ary[4];
		return obj
	}, other2str: function (o) {
		return o.type + "\n" + o.from + "\n" + o.to + "\n" + o.msg_id + "\n" + o.content
	}, addOtherMsg: function (o) {
		var s_o = this.other2str(o);
		var seq = ns.seqq.getNextSeq();
		pm.setItemTo(seq, s_o, "webpager_msgs")
	}, addRealTime: function (r) {
		var s_r = this.realTimeToStr(r);
		var seq = ns.seqq.getNextSeq();
		pm.setItemTo(seq, s_r, "webpager_msgs")
	}, addGroupChat: function (r, len) {
		var s_r = this.groupChatToStr(r);
		var seq = ns.seqq.getNextSeq();
		pm.setItemTo(seq, s_r, "webpager_msgs");
		var newSeq = this.getMsgSeq() + 1;
		pm.setItemTo("m" + newSeq % this.MSG_HISRY_COUNT, s_r, "webpager_msg", true);
		this.setMsgSeq(newSeq)
	}};
	ns.event.enableCustomEvent(ns.MsgMgr)
}(WPC);
!function (ns) {
	var cm = ns.CometMgr;
	var sd = ns.Sound;
	var pf = ns.Profile;
	var mm = ns.MsgMgr;
	var pm = ns.PersistMgr;
	var ck = ns.cookie;
	ns.PagerChannel = {init: function () {
		this.bindEvent()
	}, bindEvent: function () {
		var This = this;
		mm.addEvent("message_got", function (m) {
			var uid = parseInt(m.fromuin);
			if (uid >= 630000001 && uid <= 639999999) {
				switch (uid) {
					case 630000001:
					case 630000002:
					case 630000003:
						This.fireEvent("message_got", m);
						break
				}
			} else {
				This.fireEvent("message_got", m)
			}
		});
		mm.addEvent("group_open", function (m) {
			This.fireEvent("group_open", m)
		});
		mm.addEvent("group_createitem", function (m) {
			This.fireEvent("group_createitem", m)
		});
		mm.addEvent("group_item", function (m) {
			This.fireEvent("group_item", m)
		});
		mm.addEvent("group_list", function (m) {
			This.fireEvent("group_list", m)
		});
		mm.addEvent("group_name", function (m) {
			This.fireEvent("group_name", m)
		});
		mm.addEvent("group_config", function (m) {
			This.fireEvent("group_config", m)
		});
		mm.addEvent("group_invite", function (m) {
			This.fireEvent("group_invite", m)
		});
		mm.addEvent("group_inviteitem", function (m) {
			This.fireEvent("group_inviteitem", m)
		});
		mm.addEvent("group_quit", function (m) {
			This.fireEvent("group_quit", m)
		});
		mm.addEvent("group_quititem", function (m) {
			This.fireEvent("group_quititem", m)
		});
		mm.addEvent("group_message", function (m) {
			This.fireEvent("group_message", m)
		});
		mm.addEvent("group_sr", function (m) {
			This.fireEvent("group_sr", m)
		});
		mm.addEvent("group_error", function (m) {
			This.fireEvent("group_error", m)
		});
		mm.addEvent("group_inviteuser", function (m) {
			This.fireEvent("group_inviteuser", m)
		});
		mm.addEvent("chat_message", function (m) {
			This.fireEvent("chat_message", m)
		});
		mm.addEvent("group_latestmsgs", function (m) {
			This.fireEvent("group_latestmsgs", m)
		});
		mm.addEvent("group_msg_losted", function (m) {
			This.fireEvent("group_msg_losted", m)
		});
		mm.addEvent("group_info", function (m) {
			This.fireEvent("group_info", m)
		});
		mm.addEvent("chat_sr", function (m) {
			This.fireEvent("chat_sr", m)
		});
		mm.addEvent("chat_sn", function (m) {
			This.fireEvent("chat_sn", m)
		});
		mm.addEvent("chat_self", function (m) {
			This.fireEvent("chat_self", m)
		});
		mm.addEvent("chat_error", function (m) {
			This.fireEvent("chat_error", m)
		});
		mm.addEvent("chat_msg_losted", function (m) {
			This.fireEvent("chat_msg_losted", m)
		});
		mm.addEvent("getStrangeInfo", function (m) {
			This.fireEvent("getStrangeInfo", m)
		});
		mm.addEvent("setStrangeInfo", function (m) {
			This.fireEvent("setStrangeInfo", m)
		});
		mm.addEvent("superGroupTxt", function (m) {
			This.fireEvent("superGroupTxt", m)
		});
		mm.addEvent("get_group_type", function (m) {
			This.fireEvent("get_group_type", m)
		});
		mm.addEvent("realTime_got", function (r) {
			r.timestamp = (new Date).getTime();
			r.type = 56;
			This.fireEvent("realTime_got", r)
		});
		mm.addEvent("groupmsg_got", function (gc) {
			This.fireEvent("groupmsg_got", gc)
		});
		mm.addEvent("other_got", function (other) {
			This.fireEvent("other_got", other)
		});
		mm.addEvent("spam_got", function (spam) {
			This.fireEvent("spam_got", spam)
		});
		cm.addEvent("cometmgr_connected", function () {
			try {
				top.$msg_proxy && top.$msg_proxy.onConnected()
			} catch (e) {
			}
		});
		cm.addEvent("cometmgr_disconnected", function () {
			try {
				top.$msg_proxy && top.$msg_proxy.onDisconnected();
				This.fireEvent("channel_disconnected")
			} catch (e) {
			}
		});
		pm.addEvent("storage", function (e) {
			This.fireEvent("storage", e)
		});
		cm.addEvent("check_online_status", function (m) {
			This.fireEvent("check_online_status", m)
		});
		cm.addEvent("send_msg_faild", function (m) {
			This.fireEvent("send_msg_faild", m)
		})
	}, checkPlugin: function (name, xname) {
		var plugins = window.navigator.plugins;
		if (!plugins || window.ActiveXObject) {
			try {
				var o = new ActiveXObject(xname);
				if (o) {
					return true
				}
			} catch (e) {
				return false
			}
		} else {
			var list = [];
			var l = plugins.length;
			for (var i = 0; i < l; i++) {
				if (plugins[i].name.indexOf(name) >= 0)return true
			}
			return false
		}
		throw new Error(" 暂时不支持的浏览器 ");
		return false
	}, startIM: function () {
		var renren = document.domain.indexOf("renren.com") != -1;
		var g = top.XN.cookie.get;
		var ret = false, plugin;
		if (!g("id") || !g("t") || !g("xnsid") || !renren) {
			top.webpager.fireEvent("im_start_over", ret);
			return
		}
		try {
			if (this.checkPlugin("npxntalk", "renren.Renren.1")) {
				top.webpager.IMInstalled = true;
				if (window.ActiveXObject) {
					plugin = new ActiveXObject("renren.Renren.1");
					var ret = plugin.IfNeedStart("xntalk");
					if (ret == true) {
						if (plugin.StartUp("xntalk") == false) {
							ret = ns.startXnclient()
						} else {
							ret = true
						}
					}
				} else {
					plugin = document.createElement("embed");
					plugin.type = "application/xntalk-plugin";
					document.body.appendChild(plugin);
					ret = !!plugin.IfNeedStart("xntalk");
					if (ret) {
						ret = plugin.StartUp("xntalk")
					}
				}
			} else {
				ret = ns.startXnclient()
			}
		} catch (e) {
			ret = ns.startXnclient()
		}
		top.webpager.fireEvent("im_start_over", ret)
	}, sendMessage: function (e, type, callback) {
		mm.send(e, type, callback)
	}, getMessageHistory: function (uid) {
		var a = mm.loadMsgHistory(uid);
		return a
	}, enableConn: function (b) {
		if (b) {
			pf.setUseIm(true, true)
		} else {
			pf.setUseIm(false, true)
		}
	}, isLocalConnect: function () {
		return cm.isLocalConn
	}, showRealTime: function (ugc_content) {
		mm.addRealTime({content: ugc_content, type: "notify2", touin: ns.getLoginUin(), msg_id: mm.messageId})
	}, setItem: function (key, value, forAll, noEvent) {
		setTimeout(function () {
			return pm.setItemTo(key, value, "webpager_common" + (forAll ? "" : ns.getLoginUin()), noEvent)
		}, 0)
	}, getItem: function (key, forAll) {
		return pm.getItemFrom(key, "webpager_common" + (forAll ? "" : ns.getLoginUin()))
	}, showGroupChat: function (m) {
	}, getConnState: function () {
		return cm.getConnState()
	}, setPlaySound: function (b) {
		return pf.setPlaySound(b, true)
	}, getShowPager: function () {
		return true
	}, notificationRequest: function (callback) {
		window.webkitNotifications.requestPermission(function () {
			var p = window.webkitNotifications.checkPermission();
			callback(p)
		})
	}, notificationShow: function (obj) {
		if (!window.webkitNotifications.checkPermission()) {
			var ntc;
			ntc = window.webkitNotifications.createNotification(obj.head, obj.name, obj.content);
			ntc.show();
			ntc.onclick = function () {
				top.focus();
				this.cancel();
				try {
					obj.callback()
				} catch (e) {
				}
			};
			setTimeout(function () {
				ntc.cancel()
			}, 8e3)
		}
	}, notificationPermission: function () {
		return window.webkitNotifications.checkPermission()
	}};
	ns.event.enableCustomEvent(ns.PagerChannel);
	document.domain = "renren.com";
	top.webpager = WPC.PagerChannel
}(WPC);
!function (ns) {
	if (!top.document.head) {
		top.document.head = top.document.getElementsByTagName("head")[0];
		document.head = document.getElementsByTagName("head")[0]
	}
	function loadCSS(url, callback) {
		var link = top.document.createElement("link");
		link.href = url;
		link.rel = "stylesheet";
		top.document.head.appendChild(link);
		var flag = top.document.createElement("div");
		flag.id = "webpager_css_loading";
		var getStyle = function (name) {
			if (flag.currentStyle) {
				return flag.currentStyle[name]
			} else {
				return flag.ownerDocument.defaultView.getComputedStyle(flag, null)[name]
			}
		};
		top.document.body.appendChild(flag);
		var _timer;
		var _start = new Date;
		!function () {
			var _recall = arguments.callee;
			if ("none" === getStyle("display")) {
				clearTimeout(_timer);
				top.document.body.removeChild(flag);
				callback()
			} else {
				if (new Date - _start < 5e3) {
					_timer = setTimeout(_recall, 100)
				} else {
					ns.reportExpt("loadCSS", new Error("loadCSS timeout 5s"), "样式可能没加载成功")
				}
			}
		}()
	}

	function pagerChannelIsOk(object, XN) {
		if (XN.disableWebpager)return;
		var initing = 0;
		var url = "http://s.xnimg.cn/" + cssVer + "/webpager/webpager-all-min.css";
		try {
			loadCSS(url, initUI)
		} catch (e) {
			throw e;
			XN.loadFile(url)
		}
		setTimeout(initUI, 5e3);
		var ls = document.head.getElementsByTagName("script");
		var l;
		while (ls.length) {
			l = top.document.createElement("script");
			l.setAttribute("data-src", ls[0].getAttribute("data-src"));
			l.setAttribute("data-module", ls[0].getAttribute("data-module"));
			top.document.head.appendChild(l);
			document.body.appendChild(ls[0])
		}
		function initUI() {
			if (initing >= 1)return;
			try {
				initing = 1;
				setTimeout(function () {
					object.use("webpager/im", function () {
						initing = 2
					})
				}, 500)
			} catch (e) {
				initing = -1;
				throw e
			}
		}
	}

	top.webpager && top.webpager.addEvent("im_start_over", function (imRunning) {
		top.webpager.imRunning = imRunning;
		top.webpager.storageOk = ns.PersistMgr.init();
		ns.CometMgr.init();
		ns.MsgMgr.init();
		ns.PagerChannel.init();
		if (top.webpagerLoader) {
			top.webpagerLoader.fireEvent("channel_ok", uiVer)
		}
		if (top && top.XN) {
			pagerChannelIsOk(top.object, top.XN)
		}
	});
	var vid_key = "vid";
	var ruid;
	var ck = ns.cookie;
	var cid = ck.get("id");
	var vid = ck.get(vid_key);
	if (vid && vid == cid) {
	} else {
		try {
			ruid = top.XN.user.ruid
		} catch (e) {
		}
		if (cid && ruid && ruid != cid) {
			vid = cid;
			ck.set(vid_key, vid)
		} else {
			vid = null
		}
	}
	if (vid && parseInt(vid) > 2e9) {
		try {
			var sb = top.XN.smartyBuddy;
			if (sb.frameLayout()) {
				sb.frameLayout(0);
				sb.noLoading();
				sb.saveStat(0)
			}
		} catch (e) {
		}
		return
	}
	if (top.document.getElementById("webpager")) {
		ns.reportExpt("channel_iframe_reload", new Error("莫名其妙的重载了ime.htm"), navigator.userAgent);
		return
	}
	top.webpager.startIM()
}(WPC);
var _comet_conn_state = 0;
!function () {
	var s = WPC.Comet.connState();
	if (!WPC.CometMgr.isAlive()) {
		setTimeout(function () {
			if (!WPC.CometMgr.isAlive())WPC.reportExpt("cometAlive", new Error("not alive but no one retry!"), navigator.userAgent)
		}, 3e4)
	}
	if (!_comet_conn_state && !s) {
		WPC.reportExpt("cometState", new Error("超过三分钟没有人连接"), navigator.userAgent);
		return
	}
	_comet_conn_state = s;
	setTimeout(arguments.callee, 18e4)
}();