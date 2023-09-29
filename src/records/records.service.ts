import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BaseService } from 'src/common/base/base.service';
import { Provides } from 'src/common/resources/common/provides';
import { TranslatorService } from 'nestjs-translator';
import { Record } from './models';
import { WorkingTimesService } from 'src/working-times/working-times.service';
import { DateTime } from 'luxon';
import {
  DEFAULT_DATE_FORMAT,
  FULL_TIME_FORMAT,
} from 'src/common/resources/common/dataFormats';
import { Transaction } from 'sequelize/types';
import { ScopeOptions } from 'sequelize';

@Injectable()
export class RecordsService extends BaseService<Record> {
  constructor(
    @Inject(Provides.record)
    protected readonly model: Repository<Record>,
    private readonly translator: TranslatorService,
    private readonly workingTimesService: WorkingTimesService,
  ) {
    super(model);
  }

  create(body: { [key: string]: string | number }, clientId: number) {
    return this.model.create({ ...body, clientId });
  }

  async getById(
    id: number,
    scopes = [],
    transaction?: Transaction,
  ): Promise<Record> {
    const record = await this.getOne(
      [...scopes, { method: ['byId', id] }],
      transaction,
    );

    if (!record) {
      throw new NotFoundException({
        message: this.translator.translate('ENTITY_NOT_FOUND', {
          replace: { entityName: 'Record' },
        }),
        errorCode: 'ENTITY_NOT_FOUND',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return record;
  }

  async validateBeforeCreate(
    body: { [key: string]: string | number },
    recordId?: number,
  ) {
    const scopes: (string | ScopeOptions)[] = [
      'notCanceled',
      { method: ['byBarber', body.barberId] },
      { method: ['byDate', body.date] },
    ];

    if (recordId) {
      scopes.push({ method: ['exceptIds', [recordId]] });
    }

    const existingAppointments = await this.getList(scopes);

    const startsAt = DateTime.fromFormat(`${body.startsAt}`, FULL_TIME_FORMAT);
    const endsAt = DateTime.fromFormat(`${body.endsAt}`, FULL_TIME_FORMAT);

    const isFreeSlot = existingAppointments.some((appointment) => {
      const existingRecordStartsAt = DateTime.fromFormat(
        appointment.startsAt,
        FULL_TIME_FORMAT,
      );

      const existingRecordEndsAt = DateTime.fromFormat(
        appointment.endsAt,
        FULL_TIME_FORMAT,
      );

      return (
        (startsAt >= existingRecordStartsAt &&
          startsAt < existingRecordEndsAt) ||
        (endsAt > existingRecordStartsAt && endsAt <= existingRecordEndsAt) ||
        (startsAt <= existingRecordStartsAt && endsAt > existingRecordEndsAt)
      );
    });

    if (isFreeSlot) {
      throw new BadRequestException({
        message: this.translator.translate('TIME_SLOT_BUSY'),
        errorCode: 'TIME_SLOT_BUSY',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async getAvailableSlots(date: string, barberId: number) {
    const workingTime = await this.workingTimesService.getOne([
      { method: ['byUser', barberId] },
      {
        method: [
          'byWeekday',
          DateTime.fromFormat(date, DEFAULT_DATE_FORMAT).weekday,
        ],
      },
    ]);

    if (!workingTime) {
      return [];
    }

    const startHour = parseInt(workingTime.startsAt.split(':')[0]);
    const endHour = parseInt(workingTime.endsAt.split(':')[0]);

    const existingAppointments = await this.getList([
      'notCanceled',
      { method: ['byBarber', barberId] },
      { method: ['byDate', date] },
    ]);

    const availableSlots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const slot = DateTime.fromFormat(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}:00`,
          FULL_TIME_FORMAT,
        );
        const isOccupiedSlot = existingAppointments.some((appointment) => {
          const startsAt = DateTime.fromFormat(
            appointment.startsAt,
            FULL_TIME_FORMAT,
          );
          const endsAt = DateTime.fromFormat(
            appointment.endsAt,
            FULL_TIME_FORMAT,
          );
          return startsAt <= slot && slot < endsAt;
        });

        if (!isOccupiedSlot) {
          availableSlots.push(slot.toFormat(FULL_TIME_FORMAT));
        }
      }
    }

    return availableSlots;
  }
}
