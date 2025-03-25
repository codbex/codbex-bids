angular.module('page', ["ideUI", "ideView", "entityApi"])
	.config(["messageHubProvider", function (messageHubProvider) {
		messageHubProvider.eventIdPrefix = 'codbex-bids.Bid.Bid';
	}])
	.config(["entityApiProvider", function (entityApiProvider) {
		entityApiProvider.baseUrl = "/services/ts/codbex-bids/gen/codbex-bids/api/Bid/BidService.ts";
	}])
	.controller('PageController', ['$scope',  '$http', 'Extensions', 'messageHub', 'entityApi', function ($scope,  $http, Extensions, messageHub, entityApi) {

		$scope.entity = {};
		$scope.forms = {
			details: {},
		};
		$scope.formHeaders = {
			select: "Bid Details",
			create: "Create Bid",
			update: "Update Bid"
		};
		$scope.action = 'select';

		//-----------------Custom Actions-------------------//
		Extensions.get('dialogWindow', 'codbex-bids-custom-action').then(function (response) {
			$scope.entityActions = response.filter(e => e.perspective === "Bid" && e.view === "Bid" && e.type === "entity");
		});

		$scope.triggerEntityAction = function (action) {
			messageHub.showDialogWindow(
				action.id,
				{
					id: $scope.entity.Id
				},
				null,
				true,
				action
			);
		};
		//-----------------Custom Actions-------------------//

		//-----------------Events-------------------//
		messageHub.onDidReceiveMessage("clearDetails", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsOffer = [];
				$scope.optionsUoM = [];
				$scope.optionsProduct = [];
				$scope.optionsCurrencyCode = [];
				$scope.optionsBuyer = [];
				$scope.optionsTrader = [];
				$scope.optionsStatus = [];
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("entitySelected", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValidityDate) {
					msg.data.entity.ValidityDate = new Date(msg.data.entity.ValidityDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOffer = msg.data.optionsOffer;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'select';
			});
		});

		messageHub.onDidReceiveMessage("createEntity", function (msg) {
			$scope.$apply(function () {
				$scope.entity = {};
				$scope.optionsOffer = msg.data.optionsOffer;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'create';
			});
		});

		messageHub.onDidReceiveMessage("updateEntity", function (msg) {
			$scope.$apply(function () {
				if (msg.data.entity.Date) {
					msg.data.entity.Date = new Date(msg.data.entity.Date);
				}
				if (msg.data.entity.ValidityDate) {
					msg.data.entity.ValidityDate = new Date(msg.data.entity.ValidityDate);
				}
				$scope.entity = msg.data.entity;
				$scope.optionsOffer = msg.data.optionsOffer;
				$scope.optionsUoM = msg.data.optionsUoM;
				$scope.optionsProduct = msg.data.optionsProduct;
				$scope.optionsCurrencyCode = msg.data.optionsCurrencyCode;
				$scope.optionsBuyer = msg.data.optionsBuyer;
				$scope.optionsTrader = msg.data.optionsTrader;
				$scope.optionsStatus = msg.data.optionsStatus;
				$scope.action = 'update';
			});
		});

		$scope.serviceOffer = "/services/ts/codbex-bids/gen/codbex-bids/api/Offer/OfferService.ts";
		$scope.serviceUoM = "/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts";
		$scope.serviceProduct = "/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts";
		$scope.serviceCurrencyCode = "/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts";
		$scope.serviceBuyer = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceTrader = "/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts";
		$scope.serviceStatus = "/services/ts/codbex-bids/gen/codbex-bids/api/entities/BidStatusService.ts";

		//-----------------Events-------------------//

		$scope.create = function () {
			entityApi.create($scope.entity).then(function (response) {
				if (response.status != 201) {
					messageHub.showAlertError("Bid", `Unable to create Bid: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityCreated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Bid", "Bid successfully created");
			});
		};

		$scope.update = function () {
			entityApi.update($scope.entity.Id, $scope.entity).then(function (response) {
				if (response.status != 200) {
					messageHub.showAlertError("Bid", `Unable to update Bid: '${response.message}'`);
					return;
				}
				messageHub.postMessage("entityUpdated", response.data);
				messageHub.postMessage("clearDetails", response.data);
				messageHub.showAlertSuccess("Bid", "Bid successfully updated");
			});
		};

		$scope.cancel = function () {
			messageHub.postMessage("clearDetails");
		};
		
		//-----------------Dialogs-------------------//
		
		$scope.createOffer = function () {
			messageHub.showDialogWindow("Offer-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createUoM = function () {
			messageHub.showDialogWindow("UoM-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createProduct = function () {
			messageHub.showDialogWindow("Product-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createCurrencyCode = function () {
			messageHub.showDialogWindow("Currency-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createBuyer = function () {
			messageHub.showDialogWindow("Partner-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createTrader = function () {
			messageHub.showDialogWindow("Partner-details", {
				action: "create",
				entity: {},
			}, null, false);
		};
		$scope.createStatus = function () {
			messageHub.showDialogWindow("BidStatus-details", {
				action: "create",
				entity: {},
			}, null, false);
		};

		//-----------------Dialogs-------------------//



		//----------------Dropdowns-----------------//

		$scope.refreshOffer = function () {
			$scope.optionsOffer = [];
			$http.get("/services/ts/codbex-bids/gen/codbex-bids/api/Offer/OfferService.ts").then(function (response) {
				$scope.optionsOffer = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshUoM = function () {
			$scope.optionsUoM = [];
			$http.get("/services/ts/codbex-uoms/gen/codbex-uoms/api/entities/UoMService.ts").then(function (response) {
				$scope.optionsUoM = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshProduct = function () {
			$scope.optionsProduct = [];
			$http.get("/services/ts/codbex-products/gen/codbex-products/api/entities/ProductService.ts").then(function (response) {
				$scope.optionsProduct = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshCurrencyCode = function () {
			$scope.optionsCurrencyCode = [];
			$http.get("/services/ts/codbex-currencies/gen/codbex-currencies/api/entities/CurrencyService.ts").then(function (response) {
				$scope.optionsCurrencyCode = response.data.map(e => {
					return {
						value: e.Code,
						text: e.Code
					}
				});
			});
		};
		$scope.refreshBuyer = function () {
			$scope.optionsBuyer = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
				$scope.optionsBuyer = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshTrader = function () {
			$scope.optionsTrader = [];
			$http.get("/services/ts/codbex-partners/gen/codbex-partners/api/entities/PartnerService.ts").then(function (response) {
				$scope.optionsTrader = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};
		$scope.refreshStatus = function () {
			$scope.optionsStatus = [];
			$http.get("/services/ts/codbex-bids/gen/codbex-bids/api/entities/BidStatusService.ts").then(function (response) {
				$scope.optionsStatus = response.data.map(e => {
					return {
						value: e.Id,
						text: e.Name
					}
				});
			});
		};

		//----------------Dropdowns-----------------//	
		

	}]);