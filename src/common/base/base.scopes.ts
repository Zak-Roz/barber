import { Op } from 'sequelize';

export const baseScopes = {
  byId: (id: number | number[]) => ({ where: { id } }),
  pagination: (limit: number, offset: number) => ({ limit, offset }),
  byUser: (userId: number | number[]) => ({ where: { userId } }),
  notDeleted: () => ({ where: { isDeleted: false } }),
  groupBy: (fields: string | string[]) => ({ group: fields }),
  subQuery: (subQuery: boolean) => ({ subQuery }),
  attributes: (attributes: string[] | []) => ({ attributes }),
  exceptIds: (ids: number[]) => ({
    where: { id: { [Op.notIn as symbol]: ids } },
  }),
};
