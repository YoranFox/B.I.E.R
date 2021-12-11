import { Code } from 'src/codes/entities/code.entity';
import { RoutesMapper } from "@nestjs/core/middleware/routes-mapper";
import { Beverage } from "src/beverages/entities/beverage.entity";
import { Creator } from "src/creator/entities/creator.entity";
import { orderStatus } from "src/enums/order-status.enum";
import { Map } from "src/maps/entities/map.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "enum",
        enum: orderStatus,             
    })
    status: orderStatus;

    @ManyToOne(() => Map, {eager: true})
    map: Map;  
  
    @Column({nullable: true})
    coordX: number;

    @Column({nullable: true})
    coordY: number;

    @ManyToOne(() => Beverage, {eager: true})
    beverage: Beverage;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @ManyToOne(() => Code, {eager: true})
    code: Code;

    @Column({type: "timestamp", default: () => 'CURRENT_TIMESTAMP' })
    createdOn: Date;
}
