const WEBSITE = "https://pandaoxi.github.io";
const APPID = "KeaEh5SIw5KH8dEHEQQYaanU-MdYXbMMI";
const APPKEY = "mSFSDLq3fSlVGNb2PCjaHltc";
const GITHUB = true;
const GITHUB_REPOSITORY = "shURL";
const LENGTH = 4;

AV.init({
	appId: APPID,
	appKey: APPKEY,
	// serverURL: WEBSITE,
});
AV.debug.enable();
const SHURL = AV.Object.extend("shURL");

function randomStr(len) {
	if (len > 48) len = 48;
	var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
	var maxPos = $chars.length;
	var pwd = "";
	for (var i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}

function setNote(s) {
	var x = document.getElementById("newURL");
	x.innerHTML = s;
}

function checker(s) {
	const query = new AV.Query("shURL");
	query.equalTo("shortURL", s);
	query.find().then((link) => {
		return link.length;
	});
}

function make() {
	try {
		var ago = document.getElementById("ago");
		var agoURL = ago.value;
		var pattern =
			/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
		if (!pattern.test(agoURL)) {
			setNote(
				'<b class="text-purple-700">您的输入似乎不是 URL，请重新输入。</b>'
			);
			return;
		}
		setNote(`<b class="text-state-800">请稍等！</b>`);

		const query = new AV.Query("shURL");
		query.equalTo("agoURL", agoURL);
		query.find().then((link) => {
			if (link.length >= 1) {
				flag = true;
				var shLink = link[0].get("shortURL");
				var shURL =
					`${WEBSITE}/` +
					(GITHUB ? `${GITHUB_REPOSITORY}/` : ``) +
					`?x=${shLink}`;
				setNote(
					`<b><a href="${shURL}" class="text-blue-700 hover:text-blue-800"><code>${shURL}</code></a></b>`
				);
				return;
			} else {
				var shLink = randomStr(LENGTH);
				while (checker(shLink)) shLink = randomStr(LENGTH);
				const todo = new SHURL();
				todo.set("agoURL", agoURL);
				todo.set("shortURL", shLink);
				todo.save().then(
					(todo) => {
						var shURL =
							`${WEBSITE}/` +
							(GITHUB ? `${GITHUB_REPOSITORY}/` : ``) +
							`?x=${shLink}`;
						setNote(
							`<b><a href="${shURL}" class="text-blue-700 hover:text-blue-800"><code>${shURL}</code></a></b>`
						);
					},
					(error) => {
						setNote(
							`<b class="text-rose-600">发生错误（<code>CODE = ${error.code}</code>），请稍后再试。</b>`
						);
					}
				);
			}
		});
	} catch (err) {
		setNote(
			`<b class="text-rose-600">发生错误（<code>${err}</code>），请稍后再试。</b>`
		);
	}
}

function getName(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	var context = "";
	if (r != null) context = r[2];
	reg = null;
	r = null;
	return context == null || context == "" || context == "undefined"
		? "ERROR ERROR ERROR!!!"
		: context;
}

function loadTo() {
	try {
		var x = getName("x");
		if (x == "ERROR ERROR ERROR!!!") return;
		var w = `${WEBSITE}/` + (GITHUB ? `${GITHUB_REPOSITORY}/` : ``);
		setNote(
			`<b class="text-amber-700">正在跳转：<code>${x}</code>；<a href="${w}" class="text-sky-600 hover:text-sky-700">取消此操作</a>。</b>`
		);
		const query = new AV.Query("shURL");
		query.equalTo("shortURL", x);
		query.find().then((link) => {
			if (!link.length)
				setNote(
					`<b class="text-rose-600">发生错误，此链接尚未被注册或在数据库中被删除。</b>`
				);
			window.location.href = link[0].get("agoURL");
		});
	} catch (err) {
		setNote(
			`<b class="text-rose-600">发生错误（<code>${err}</code>），请稍后再试。</b>`
		);
	}
}

const initial = new SHURL();
try {
	const query = new AV.Query("shURL");
} catch (err) {
	initial.set("agoURL", "index");
	initial.set("shortURL", "index1");
	initial.save().then(
		(todo) => {},
		(error) => {
			setNote(
				`<b class="text-rose-600">初始化失败（<code>CODE = ${err.code}</code>），请联系网站开发者。</b>`
			);
		}
	);
}
