import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface BidStatusEntity {
    readonly Id: number;
    Name?: string;
}

export interface BidStatusCreateEntity {
    readonly Name?: string;
}

export interface BidStatusUpdateEntity extends BidStatusCreateEntity {
    readonly Id: number;
}

export interface BidStatusEntityOptions {
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
    $select?: (keyof BidStatusEntity)[],
    $sort?: string | (keyof BidStatusEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface BidStatusEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<BidStatusEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface BidStatusUpdateEntityEvent extends BidStatusEntityEvent {
    readonly previousEntity: BidStatusEntity;
}

export class BidStatusRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_BIDSTATUS",
        properties: [
            {
                name: "Id",
                column: "BIDSTATUS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "BIDSTATUS_NAME",
                type: "VARCHAR",
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(BidStatusRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: BidStatusEntityOptions): BidStatusEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): BidStatusEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: BidStatusCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_BIDSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "BIDSTATUS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: BidStatusUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_BIDSTATUS",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "BIDSTATUS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: BidStatusCreateEntity | BidStatusUpdateEntity): number {
        const id = (entity as BidStatusUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as BidStatusUpdateEntity);
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
            table: "CODBEX_BIDSTATUS",
            entity: entity,
            key: {
                name: "Id",
                column: "BIDSTATUS_ID",
                value: id
            }
        });
    }

    public count(options?: BidStatusEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__BIDSTATUS"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: BidStatusEntityEvent | BidStatusUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-bids-entities-BidStatus", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-bids-entities-BidStatus").send(JSON.stringify(data));
    }
}
