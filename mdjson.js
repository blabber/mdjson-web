//var runningorderAPI = "http://localhost:8080/runningorder.json";
var runningorderAPI = "https://gist.githubusercontent.com/blabber/babc4803141b0ec13fd613cc84eae074/raw";

function ViewModel() {
	var self = this;

	self.runningorder = ko.observable();
	self.selectedDay = ko.observable(0);
	self.infoMessage = ko.observable("");
	self.errorMessage = ko.observable("");

	self.dayLabel = ko.pureComputed(function() {
		if (self.runningorder() === undefined) {
			return "";
		}
		return self.runningorder().days[self.selectedDay()].label;
	});

	self.days = ko.pureComputed(function() {
		if (self.runningorder() === undefined) {
			return {};
		}
		return self.runningorder().days;
	});

	self.stages = ko.pureComputed(function() {
		if (self.runningorder() === undefined) {
			return {};
		}
		return self.runningorder().days[self.selectedDay()].stages;
	});

	self.selectDay = function(day) {
		self.selectedDay(day);
	};

	self.loadData = function() {
		self.infoMessage("Loading...");
		self.errorMessage("");

		$.getJSON(runningorderAPI)
			.done(function(data) {
				self.runningorder(data.data);
				self.errorMessage("");
			})
			.fail(function(jqXHR) {
				if (jqXHR.status >= 500 && jqXHR.status <= 599) {
					var json = $.parseJSON(jqXHR.responseText);
					self.errorMessage(json.message);
					return;
				}

				self.errorMessage("Something went wrong. The backend is probably not responding.");
			})
			.always(function() {
				self.infoMessage("");
			});
	}

	self.loadData();
}

var vm = new ViewModel();
ko.applyBindings(vm);
