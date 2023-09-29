import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { baseScopes } from 'src/common/base/base.scopes';
import { VerificationTypes } from 'src/common/resources/verifications';
import { User } from 'src/users/models';

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
  byToken: (token: string) => ({ where: { token } }),
  byType: (type: VerificationTypes) => ({ where: { type } }),
  byIsUsed: (isUsed: boolean) => ({ where: { isUsed } }),
}))
@Table({
  tableName: 'verifications',
  timestamps: true,
  underscored: false,
})
export class Verification extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: 1,
  })
  attempt: number;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: VerificationTypes.email,
  })
  type: VerificationTypes;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  token: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isUsed: boolean;
}
