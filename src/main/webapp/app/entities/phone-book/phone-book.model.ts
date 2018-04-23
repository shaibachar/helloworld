import { BaseEntity } from './../../shared';

export class PhoneBook implements BaseEntity {
    constructor(
        public id?: number,
        public firstName?: string,
        public lastName?: string,
        public phone?: string,
        public clientName?: string,
        public clientId?: number,
    ) {
    }
}
