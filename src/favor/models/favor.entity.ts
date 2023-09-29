import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';
import { baseScopes } from 'src/common/base/base.scopes';

@Scopes(() => ({
  ...baseScopes,
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
}))
@Table({
  tableName: 'favors',
  timestamps: true,
  underscored: false,
})
export class Favor extends Model {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  duration: number;
}
