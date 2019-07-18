var app = {
	init: function () {
		this.bindCordovaEvents();
	},
	bindCordovaEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function () {
		console.log("Device is ready 🚀");
	}
}
