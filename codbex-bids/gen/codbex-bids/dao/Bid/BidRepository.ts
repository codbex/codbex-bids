import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface BidEntity {
    readonly Id: number;
    Name?: string;
    Date?: Date;
    ValidityDate?: Date;
    Quantity?: number;
    Price?: number;
    Total?: number;
    Offer?: number;
    UoM?: number;
    Product?: number;
    CurrencyCode?: string;
    Buyer?: number;
    Trader?: number;
    Status?: number;
}

export interface BidCreateEntity {
    readonly Name?: string;
    readonly Date?: Date;
    readonly ValidityDate?: Date;
    readonly Quantity?: number;
    readonly Price?: number;
    readonly Total?: number;
    readonly Offer?: number;
    readonly UoM?: number;
    readonly Product?: number;
    readonly CurrencyCode?: string;
    readonly Buyer?: number;
    readonly Trader?: number;
    readonly Status?: number;
}

export interface BidUpdateEntity extends BidCreateEntity {
    readonly Id: number;
}

export interface BidEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ValidityDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Offer?: number | number[];
            UoM?: number | number[];
            Product?: number | number[];
            CurrencyCode?: string | string[];
            Buyer?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ValidityDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            Offer?: number | number[];
            UoM?: number | number[];
            Product?: number | number[];
            CurrencyCode?: string | string[];
            Buyer?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Offer?: number;
            UoM?: number;
            Product?: number;
            CurrencyCode?: string;
            Buyer?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Offer?: number;
            UoM?: number;
            Product?: number;
            CurrencyCode?: string;
            Buyer?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Offer?: number;
            UoM?: number;
            Product?: number;
            CurrencyCode?: string;
            Buyer?: number;
            Trader?: number;
            Status?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Offer?: number;
            UoM?: number;
            Product?: number;
            CurrencyCode?: string;
            Buyer?: number;
            Trader?: number;
            Status?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ValidityDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            Offer?: number;
            UoM?: number;
            Product?: number;
            CurrencyCode?: string;
            Buyer?: number;
            Trader?: number;
            Status?: number;
        };
    },
    $select?: (keyof BidEntity)[],
    $sort?: string | (keyof BidEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface BidEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<BidEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface BidUpdateEntityEvent extends BidEntityEvent {
    readonly previousEntity: BidEntity;
}

export class BidRepository {

    private static readonly DEFINITION = {
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
                name: "Status",
                column: "BID_STATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(BidRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: BidEntityOptions): BidEntity[] {
        return this.dao.list(options).map((e: BidEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "ValidityDate");
            return e;
        });
    }

    public findById(id: number): BidEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "ValidityDate");
        return entity ?? undefined;
    }

    public create(entity: BidCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "ValidityDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_BID",
            entity: entity,
            key: {
                name: "Id",
                column: "BID_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: BidUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "ValidityDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_BID",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "BID_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: BidCreateEntity | BidUpdateEntity): number {
        const id = (entity as BidUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as BidUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_BID",
            entity: entity,
            key: {
                name: "Id",
                column: "BID_ID",
                value: id
            }
        });
    }

    public count(options?: BidEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__BID"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: BidEntityEvent | BidUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-bids-Bid-Bid", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-bids-Bid-Bid").send(JSON.stringify(data));
    }
}
