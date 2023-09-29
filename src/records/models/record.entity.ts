import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { baseScopes } from 'src/common/base/base.scopes';
import { Favor } from 'src/favor/models';
import { User } from 'src/users/models';

@Scopes(() => ({
  ...baseScopes,
  notCanceled: () => ({ where: { isCanceled: false } }),
  byDate: (date: string) => ({ where: { date } }),
  byBarber: (barberId: number) => ({ where: { barberId } }),
  orderBy: (
    order = 'desc',
    field = 'id',
    additionalOrder = false,
    anotherOrder = 'id',
  ) => ({
    order:
      field !== 'id' && additionalOrder
        ? [
            [field, order],
            [anotherOrder, order],
          ]
        : [[field, order]],
  }),
  withClient: () => ({
    include: [
      {
        model: User,
        as: 'client',
        required: false,
      },
    ],
  }),
  withBarber: () => ({
    include: [
      {
        model: User,
        as: 'barber',
        required: false,
      },
    ],
  }),
  withFavor: () => ({
    include: [
      {
        model: Favor,
        as: 'favor',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'records',
  timestamps: true,
  underscored: false,
})
export class Record extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  clientId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  barberId: number;

  @ForeignKey(() => Favor)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  favorId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startsAt: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endsAt: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isCanceled: boolean;

  @BelongsTo(() => User, 'clientId')
  client: User;

  @BelongsTo(() => User, 'barberId')
  barber: User;

  @BelongsTo(() => Favor, 'favorId')
  favor: Favor;
}
