import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface OfferEntity {
    readonly Id: number;
    Name?: string;
    Date?: Date;
    ExpiryDate?: Date;
    Quantity?: number;
    Price?: number;
    Total?: number;
    CurrencyCode?: string;
    UoM?: number;
    Location?: string;
    Product?: number;
    Country?: number;
    Supplier?: number;
    Trader?: number;
    Status?: number;
}

export interface OfferCreateEntity {
    readonly Name?: string;
    readonly Date?: Date;
    readonly ExpiryDate?: Date;
    readonly Quantity?: number;
    readonly Price?: number;
    readonly Total?: number;
    readonly CurrencyCode?: string;
    readonly UoM?: number;
    readonly Location?: string;
    readonly Product?: number;
    readonly Country?: number;
    readonly Supplier?: number;
    readonly Trader?: number;
    readonly Status?: number;
}

export interface OfferUpdateEntity extends OfferCreateEntity {
    readonly Id: number;
}

export interface OfferEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ExpiryDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            CurrencyCode?: string | string[];
            UoM?: number | number[];
            Location?: string | string[];
            Product?: number | number[];
            Country?: number | number[];
            Supplier?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Date?: Date | Date[];
            ExpiryDate?: Date | Date[];
            Quantity?: number | number[];
            Price?: number | number[];
            Total?: number | number[];
            CurrencyCode?: string | string[];
            UoM?: number | number[];
            Location?: string | string[];
            Product?: number | number[];
            Country?: number | number[];
            Supplier?: number | number[];
            Trader?: number | number[];
            Status?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ExpiryDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            CurrencyCode?: string;
            UoM?: number;
            Location?: string;
            Product?: number;
            Country?: number;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ExpiryDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            CurrencyCode?: string;
            UoM?: number;
            Location?: string;
            Product?: number;
            Country?: number;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ExpiryDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            CurrencyCode?: string;
            UoM?: number;
            Location?: string;
            Product?: number;
            Country?: number;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ExpiryDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            CurrencyCode?: string;
            UoM?: number;
            Location?: string;
            Product?: number;
            Country?: number;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Date?: Date;
            ExpiryDate?: Date;
            Quantity?: number;
            Price?: number;
            Total?: number;
            CurrencyCode?: string;
            UoM?: number;
            Location?: string;
            Product?: number;
            Country?: number;
            Supplier?: number;
            Trader?: number;
            Status?: number;
        };
    },
    $select?: (keyof OfferEntity)[],
    $sort?: string | (keyof OfferEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OfferEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OfferEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OfferUpdateEntityEvent extends OfferEntityEvent {
    readonly previousEntity: OfferEntity;
}

export class OfferRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OFFER",
        properties: [
            {
                name: "Id",
                column: "OFFER_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OFFER_NAME",
                type: "VARCHAR",
            },
            {
                name: "Date",
                column: "OFFER_DATE",
                type: "DATE",
            },
            {
                name: "ExpiryDate",
                column: "OFFER_EXPIRYDATE",
                type: "DATE",
            },
            {
                name: "Quantity",
                column: "OFFER_QUANTITY",
                type: "DOUBLE",
            },
            {
                name: "Price",
                column: "OFFER_PRICE",
                type: "DOUBLE",
            },
            {
                name: "Total",
                column: "OFFER_TOTAL",
                type: "DOUBLE",
            },
            {
                name: "CurrencyCode",
                column: "OFFER_CURRENCYCODE",
                type: "VARCHAR",
            },
            {
                name: "UoM",
                column: "OFFER_UOM",
                type: "INTEGER",
            },
            {
                name: "Location",
                column: "OFFER_LOCATION",
                type: "VARCHAR",
            },
            {
                name: "Product",
                column: "OFFER_PRODUCT",
                type: "INTEGER",
            },
            {
                name: "Country",
                column: "OFFER_COUNTRY",
                type: "INTEGER",
            },
            {
                name: "Supplier",
                column: "OFFER_SUPPLIER",
                type: "INTEGER",
            },
            {
                name: "Trader",
                column: "OFFER_TRADER",
                type: "INTEGER",
            },
            {
                name: "Status",
                column: "OFFER_STATUS",
                type: "INTEGER",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OfferRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OfferEntityOptions): OfferEntity[] {
        return this.dao.list(options).map((e: OfferEntity) => {
            EntityUtils.setDate(e, "Date");
            EntityUtils.setDate(e, "ExpiryDate");
            return e;
        });
    }

    public findById(id: number): OfferEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        EntityUtils.setDate(entity, "ExpiryDate");
        return entity ?? undefined;
    }

    public create(entity: OfferCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        EntityUtils.setLocalDate(entity, "ExpiryDate");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OFFER",
            entity: entity,
            key: {
                name: "Id",
                column: "OFFER_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OfferUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        // EntityUtils.setLocalDate(entity, "ExpiryDate");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OFFER",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OFFER_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OfferCreateEntity | OfferUpdateEntity): number {
        const id = (entity as OfferUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OfferUpdateEntity);
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
            table: "CODBEX_OFFER",
            entity: entity,
            key: {
                name: "Id",
                column: "OFFER_ID",
                value: id
            }
        });
    }

    public count(options?: OfferEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__OFFER"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OfferEntityEvent | OfferUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-bids-Offer-Offer", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-bids-Offer-Offer").send(JSON.stringify(data));
    }
}
