XN.namespace("ui.CurPlace");
XN.ui.CurPlace = function (_1) {
	this.elem = _1;
	this.elem.length = 1;
	for (var i = 0; i < this.provList.length; i++) {
		this.elem.options[i + 1] = new Option(this.provList[i], this.provList[i]);
	}
	var _3 = this;
	XN.event.addEvent(this.elem, "change", function () {
		_3.getInCityListOfProvince(_3.elem.selectedIndex, _3.elem.id + "_city");
		if (_3.callbacks && _3.callbacks.length) {
			i = 0;
			for (; i < _3.callbacks.length; i++) {
				if (_3.callbacks[i].call(_3, _3.elem) === false) {
					return;
				}
			}
		}
		if (_3.constructor.callbacks.length) {
			i = 0;
			for (; i < _3.constructor.callbacks.length; i++) {
				if (_3.constructor.callbacks[i].call(_3, _3.elem) === false) {
					return;
				}
			}
		}
	});
	this.constructor.onContructionEnd(_3);
};
XN.ui.CurPlace.regx = /cur-plc/;
XN.ui.CurPlace.regxHome = /cur-home/g;
XN.ui.CurPlace.provList = ["\u5317\u4eac", "\u4e0a\u6d77", "\u9ed1\u9f99\u6c5f", "\u5409\u6797", "\u8fbd\u5b81", "\u5929\u6d25", "\u5b89\u5fbd", "\u6c5f\u82cf", "\u6d59\u6c5f", "\u9655\u897f", "\u6e56\u5317", "\u5e7f\u4e1c", "\u6e56\u5357", "\u7518\u8083", "\u56db\u5ddd", "\u5c71\u4e1c", "\u798f\u5efa", "\u6cb3\u5357", "\u91cd\u5e86", "\u4e91\u5357", "\u6cb3\u5317", "\u6c5f\u897f", "\u5c71\u897f", "\u8d35\u5dde", "\u5e7f\u897f", "\u5185\u8499\u53e4", "\u5b81\u590f", "\u9752\u6d77", "\u65b0\u7586", "\u6d77\u5357", "\u897f\u85cf", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e", "\u5176\u5b83\u56fd\u5bb6"];
XN.ui.CurPlace.special = ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e", "\u7701\u4efd", ""];
XN.ui.CurPlace.supCity = ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e"];
XN.ui.CurPlace.callbacks = [];
XN.ui.CurPlace.callbacks_c = [];
XN.ui.CurPlace.citySuffix = "_city";
XN.ui.CurPlace.stateSuffix = "_state";
XN.ui.CurPlace.file = "http://s.xnimg.cn/js/inCityArray.js";
XN.ui.CurPlace.version = "CurPlace 1.1";
XN.ui.CurPlace.init = function () {
	var _4 = this;
	XN.loadFile(_4.file, function () {
		var _5 = document.getElementsByTagName("select");
		XN.debug.log("[ init ] get " + _5.length + "  <select>!");
		var i = 0;
		for (; i < _5.length; i++) {
			if (_4.regx.test(_5[i].className)) {
				if (!_5[i].initialized) {
					_4[_5[i].id] = new XN.ui.CurPlace(_5[i]);
					_5[i].initialized = true;
				}
			}
		}
	});
};
XN.ui.CurPlace.getText = function (_7) {
	if (typeof _7 == "string") {
		_7 = $(_7);
	}
	if (!_7) {
		return;
	}
	return _7.options[_7.selectedIndex].text;
};
XN.ui.CurPlace.config = function (c) {
	if (typeof c == "function") {
		this.callbacks.push(c);
	} else {
		for (var p in c) {
			this[p] = c[p];
		}
	}
};
XN.ui.CurPlace.onContructionEnd = function (_a) {
	if (this.callbacks_c && this.callbacks_c.length) {
		var i = 0;
		for (; i < this.callbacks_c.length; i++) {
			if (this.callbacks_c[i].call(_a, _a.elem, _a) === false) {
				return;
			}
		}
	}
};
XN.ui.CurPlace.config_c = function (_c) {
	if (typeof _c == "function") {
		this.callbacks_c.push(_c);
	} else {
		for (var p in _c) {
			this[p] = _c[p];
		}
	}
};
XN.ui.CurPlace.selectByValue = function (_e, _f) {
	var i = 0;
	var ops = _e.options;
	var len = ops.length;
	var l = XN.debug.log;
	_f = _f + "";
	if (!(/\d+/g.test(_f))) {
		l("not number!");
		for (; i < len; i++) {
			ops[i].selected = false;
			l(ops[i].text + " : " + _f);
			if (XN.string.trim(ops[i].text) == XN.string.trim(_f)) {
				ops[i].selected = true;
				l("---------------------\u76f8\u7b49!\n");
			} else {
				l("\u4e0d\u76f8\u7b49\n");
			}
		}
		return;
	}
	i = 0;
	for (; i < len; i++) {
		ops[i].selected = false;
		if (ops[i].value == _f) {
			ops[i].selected = true;
		}
	}
};
XN.ui.CurPlace.getIndex = function (txt) {
	var i = 0;
	for (; i < XN.ui.CurPlace.provList.length; i++) {
		if (XN.ui.CurPlace.provList[i] == txt) {
			return (i + 1);
		}
	}
	return -1;
};
XN.ui.CurPlace.prototype = {version: "Current Place 1.0 beta", constructor: XN.ui.CurPlace, provList: ["\u5317\u4eac", "\u4e0a\u6d77", "\u9ed1\u9f99\u6c5f", "\u5409\u6797", "\u8fbd\u5b81", "\u5929\u6d25", "\u5b89\u5fbd", "\u6c5f\u82cf", "\u6d59\u6c5f", "\u9655\u897f", "\u6e56\u5317", "\u5e7f\u4e1c", "\u6e56\u5357", "\u7518\u8083", "\u56db\u5ddd", "\u5c71\u4e1c", "\u798f\u5efa", "\u6cb3\u5357", "\u91cd\u5e86", "\u4e91\u5357", "\u6cb3\u5317", "\u6c5f\u897f", "\u5c71\u897f", "\u8d35\u5dde", "\u5e7f\u897f", "\u5185\u8499\u53e4", "\u5b81\u590f", "\u9752\u6d77", "\u65b0\u7586", "\u6d77\u5357", "\u897f\u85cf", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e", "\u5176\u5b83\u56fd\u5bb6"], regx: /cur-plc/, regxHome: /cur-home/g, special: ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e", "\u7701\u4efd", ""], supCity: ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9999\u6e2f", "\u6fb3\u95e8", "\u53f0\u6e7e"], specialC: ["\u7f8e\u56fd", "\u82f1\u56fd", "\u52a0\u62ff\u5927", "\u6fb3\u5927\u5229\u4e9a"], callbacks: [], callbacks_c: [], citySuffix: "_city", stateSuffix: "_state", file: "http://s.xnimg.cn/js/inCityArray.js", cityPrefix: "_incity_", getIndex: function (txt) {
	var i = 0;
	for (; i < this.provList.length; i++) {
		if (this.provList[i] == txt) {
			return (i + 1);
		}
	}
	return -1;
}, getInCityListOfProvince: function (i, _19) {
	try {
		if (i > 0) {
			var _1a = eval(this.cityPrefix + i);
			var _1b = document.getElementById(_19);
			if (!_1b) {
				return;
			}
			this.getOptions(_1b, _1a);
		}
	}
	catch (e) {
	}
}, getInState: function (_1c, _1d) {
	var _1e = eval("_fcity_" + _1c);
	this.getOptions(_1d, _1e);
}, getOptions: function (_1f, _20) {
	if (!_1f) {
		return;
	}
	var _21 = _1f.options;
	var _22 = _21.length;
	for (var i = _22; i > 1; i--) {
		_1f.remove(i - 1);
	}
	for (var j = 0; j < _20.length; j++) {
		var _25 = document.createElement("option");
		_1f.options.add(_25);
		subArr = _20[j].split(":");
		_25.value = subArr[0];
		_25.text = subArr[1];
	}
}, config: function (c) {
	if (typeof c == "function") {
		if (!this.callbacks) {
			this.callbacks = [];
		}
		this.callbacks.push(c);
	} else {
		for (var p in c) {
			this[p] = c[p];
		}
	}
}, parseCountry: function (_28) {
	var _29 = /^607/;
	var _2a = /^605/;
	var _2b = /^606/;
	var _2c = /^601/;
	var c = [
		{rx: _29, name: "\u7f8e\u56fd"},
		{rx: _2a, name: "\u82f1\u56fd"},
		{rx: _2b, name: "\u52a0\u62ff\u5927"},
		{rx: _2c, name: "\u6fb3\u5927\u5229\u4e9a"}
	];
	var ret = "";
	XN.array.each(c, function (i, _30) {
		if (_30.rx.test(_28)) {
			ret = _30.name;
			return false;
		}
	});
	return ret;
}};
XN.dom.ready(function () {
	XN.ui.CurPlace.config(function (_31) {
		var _32 = $(_31.id + "_city");
		if (!_32) {
			return;
		}
		var _33 = ["\u7f8e\u56fd", "\u82f1\u56fd", "\u52a0\u62ff\u5927", "\u6fb3\u5927\u5229\u4e9a"];
		if (_31.selectedIndex == _31.length - 1) {
			_32.options[0].text = "\u56fd\u5bb6";
		} else {
			_32.options[0].text = "\u57ce\u5e02";
		}
		var _34 = $(_32.id + "_state");
		if (XN.array.include(this.special, this.elem.value)) {
			try {
				_32.hide();
				_34.hide();
			}
			catch (e) {
			}
		} else {
			try {
				_32.show();
				_34.hide();
			}
			catch (e) {
			}
		}
		if (!_34) {
			return;
		}
		var _35 = this;
		var _36 = $(_32.id + "_code");
		var _37 = $(_32.id + "_name");
		_32.onclick = function () {
			if (XN.array.include(_35.specialC, _32.options[_32.selectedIndex].text)) {
				_35.getInState(_32.selectedIndex, _34);
				_34.show();
				if (_35.withThird) {
					if (_36) {
						_36.value = "";
					}
					if (_37) {
						_37.value = "";
					}
				}
			} else {
				_34.hide();
				if (_36) {
					_36.value = _32.value;
				}
				if (_37) {
					_37.value = _32.options[_32.selectedIndex].text;
				}
			}
		};
	});
	XN.ui.CurPlace.config(function (_38) {
		if (XN.array.include(this.supCity, _38.value)) {
			try {
				$(_38.id + "_city_code").value = $(_38.id + "_city").options[1].value;
			}
			catch (e) {
			}
			return;
		} else {
			try {
				$(_38.id + "_city_code").value = "";
				$(_38.id + "_city_name").value = "";
			}
			catch (e) {
			}
		}
		var _39 = $(_38.id + "_city");
		if (!_39) {
			return;
		}
		XN.event.addEvent(_39, "change", function () {
			try {
				$(_38.id + "_city_code").value = _39.value;
			}
			catch (e) {
			}
		});
		var _3a = $(_38.id + "_city_state");
		if (!_3a) {
			return;
		}
		XN.event.addEvent(_3a, "change", function () {
			try {
				$(_38.id + "_city_code").value = _3a.value;
				$(_38.id + "_city_name").value = _3a.options[_3a.selectedIndex].text;
			}
			catch (e) {
			}
		});
	});
	var txt = XN.ui.CurPlace.getText;
	var cp = XN.ui.CurPlace;
	XN.ui.CurPlace.config(function (_3d) {
		var _3e = $(_3d.id + "_city_name");
		if (!_3e) {
			return;
		}
		if (XN.array.include(cp.supCity, txt(_3d))) {
			_3e.value = txt(_3d);
			return;
		}
		if ($(_3d.id + "_city")) {
			XN.event.addEvent(_3d.id + "_city", "change", function () {
				_3e.value = txt(_3d.id + "_city");
				return;
			});
		}
	});
	XN.ui.CurPlace.config_c(function (_3f, obj) {
		if (!_3f.title) {
			return;
		}
		var _41 = this;
		var cs = XN.ui.CurPlace.citySuffix;
		var ss = XN.ui.CurPlace.stateSuffix;
		var _44;
		try {
			_44 = $(_3f.id + cs);
			var _45 = $(_44.id + "_state");
			if (_3f.title == "\u5176\u5b83\u56fd\u5bb6") {
				if (_45) {
					_45.title = _44.title;
				}
				var _46 = this.parseCountry(_45.title);
				if (_44 && _46) {
					_44.title = _46;
				} else {
					if (_45) {
						_45.hide();
					}
				}
			}
			XN.ui.CurPlace.selectByValue(_3f, _3f.title);
			obj.getInCityListOfProvince(obj.getIndex(_3f.title), _3f.id + cs);
			XN.ui.CurPlace.selectByValue(_44, _44.title);
			_44.onchange = function () {
				var _47 = $(_44.id + "_code");
				var _48 = $(_44.id + "_name");
				if (obj.withThird) {
					if (XN.array.include(obj.specialC, _44.options[_44.selectedIndex].text)) {
						if (_47) {
							_47.value = "";
						}
						if (_48) {
							_48.value = "";
						}
					} else {
						if (_47) {
							_47.value = _44.value;
						}
						if (_48) {
							_48.value = _44.options[_44.selectedIndex].text;
						}
					}
				} else {
					if (_47) {
						_47.value = _44.value;
					}
					if (_48) {
						_48.value = _44.options[_44.selectedIndex].text;
					}
				}
				var _49 = _44.options[_44.selectedIndex].text;
				if (XN.array.include(obj.specialC, _49)) {
					if (_45) {
						obj.getInState(_44.selectedIndex, _45);
						_45.show();
						_45.onchange = function () {
							if (_47) {
								_47.value = _45.value;
							}
							if (_48) {
								_48.value = _45.options[_45.selectedIndex].text;
							}
						};
					}
				} else {
					if (_45) {
						_45.hide();
					}
				}
			};
			_44.show();
			if (XN.array.include(this.supCity, _3f.title)) {
				_44.hide();
			}
			if (!_45) {
				return;
			}
			if (XN.array.include(this.supCity, _3f.title)) {
				_45.hide();
			}
			this.getInState(_44.selectedIndex, _45);
			if (_45.title) {
				XN.ui.CurPlace.selectByValue(_45, _45.title);
				_45.show();
			}
			_45.onchange = function () {
				$(_44.id + "_code").value = _45.value;
				$(_44.id + "_name").value = _45.options[_45.selectedIndex].text;
			};
			XN.event.addEvent(_44, "change", function () {
				if (XN.array.include(_41.specialC, _44.options[_44.selectedIndex].text)) {
					_41.getInState(_44.selectedIndex, _45);
					_45.show();
				} else {
					_45.hide();
				}
			});
		}
		catch (e) {
		}
	});
	XN.ui.CurPlace.init();
});
XN.xnExtend = function (sup, sub) {
	var F = function () {
	};
	F.prototype = sup.prototype;
	sub.prototype = new F();
	sub.prototype.constructor = sub;
	sub.prototype.superClass = sup;
};
XN.cpy = function (_4d, src) {
	if (!src) {
		return _4d;
	}
	for (var p in src) {
		if (src.hasOwnProperty(p) && p != "prototype") {
			_4d[p] = src[p];
		}
	}
	return _4d;
};
XN.ui.CurHome = function (ele) {
	this.superClass.call(this, ele);
};
XN.xnExtend(XN.ui.CurPlace, XN.ui.CurHome);
XN.cpy(XN.ui.CurHome, XN.ui.CurPlace);
XN.ui.CurHome.prototype.provList = ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9ed1\u9f99\u6c5f", "\u5409\u6797", "\u8fbd\u5b81", "\u5c71\u4e1c", "\u5c71\u897f", "\u9655\u897f", "\u6cb3\u5317", "\u6cb3\u5357", "\u6e56\u5317", "\u6e56\u5357", "\u6d77\u5357", "\u6c5f\u82cf", "\u6c5f\u897f", "\u5e7f\u4e1c", "\u5e7f\u897f", "\u4e91\u5357", "\u8d35\u5dde", "\u56db\u5ddd", "\u5185\u8499\u53e4", "\u5b81\u590f", "\u7518\u8083", "\u9752\u6d77", "\u897f\u85cf", "\u65b0\u7586", "\u5b89\u5fbd", "\u6d59\u6c5f", "\u798f\u5efa", "\u53f0\u6e7e", "\u9999\u6e2f", "\u6fb3\u95e8"];
XN.ui.CurHome.prototype.cityPrefix = "_city_";
XN.ui.CurHome.prototype.version = "home 1.0 beta";
XN.ui.CurHome.regx = /cur-home/;
XN.ui.CurHome.file = "http://s.xnimg.cn/js/cityArray.js";
XN.ui.CurHome.callbacks_c = [];
XN.ui.CurHome.version = "CurHome 1.1";
XN.ui.CurHome.init = function () {
	var _51 = this;
	XN.loadFile(_51.file, function () {
		var _52 = document.getElementsByTagName("select");
		XN.debug.log("[ init ] get " + _52.length + "  <select>!");
		var i = 0;
		for (; i < _52.length; i++) {
			if (_51.regx.test(_52[i].className)) {
				if (!_52[i].initialized) {
					_51[_52[i].id] = new XN.ui.CurHome(_52[i]);
					_52[i].initialized = true;
				}
			}
		}
	});
};
XN.ui.CurHome.config_c = function (_54) {
	if (typeof _54 == "function") {
		this.callbacks_c.push(_54);
	} else {
		for (var p in _54) {
			this[p] = _54[p];
		}
	}
};
XN.ui.CurHome.conf_c = function (_56) {
	this.superClass.conf_c(this, _56);
};
$extend(XN.ui.CurHome.prototype, {special: ["\u7701\u4efd", ""], districtCity: ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9999\u6e2f", "\u6fb3\u95e8"], provList: ["\u5317\u4eac", "\u4e0a\u6d77", "\u5929\u6d25", "\u91cd\u5e86", "\u9ed1\u9f99\u6c5f", "\u5409\u6797", "\u8fbd\u5b81", "\u5c71\u4e1c", "\u5c71\u897f", "\u9655\u897f", "\u6cb3\u5317", "\u6cb3\u5357", "\u6e56\u5317", "\u6e56\u5357", "\u6d77\u5357", "\u6c5f\u82cf", "\u6c5f\u897f", "\u5e7f\u4e1c", "\u5e7f\u897f", "\u4e91\u5357", "\u8d35\u5dde", "\u56db\u5ddd", "\u5185\u8499\u53e4", "\u5b81\u590f", "\u7518\u8083", "\u9752\u6d77", "\u897f\u85cf", "\u65b0\u7586", "\u5b89\u5fbd", "\u6d59\u6c5f", "\u798f\u5efa", "\u53f0\u6e7e", "\u9999\u6e2f", "\u6fb3\u95e8"]});
XN.dom.ready(function () {
	XN.ui.CurHome.config(function (_57) {
		var _58 = $(_57.id + "_city");
		if (!_58) {
			return;
		}
		if (XN.array.include(this.districtCity, _57.value)) {
			var _58 = $(_57.id + this.citySuffix);
			if (_58) {
				_58.options[0].text = "\u5730\u533a";
			}
		}
	});
	XN.ui.CurHome.config(function (_59) {
		var _5a = $(_59.id + "_city");
		if (!_5a) {
			return;
		}
		var _5b;
		var _5c;
		try {
			if (XN.array.include(this.districtCity, _59.value)) {
				_5b = $(_59.id + "_city_code");
				_5c = $(_59.id + "_city_name");
				if (_5b) {
					_5b.value = "";
				}
				if (_5c) {
					_5c.value = "";
				}
				_5a.onchange = function () {
					_5b.value = _5a.value;
					_5c.value = _5a.options[_5a.selectedIndex].text;
				};
			}
		}
		catch (e) {
		}
	});
	XN.ui.CurHome.config_c(function (_5d, obj) {
		if (_5d.title) {
			XN.ui.CurPlace.selectByValue(_5d, _5d.title);
		}
		var _5f = $(_5d.id + "_city");
		if (!_5f) {
			return;
		}
		if (XN.array.include(this.supCity, _5d.title)) {
			_5f.show();
		}
		if (_5f.title) {
			obj.getInCityListOfProvince(_5d.selectedIndex, _5d.id + "_city");
			XN.ui.CurPlace.selectByValue(_5f, _5f.title);
		}
		_5f.onchange = function () {
			var _60 = $(_5d.id + "_city_code");
			var _61 = $(_5d.id + "_city_name");
			if (_60) {
				_60.value = _5f.value;
			}
			if (_61) {
				_61.value = _5f.options[_5f.selectedIndex].text;
			}
		};
	});
	XN.ui.CurHome.init();
});
