import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface OfferStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface OfferStatusCreateEntity {
    readonly Name?: string;
}

export interface OfferStatusUpdateEntity extends OfferStatusCreateEntity {
    readonly Id: number;
}

export interface OfferStatusEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof OfferStatusEntity)[],
    $sort?: string | (keyof OfferStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface OfferStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<OfferStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface OfferStatusUpdateEntityEvent extends OfferStatusEntityEvent {
    readonly previousEntity: OfferStatusEntity;
}

export class OfferStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_OFFERSTATUS",
        properties: [
            {
                name: "Id",
                column: "OFFERSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "OFFERSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(OfferStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: OfferStatusEntityOptions): OfferStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): OfferStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: OfferStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_OFFERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OFFERSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: OfferStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_OFFERSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "OFFERSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: OfferStatusCreateEntity | OfferStatusUpdateEntity): number {
        const id = (entity as OfferStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as OfferStatusUpdateEntity);
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
            table: "CODBEX_OFFERSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "OFFERSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: OfferStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__OFFERSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: OfferStatusEntityEvent | OfferStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-bids-entities-OfferStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-bids-entities-OfferStatus").send(JSON.stringify(data));
    }
}
