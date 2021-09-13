import { RoutesMapper } from "@nestjs/core/middleware/routes-mapper";
import { Beverage } from "src/beverages/entities/beverage.entity";
import { Map } from "src/maps/entities/map.entity";
import { Column, Entity, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => RoutesMapper, {eager: true})
    map: Map;  
  
    @Column({nullable: true})
    coordX: number;

    @Column({nullable: true})
    coordY: number;

    @ManyToOne(() => Beverage, {eager: true})
    beverage: Beverage;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
