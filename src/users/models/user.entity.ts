import { UserRoles } from 'src/common/resources/users';
import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  HasMany,
} from 'sequelize-typescript';
import { PasswordHelper } from 'src/common/utils/helpers/password.helper';
import { File } from 'src/files/models';
import { baseScopes } from 'src/common/base/base.scopes';
import { UsedUserPassword } from './used-user-password.entity';
import { WorkingTime } from 'src/working-times/models';

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
  byEmail: (email: string) => ({ where: { email } }),
  byRoles: (role: number) => ({ where: { role } }),
  byIsVerified: (isVerified: boolean) => ({ where: { isVerified } }),
  withAvatar: () => ({
    include: [
      {
        model: File,
        as: 'avatar',
        required: false,
      },
    ],
  }),
  withWorkingTime: () => ({
    include: [
      {
        model: WorkingTime,
        as: 'workingTime',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: UserRoles.user,
  })
  role: UserRoles;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  salt: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  avatarId: number;

  @HasMany(() => WorkingTime, 'userId')
  workingTime: WorkingTime[];

  @BelongsTo(() => File, 'avatarId')
  avatar: File;

  @BeforeCreate
  static hashPasswordBeforeCreate(model: User) {
    if (model.password) {
      model.salt = PasswordHelper.generateSalt();
      model.password = PasswordHelper.hash(model.password + model.salt);
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(model: User) {
    if (model.password && model.changed('password')) {
      model.password = PasswordHelper.hash(model.password + model.salt);
      await UsedUserPassword.create({
        userId: model.id,
        password: model.password,
      });
    }
  }

  @AfterCreate
  static async savePasswordAfterCreate(model: User) {
    if (model.password) {
      await UsedUserPassword.create({
        userId: model.id,
        password: model.password,
      });
    }
  }
}
