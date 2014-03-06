XN.namespace("ui.schoolSelector");
XN.ui.schoolSelector.idReg = /(\d*)$/;
XN.ui.schoolSelector.quRegx = /(city_qu_\d+)/;
XN.ui.schoolSelector.hidePanCallback;
XN.ui.schoolSelector.multiple = false;
var unescapeHTML = function (_1) {
	var n = document.createElement("div");
	n.innerHTML = _1;
	if (XN.browser.IE) {
		return n.innerText;
	} else {
		return n.textContent;
	}
};
XN.ui.schoolSelector.init = function (_2, _3) {
	XN.ui.schoolSelector.multiple = !!_3;
	this.options = {callback: new Function(), context: document};
	if (arguments[0] && arguments[0].constructor == Function) {
		this.options.callback = arguments[0];
	} else {
		if (arguments[0] && arguments[0].constructor == Object) {
			extendObject(this.options, arguments[0]);
		}
	}
	this.pageConf(this.options.callback);
	this.univ.init();
	this.sch.init();
	var _4 = this;
	var _5 = Sizzle(".s-select", this.options.context);
	for (var i = 0; i < _5.length; i++) {
		if (_5[i].inited) {
			continue;
		}
		(function (_6) {
			var _7 = _5[_6];
			_7.inited = true;
			if (XN.ui.schoolSelector.multiple) {
				var _8 = Sizzle("[data-dept-unique=" + _7.getAttribute("data-unique") + "]", _4.options.context)[0];
				var _9 = Sizzle("[data-id-unique=" + _7.getAttribute("data-unique") + "]", _4.options.context)[0] && Sizzle("[data-id-unique=" + _7.getAttribute("data-unique") + "]", _4.options.context)[0].value;
				if (_8 && _9 && Number(_9) != 0) {
					_4.univ.fillUniversityDept(_9, _8, function () {
						XN.ui.schoolSelector.selectByValue(_8, _8.getAttribute("title"));
					});
				}
			} else {
				var _8 = Sizzle("#" + _7.id + "_dept", _4.options.context)[0];
				var _9 = Sizzle("#" + _7.id + "_id", _4.options.context)[0] && Sizzle("#" + _7.id + "_id", _4.options.context)[0].value;
				if (_8 && _9 && Number(_9) != 0) {
					_4.univ.fillUniversityDept(_9, _8, function () {
						XN.ui.schoolSelector.selectByValue(_8, _8.getAttribute("title"));
					});
				}
			}
			var _a = (_7.tagName == "INPUT" || _7.tagName == "TEXTAREA") ? "onfocus" : "onclick";
			_7[_a] = function () {
				this.blur();
				_4.curCom = this;
				var _b = /(s-univ|s-tech|s-junior|s-high)/.exec(this.className);
				_b[1] ? _4.showpan(_b[1]) : _4.showpan();
				return false;
			};
		})(i);
	}
	this.initialized = true;
};
XN.ui.schoolSelector.pageConf = function (fn) {
	if (typeof fn == "function") {
		if (!this.callbacks) {
			this.callbacks = [];
		}
		this.callbacks.push(fn);
		return;
	}
	for (param in fn) {
		this[param] = fn[param];
	}
};
XN.event.enableCustomEvent(XN.ui.schoolSelector);
XN.ui.schoolSelector.showpan = function (_c, _d, _e) {
	this.notShowPan = false;
	this.fireEvent("beforeShowPan");
	if (this.notShow) {
		return false;
	}
	_c = _c || "s-univ";
	this.type = _c;
	XN.debug.log("click...");
	this.curCom = this.curCom || {};
	var _f = this;
	switch (_c) {
		case "s-univ":
			XN.debug.log("showing s-univ panel...");
			XN.ui.schoolSelector.univ.showpan(_d, _e);
			break;
		case "s-high":
			XN.debug.log("showing s-high panel...");
			XN.loadFile("http://s.xnimg.cn/js/cityArray.js", function () {
				_f.sch.show(_f.sch.HIGH_SCHOOL, _f.curCom.id, "code", _e);
			});
			break;
		case "s-tech":
			XN.debug.log("showing s-tech panel...");
			XN.loadFile("http://s.xnimg.cn/js/cityArray.js", function () {
				_f.sch.show(_f.sch.COLLEGE_SCHOOL, _f.curCom.id, "code", _e);
			});
			break;
		case "s-junior":
			XN.debug.log("showing s-junior panel...");
			XN.loadFile("http://s.xnimg.cn/js/cityArray.js", function () {
				_f.sch.show(_f.sch.JUNIOR_SCHOOL, _f.curCom.id, "code", _e);
			});
			break;
	}
};
XN.ui.schoolSelector.hidepan = function () {
	if (this.hidePanCallback && this.hidePanCallback.length) {
		var i = 0;
		for (; i < this.hidePanCallback.length; i++) {
			if (this.hidePanCallback[i].call(this) === false) {
				return;
			}
		}
	}
	switch (this.type) {
		case "s-univ":
			try {
				XN.ui.schoolSelector._popUpLayer.hide();
			}
			catch (e) {
			}
			break;
		case "s-high":
		case "s-tech":
		case "s-junior":
			XN.ui.schoolSelector.sch.hide();
			break;
	}
};
XN.ui.schoolSelector.closeConf = function (fn) {
	if (!this.hidePanCallback) {
		this.hidePanCallback = [];
	}
	if (typeof fn == "function") {
		this.hidePanCallback.push(fn);
	}
};
XN.ui.schoolSelector.getResult = function (ele) {
	if (XN.ui.schoolSelector.curCom) {
		try {
			XN.ui.schoolSelector.curCom.value = unescapeHTML(ele.innerHTML);
		}
		catch (e) {
		}
	}
	if (XN.ui.schoolSelector.callbacks.length) {
		var j = 0;
		var cb = this.callbacks;
		for (; j < this.callbacks.length; j++) {
			if (cb[j].call(XN.ui.schoolSelector, XN.ui.schoolSelector.curCom, ele) === false) {
				return false;
			}
		}
	}
	XN.ui.schoolSelector.hidepan();
	return false;
};
XN.ui.schoolSelector.selectByValue = function (_10, _11) {
	setTimeout(function () {
		var _12 = _10.options;
		for (var i = 0; i < _12.length; i++) {
			if (_12[i].value == _11 || XN.String.trim(_12[i].innerHTML) == XN.String.trim(_11)) {
				_10.selectedIndex = i;
				break;
			}
		}
	}, 0);
};
XN.ui.schoolSelector.univ = {init: function () {
	if (XN.ui.schoolSelector.initialized) {
		return;
	}
	window.SchoolComponent = {};
	window.SchoolComponent.tihuan = function () {
	};
	var _13 = document.createElement("div");
	_13.id = "univlist";
	_13.style.position = "static";
	var _14 = document.createElement("div");
	var _15 = document.createElement("p");
	_15.id = "filter_univ";
	_15.innerHTML = ["<label for=\"school_search_input\">", "搜索 : ", "</label>", "<input class=\"input-text\" id=\"school_search_input\" type=\"text\" />"].join("");
	var _16 = _15.getElementsByTagName("input")[0];
	var ds = new XN.util.DS_JSON({rootKey: "candidate", queryParam: "p", method: "post", url: "http://friend." + XN.env.domain + "/newselector"});
	var at = new XN.ui.autoCompleteMenu({DS: ds, input: _16});
	at.buildMenu = function (r) {
		return "<p>" + r.name.replace(/(^\s*)|(\s*$)/g, "") + "</p>";
	};
	at.addEvent("select", function (r) {
		var el = document.createElement("a");
		el.href = r.id;
		el.innerHTML = r.name.replace(/(^\s*)|(\s*$)/g, "");
		XN.ui.schoolSelector.getResult(el);
		this.input.value = "";
	});
	XN.event.addEvent(_16, "focus", function () {
		XN.event.delEvent(_16, "focus", arguments.callee);
		at.setMenuWidth(_16.offsetWidth);
	});
	_14.appendChild(_15);
	var _17 = document.createElement("ul");
	_17.id = "popup-country";
	var _18 = [
		{code: "0", name: "中国"},
		{code: "7", name: "美国"},
		{code: "6", name: "加拿大"},
		{code: "5", name: "英国"},
		{code: "1", name: "澳大利亚"},
		{code: "2", name: "法国"},
		{code: "8", name: "德国"},
		{code: "4", name: "新西兰"},
		{code: "3", name: "新加坡"},
		{code: "9", name: "韩国"},
		{code: "10", name: "俄罗斯"},
		{code: "11", name: "日本"},
		{code: "12", name: "意大利"},
		{code: "13", name: "爱尔兰"},
		{code: "14", name: "荷兰"},
		{code: "15", name: "马来西亚"},
		{code: "16", name: "瑞士"},
		{code: "17", name: "泰国"},
		{code: "18", name: "乌克兰"},
		{code: "19", name: "南非"},
		{code: "20", name: "芬兰"},
		{code: "21", name: "瑞典"},
		{code: "22", name: "西班牙"},
		{code: "23", name: "比利时"},
		{code: "24", name: "挪威"},
		{code: "25", name: "丹麦"},
		{code: "26", name: "菲律宾"},
		{code: "27", name: "波兰"},
		{code: "28", name: "印度"},
		{code: "29", name: "奥地利"}
	];
	var i = 0;
	var tmp;
	var _19;
	var _1a = this;
	for (; i < _18.length; i++) {
		tmp = document.createElement("a");
		tmp.innerHTML = _18[i].name;
		(function (_1b) {
			tmp.onclick = function () {
				_1a.univtabs.changeCountry(_18[_1b].code);
			};
		})(i);
		_19 = document.createElement("li");
		_19.id = "c_" + _18[i].code;
		_19.appendChild(tmp);
		tmp.onfocus = function () {
			this.blur();
		};
		_17.appendChild(_19);
	}
	var _1c = document.createElement("ul");
	_1c.id = "popup-province";
	var _1d = document.createElement("ul");
	_1d.id = "popup-unis";
	_14.appendChild(_17);
	_14.appendChild(_1c);
	_14.appendChild(_1d);
	_13.appendChild(_14);
	var _1e = {type: "normal", title: "选择学校", width: XN.ui.schoolSelector.panelWidth || 646, button: "关闭", callBack: XN.func.empty, autoHide: 0, msg: $(_13), params: {addIframe: true}};
	if (XN.ui.schoolSelector.offsetY) {
		_1e.Y = XN.ui.schoolSelector.offsetY;
	}
	if (XN.ui.schoolSelector.offsetX) {
		_1e.X = XN.ui.schoolSelector.offsetX;
	}
	XN.ui.schoolSelector._popUpLayer = new XN.ui.dialog(_1e.params).setType(_1e.type).setTitle(_1e.title || (_1e.type == "error" ? "错误提示" : "提示")).setBody(_1e.msg || _1e.message || "").setWidth(_1e.width).setHeight(_1e.height).setX(_1e.X).setY(_1e.Y || 100).addButton({text: (_1e.yes || _1e.button), onclick: function () {
		return XN.ui.schoolSelector.hidepan();
	}}).show();
	XN.ui.schoolSelector._popUpLayer.hide();
	this.univtabs.init();
}, showpan: function (cid, pid) {
	var _1f = this;
	XN.loadFile("http://s.xnimg.cn/allunivlist.js", function () {
		_1f.univtabs.changeCountry(cid || 0, pid);
		_1f.showpan_sub();
	});
}, showpan_sub: function () {
	XN.ui.schoolSelector._popUpLayer.setY(100 + XN.event.scrollTop()).show();
	this.bodyclick = false;
}, findPosX: function (obj) {
	var pW = XN.Event.winWidth();
	var oW = parseInt(obj.getStyle("width"));
	return XN.EVENT.scrollLeft() + (pW - oW) / 2;
}, findPosY: function (obj) {
	var pH = XN.Event.winHeight();
	var oH = obj.offsetHeight;
	return XN.EVENT.scrollTop() + (pH - oH) / 3;
}, hidepan: function () {
}, getResult: function (ele) {
}, collegeDeptCache: {}, fillUniversityDept: function (_20, _21, fn) {
	if (typeof (_20) == "undefined" || _20 == "") {
		return;
	}
	var _22 = this;

	function _23(_24) {
		var url = "http://www." + XN.env.domain + "/GetDep.do";
		if (XN.DEBUG_MODE) {
			url = "http://test.renren.com/jspro/GetDep.html";
		}
		var _25 = "id=" + _24;
		XN.debug.log("Getting school list from url " + url + "(" + _25 + ")");
		if (_22.collegeDeptCache[_24]) {
			_26(_22.collegeDeptCache[_24]);
		} else {
			new XN.net.xmlhttp({url: url, method: "get", data: _25, onSuccess: function (_27) {
				_22.collegeDeptCache[_24] = _27;
				_26(_27);
			}});
		}
	};
	function _26(_28) {
		var _29 = document.createElement("div");
		_29.innerHTML = _28.responseText;
		var _2a = Sizzle("select", _29)[0];
		if (_2a) {
			var _2b = (_21);
			_2b.length = 0;
			while (_2a.firstChild) {
				_2b.appendChild(_2a.firstChild);
			}
			setTimeout(function () {
				_2b.selectedIndex = 0;
			}, 0);
		}
		if (fn && fn.constructor == Function) {
			fn.call(_22);
		}
	};
	_23(_20);
}};
XN.ui.schoolSelector.univ.univtabs = {init: function () {
	this.tabCount = 0;
	this.activeCountryTab = null;
	this.activeProvTab = null;
}, mouseIn: function () {
}, mouseOut: function () {
}, changeCountry: function (cid, pid) {
	var _2c = null;
	var _2d = null;
	var _2e = "";
	var _2f = parseInt(cid);
	for (var i = 0; i < allUnivList.length; i++) {
		_2c = allUnivList[i];
		if (i == _2f) {
			break;
		}
	}
	if (_2c != null) {
		_2d = _2c.provs;
		if (_2d != null && _2d != "") {
			for (var j = 0; j < _2d.length; j++) {
				if (j == 0) {
					_2e += "<li id=\"p_" + parseInt(_2c.id) + "_" + parseInt(_2d[j].id) + "\" class=\"active\"><a onclick=\"javascript:XN.ui.schoolSelector.univ.univtabs.changeUnivs(" + cid + "," + _2d[j].id + ")\">" + _2d[j].name + "</a></li>";
					this.activeProvTab = "p_" + parseInt(_2c.id) + "_" + parseInt(_2d[j].id);
				} else {
					_2e += "<li id=\"p_" + parseInt(_2c.id) + "_" + parseInt(_2d[j].id) + "\" ><a  onclick=\"javascript:XN.ui.schoolSelector.univ.univtabs.changeUnivs(" + cid + "," + _2d[j].id + ")\">" + _2d[j].name + "</a></li>";
				}
			}
		} else {
			this.changeUnivs(cid, -1);
		}
	} else {
		alert("此地区不存在");
	}
	$("popup-province").innerHTML = _2e;
	this.changeUnivs(cid, pid || -2);
}, makeUnivHref: function (uid, _30) {
	var _31 = document.URL;
	var _32 = true;
	if (_31.indexOf("reg." + XN.env.domain + "") >= 0 || _31.indexOf("guide." + XN.env.domain + "") >= 0 || (_31.indexOf("abc." + XN.env.domain + "") >= 0 && _31.indexOf("KnowEmailVoteReg.action") >= 0)) {
		_32 = false;
	}
	var _33 = "";
	if (_32) {
		_33 = "<a id=\"sch_" + uid + "\" href=\"" + uid + "\" onclick=\"return XN.ui.schoolSelector.getResult(this);\" >" + _30 + "</a>";
	} else {
		_33 = "<a id=\"sch_" + uid + "\" href=\"" + uid + "\" onclick=\"return XN.ui.schoolSelector.getResult(this);\" >" + _30 + "</a>";
	}
	return _33;
}, changeUnivs: function (cid, pid) {
	if (!window.allUnivList) {
		var _34 = this;
		XN.loadFile("http://s.xnimg.cn/allunivlist.js", function () {
			_34.changeUnivs(cid, pid);
		});
		return false;
	}
	var _35 = $("c_" + parseInt(cid));
	if (_35 && _35 != this.activeCountryTab) {
		_35.addClass("active");
		if (this.activeCountryTab) {
			$(this.activeCountryTab).delClass("active");
		}
		this.activeCountryTab = _35;
	}
	var _36 = $("p_" + parseInt(cid) + "_" + parseInt(pid));
	if (_36) {
		_36.addClass("active");
		if (this.activeProvTab) {
			$(this.activeProvTab).delClass("active");
		}
		this.activeProvTab = _36;
	}
	var _37 = null;
	var _38 = "";
	for (var i = 0; i < allUnivList.length; i++) {
		_37 = allUnivList[i];
		if (parseInt(cid) == i) {
			break;
		}
	}
	if (parseInt(pid) == -2) {
		pid = "1";
	}
	if (_37.provs != null && _37.provs != "") {
		var _39 = null;
		for (var j = 0; j < _37.provs.length + 1; j++) {
			_39 = _37.provs[j - 1];
			if (parseInt(pid) == j) {
				break;
			}
		}
		for (var k = 0; k < _39.univs.length; k++) {
			_38 += "<li id=\"u_" + parseInt(_39.univs[k].id) + "\">" + this.makeUnivHref(_39.univs[k].id, _39.univs[k].name) + "</li>";
		}
	} else {
		var _3a = _37.univs;
		if (_3a != null) {
			for (var l = 0; l < _3a.length; l++) {
				_38 += "<li id=\"" + _3a[l].id + "\">" + this.makeUnivHref(_3a[l].id, _3a[l].name) + "</li>";
			}
		}
	}
	$("popup-unis").innerHTML = _38;
}, hidepan: function () {
}};
XN.ui.schoolSelector.sch = {HIGH_SCHOOL: "highschool", OPEN_HIGH_SCHOOL: "openhighschool", COLLEGE_SCHOOL: "collegeschool", JUNIOR_SCHOOL: "juniorschool", provId: 1, type: "", schoolNameElementId: "", schoolCodeElementId: "", init: function () {
	if (XN.ui.schoolSelector.initialized) {
		return;
	}
	var _3b = [
		{code: 1, name: "北京"},
		{code: 2, name: "上海"},
		{code: 3, name: "天津"},
		{code: 4, name: "重庆"},
		{code: 5, name: "黑龙江"},
		{code: 6, name: "吉林"},
		{code: 7, name: "辽宁"},
		{code: 8, name: "山东"},
		{code: 9, name: "山西"},
		{code: 10, name: "陕西"},
		{code: 11, name: "河北"},
		{code: 12, name: "河南"},
		{code: 13, name: "湖北"},
		{code: 14, name: "湖南"},
		{code: 15, name: "海南"},
		{code: 16, name: "江苏"},
		{code: 17, name: "江西"},
		{code: 18, name: "广东"},
		{code: 19, name: "广西"},
		{code: 20, name: "云南"},
		{code: 21, name: "贵州"},
		{code: 22, name: "四川"},
		{code: 23, name: "内蒙古"},
		{code: 24, name: "宁夏"},
		{code: 25, name: "甘肃"},
		{code: 26, name: "青海"},
		{code: 27, name: "西藏"},
		{code: 28, name: "新疆"},
		{code: 29, name: "安徽"},
		{code: 30, name: "浙江"},
		{code: 31, name: "福建"},
		{code: 33, name: "香港"},
		{code: 36, name: "海外"}
	];
	var _3c = document.createElement("div");
	_3c.id = "schoolList";
	_3c.style.width = "600px";
	var _3d = document.createElement("div");
	var _3e = document.createElement("ul");
	_3e.id = "popup-province";
	_3e.style.marginBottom = "5px";
	var _3f = document.createDocumentFragment();
	var _40;
	var _41;
	var _42 = this;
	for (var i = 0; i < _3b.length; i++) {
		_40 = document.createElement("li");
		if (_3b[i].code == 5 || _3b[i].code == 23) {
			_40.style.width = "40px";
		}
		_41 = document.createElement("a");
		_41.innerHTML = _3b[i].name;
		(function (_43) {
			_40.id = "p_" + _3b[_43].code;
			_41.onclick = function (e) {
				_42.changeProv(_3b[_43].code + "");
				return false;
			};
		})(i);
		_41.onfocus = function () {
			this.blur();
		};
		_40.appendChild(_41);
		_3f.appendChild(_40);
	}
	_3e.appendChild(_3f);
	var _44 = document.createElement("ul");
	_44.id = "popup-city";
	_44.className = "module-popupcity";
	var _45 = document.createElement("div");
	_45.id = "schoolTabPan";
	_45.className = "clear";
	var _46 = document.createElement("div");
	_46.id = "filterHighSchool";
	_46.style.padding = "5px";
	_46.style.border = "1px solid #C3C3C3";
	_46.style.borderBottom = "none";
	_46.innerHTML = "在<strong id=\"highschoolArea\">***</strong>的学校中搜索：<input type=\"text\" class=\"input-text\" />";
	var _47 = document.createElement("ul");
	_47.id = "schoolListContentUl";
	_47.className = "module-schoollist";
	_3d.appendChild(_3e);
	_3d.appendChild(_44);
	_3d.appendChild(_45);
	_3d.appendChild(_46);
	_3d.appendChild(_47);
	_3c.appendChild(_3d);
	this.fix = new XN.ui.dialog().setTitle("选择学校").setBody($(_3c)).setWidth(XN.ui.schoolSelector.panelWidth_high || XN.ui.schoolSelector.panelWidth || 646).addButton({text: "关闭", onclick: function () {
		XN.ui.schoolSelector.hidepan();
	}});
	this.fix.setY(100);
	this.fix.container.onclick = function (e) {
		try {
			e = e || window.event;
			XN.event.stop(e);
		}
		catch (ex) {
		}
	};
	this.fix.hide();
}, show: function (_48, _49, _4a, pid) {
	this.type = _48;
	this.schoolNameElementId = _49;
	this.schoolCodeElementId = _4a;
	try {
		if (typeof (selectElList) != "undefined") {
			for (var i = 0; i < selectElList.length; i++) {
				selectElList[i].style.display = "none";
			}
		}
	}
	catch (e) {
	}
	$ = ge;
	if (!this.fix) {
		this.fix = new XN.UI.fixPositionElement({id: "schoolList"});
	}
	var el = this.fix;
	el.setY(100 + XN.event.scrollTop());
	el.show();
	this.changeProv(pid || this.provId);
	return false;
}, changeProv: function (_4b) {
	var _4c = $("popup-city");
	var map = {"1": "1101", "2": "3101", "3": "1201", "4": "5001", "33": "8101"};
	if (map[_4b]) {
		this.changeCity(map[_4b]);
		_4c.innerHTML = "";
		_4c.style.display = "none";
	} else {
		var _4d = "";
		var _4e = window["_city_" + _4b];
		for (var i = 0; i < _4e.length; i++) {
			var _4f = _4e[i].split(":");
			var _50 = _4f[0];
			var _51 = _4f[1];
			if (i == 0) {
				_4d += "<li id=\"city_" + _50 + "\" class=\"active\"><a onclick=\"javascript:XN.ui.schoolSelector.sch.changeCity('" + _50 + "')\">" + _51 + "</a></li>";
				this.changeCity(_50);
			} else {
				_4d += "<li id=\"city_" + _50 + "\"><a onclick=\"javascript:XN.ui.schoolSelector.sch.changeCity('" + _50 + "')\">" + _51 + "</a></li>";
			}
		}
		_4c.innerHTML = _4d;
		_4c.style.display = "";
	}
	$("p_" + this.provId).className = "";
	$("p_" + _4b).className = "active";
	this.provId = _4b;
	XN.ui.schoolSelector.sch.updateFilter();
}, hide: function () {
	try {
		if (typeof (selectElList) != "undefined") {
			var i = 0;
			for (i = 0; i < selectElList.length; i++) {
				selectElList[i].style.display = "";
			}
		}
	}
	catch (e) {
	}
	this.fix.hide();
	return false;
}, changeCity: function (_52) {
	$("schoolTabPan").innerHTML = "";
	$("schoolListContentUl").innerHTML = "<center style=\"padding-top:94px;\">正在读取数据...</center>";
	var _53 = _52;
	if (_53 && _53.length > 0) {
		var _54 = $("city_" + _52);
		if (_54) {
			var _55 = Sizzle("li", _54.parentNode);
			for (var i = 0; i < _55.length; i++) {
				$(_55[i]).delClass("active");
			}
			_54.addClass("active");
		}
		_56(_53);
		return false;
	}
	function _56(_57) {
		var url = "http://support." + XN.env.domain + "/" + XN.ui.schoolSelector.sch.type + "/" + _57 + ".html";
		var _58 = "";
		new XN.net.xmlhttp({url: url, method: "get", data: _58, onSuccess: function (_59) {
			try {
				var _5a = _59.responseText;
				var stp = $("schoolTabPan");
				stp.innerHTML = _5a;
				stp = stp.getElementsByTagName("ul")[0];
				var _5b = Sizzle("li:first", stp)[0];
				if (_5b) {
					$(_5b).addClass("active");
				}
				XN.event.addEvent(stp, "click", function (e) {
					e = e || window.event;
					var obj = e.srcElement || e.target;
					var qu = XN.ui.schoolSelector.quRegx.exec(obj.onclick + "");
					if (qu) {
						XN.ui.schoolSelector.sch.tihuan(qu[1]);
					}
					XN.event.stop(e);
				});
				$("schoolTabPan").style.display = "";
				if (_57.length == 4) {
					var uls = $("schoolTabPan").getElementsByTagName("ul");
					$("schoolListContentUl").innerHTML = uls[1].innerHTML;
				}
				if (_57.length == 6) {
					$("schoolListContentUl").innerHTML = $("city_qu_" + _57).innerHTML;
				}
				$("schoolListContentUl").onclick = function (e) {
					e = e || window.event;
					var obj = e.target || e.srcElement;
					if (obj.tagName.toLowerCase() == "a") {
						XN.ui.schoolSelector.getResult(obj);
					}
					return false;
				};
				XN.ui.schoolSelector.sch.updateFilter();
			}
			catch (e) {
			}
		}, onError: function () {
			var t = $("schoolListContentUl").innerHTML = "读取数据超时,请重试";
			if (XN.DEBUG_MODE) {
				$("schoolListContentUl").onclick = function (e) {
					e = e || window.event;
					var obj = e.target || e.srcElement;
					if (obj.tagName.toLowerCase() == "a") {
						XN.ui.schoolSelector.getResult(obj);
					}
					return false;
				};
				var _5c = document.createElement("a");
				_5c.innerHTML = "" + XN.env.siteName + "技术学院";
				_5c.href = "00001";
				var _5d = document.createElement("a");
				_5d.innerHTML = "JavaScript技术学院";
				_5d.href = "00002";
				try {
					var _5e = $("schoolListContentUl");
					_5e.innerHTML += "<p>" + XN.ui.schoolSelector.sch.type + "</p>";
					_5e.appendChild(_5c);
					_5e.appendChild(_5d);
				}
				catch (e) {
				}
			}
		}});
	};
}, updateFilter: function () {
	var _5f = Sizzle("#popup-city li.active a")[0];
	_5f = _5f ? _5f.innerHTML : "";
	var _60 = Sizzle("#schoolCityQuList li.active a")[0];
	_60 = _60 ? _60.innerHTML : "";
	$("highschoolArea").innerHTML = _5f + _60;
	var _61 = Sizzle("#filterHighSchool input")[0];
	_61.value = "";
	var _62 = null;
	var _63 = null;
	var _64 = Sizzle("#schoolListContentUl li");
	_61.onfocus = function () {
		_62 = setInterval(function () {
			if (_61.value != _63) {
				_63 = _61.value;
				for (var i = 0; i < _64.length; i++) {
					if (Sizzle("a", _64[i])[0].innerHTML.indexOf(_63) < 0) {
						_64[i].style.display = "none";
					} else {
						_64[i].style.display = "";
					}
				}
			}
		}, 500);
	};
	_61.onblur = function () {
		clearInterval(_62);
	};
}, tihuan: function (_65) {
	var e = arguments.callee.caller.arguments[0];
	if (e && (e.target || e.srcElement)) {
		var _66 = (e.target || e.srcElement).parentNode;
		var _67 = Sizzle("li", _66.parentNode);
		for (var i = 0; i < _67.length; i++) {
			$(_67[i]).delClass("active");
			$(_66).addClass("active");
		}
	}
	$("schoolListContentUl").innerHTML = $(_65).innerHTML;
	XN.ui.schoolSelector.sch.updateFilter();
}};
XN.ui.schoolSelector.pageConf(function (_68, _69) {
	if (!_68) {
		return;
	}
	var t = XN.ui.schoolSelector.multiple ? Sizzle("[data-id-unique=" + _68.getAttribute("data-unique") + "]")[0] : $(_68.id + "_id");
	var id = this.idReg.exec(_69.href)[1];
	if (t) {
		t.value = id;
	}
	if (this.type == "s-univ") {
		var _6a = XN.ui.schoolSelector.multiple ? Sizzle("[data-dept-unique=" + _68.getAttribute("data-unique") + "]")[0] : $(_68.id + "_dept");
		if (_6a) {
			this.univ.fillUniversityDept(id, _6a);
		}
	}
});
XN.dom.ready(function () {
	XN.ui.schoolSelector.init();
});

