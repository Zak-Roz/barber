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
import { User } from 'src/users/models';

@Scopes(() => ({
  ...baseScopes,
  byWeekday: (weekday: number) => ({ where: { weekday } }),
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
  withUser: () => ({
    include: [
      {
        model: User,
        as: 'user',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'workingTimes',
  timestamps: true,
  underscored: false,
})
export class WorkingTime extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  userId: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  weekday: number;

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

  @BelongsTo(() => User, 'userId')
  user: User;
}
