const query = require("db/query");
const producer = require("messaging/producer");
const daoApi = require("db/dao");
const EntityUtils = require("codbex-bids/gen/dao/utils/EntityUtils");

let dao = daoApi.create({
	table: "CODBEX_BID",
	properties: [
		{
			name: "Id",
			column: "BID_ID",
			type: "INTEGER",
			id: true,
			autoIncrement: true,
		},
 {
			name: "Name",
			column: "BID_NAME",
			type: "VARCHAR",
		},
 {
			name: "Date",
			column: "BID_DATE",
			type: "DATE",
		},
 {
			name: "ValidityDate",
			column: "BID_VALIDITYDATE",
			type: "DATE",
		},
 {
			name: "Quantity",
			column: "BID_QUANTITY",
			type: "DOUBLE",
		},
 {
			name: "Price",
			column: "BID_PRICE",
			type: "DOUBLE",
		},
 {
			name: "Total",
			column: "BID_TOTAL",
			type: "DOUBLE",
		},
 {
			name: "Offer",
			column: "BID_OFFER",
			type: "INTEGER",
		},
 {
			name: "UoM",
			column: "BID_UOM",
			type: "INTEGER",
		},
 {
			name: "Product",
			column: "BID_PRODUCT",
			type: "INTEGER",
		},
 {
			name: "CurrencyCode",
			column: "BID_CURRENCYCODE",
			type: "VARCHAR",
		},
 {
			name: "Buyer",
			column: "BID_BUYER",
			type: "INTEGER",
		},
 {
			name: "Trader",
			column: "BID_TRADER",
			type: "INTEGER",
		},
 {
			name: "BidStatus",
			column: "BID_BIDSTATUS",
			type: "INTEGER",
		}
]
});

exports.list = function(settings) {
	return dao.list(settings).map(function(e) {
		EntityUtils.setDate(e, "Date");
		EntityUtils.setDate(e, "ValidityDate");
		return e;
	});
};

exports.get = function(id) {
	let entity = dao.find(id);
	EntityUtils.setDate(entity, "Date");
	EntityUtils.setDate(entity, "ValidityDate");
	return entity;
};

exports.create = function(entity) {
	EntityUtils.setLocalDate(entity, "Date");
	EntityUtils.setLocalDate(entity, "ValidityDate");
	let id = dao.insert(entity);
	triggerEvent("Create", {
		table: "CODBEX_BID",
		key: {
			name: "Id",
			column: "BID_ID",
			value: id
		}
	});
	return id;
};

exports.update = function(entity) {
	// EntityUtils.setLocalDate(entity, "Date");
	// EntityUtils.setLocalDate(entity, "ValidityDate");
	dao.update(entity);
	triggerEvent("Update", {
		table: "CODBEX_BID",
		key: {
			name: "Id",
			column: "BID_ID",
			value: entity.Id
		}
	});
};

exports.delete = function(id) {
	dao.remove(id);
	triggerEvent("Delete", {
		table: "CODBEX_BID",
		key: {
			name: "Id",
			column: "BID_ID",
			value: id
		}
	});
};

exports.count = function() {
	return dao.count();
};

exports.customDataCount = function() {
	let resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_BID"');
	if (resultSet !== null && resultSet[0] !== null) {
		if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
			return resultSet[0].COUNT;
		} else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
			return resultSet[0].count;
		}
	}
	return 0;
};

function triggerEvent(operation, data) {
	producer.queue("codbex-bids/Bid/Bid/" + operation).send(JSON.stringify(data));
}