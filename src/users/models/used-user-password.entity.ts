import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { baseScopes } from 'src/common/base/base.scopes';
import { User } from './user.entity';

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
  byPassword: (password: string) => ({ where: { password } }),
}))
@Table({
  tableName: 'usedUserPasswords',
  timestamps: true,
  underscored: false,
})
export class UsedUserPassword extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  userId: number;
}
