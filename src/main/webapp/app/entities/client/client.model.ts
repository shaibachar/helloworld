import { BaseEntity } from './../../shared';

export const enum Gender {
    'MALE',
    'FEMALE'
}

export class Client implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public address?: string,
        public email?: string,
        public gender?: Gender,
        public phoneBooks?: BaseEntity[],
    ) {
    }
}
