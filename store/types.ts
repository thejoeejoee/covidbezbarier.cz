import * as _ from "lodash";
import {BaseObject} from "~/store/base";

export enum PlaceType {
    TESTING = 'T',
    VACCINATION = 'V',
}

export abstract class BasePlace extends BaseObject {
    readonly abstract type: PlaceType;
    readonly latitude: number;
    readonly longitude: number;

    protected constructor(
        readonly id: string,
        readonly name: string,
        readonly address: string,
        lat: string,
        long: string
    ) {
        super();
        this.latitude = Number(lat)
        this.longitude = Number(long)
    }
}

export class TestingPlace extends BasePlace {
    type = PlaceType.TESTING

    readonly okres_nuts_kod!: string//"CZ0100",
    readonly operacni_status!: boolean //true,
    readonly testovaci_kapacita!: bigint
    readonly nasofaryngealni_odber!: boolean //
    readonly orofaryngealni_odber!: boolean //
    readonly antigenni_odber!: boolean //
    readonly drive_in!: boolean //

    constructor(raw: any) {
        super(
            raw.odberove_misto_id,
            raw.odberove_misto_nazev,
            raw.odberove_misto_adresa,
            raw.latitude,
            raw.longitude,
        )
        _.assign(
            this,
            _.pick(
                raw,
                [
                    'okres_nuts_kod',
                    'operacni_status',
                    'testovaci_kapacita',
                    'nasofaryngealni_odber',
                    'orofaryngealni_odber',
                    'antigenni_odber',
                    'drive_in',
                ]
            )
        )
    }
}

export class VaccinationPlace extends BasePlace {
    type = PlaceType.VACCINATION

    readonly okres_nuts_kod!: string
    readonly nrpzs_kod!: string
    readonly operacni_status!: boolean
    readonly minimalni_kapacita!: bigint
    readonly bezbarierovy_pristup!: boolean

    constructor(raw: any) {
        super(
            raw.ockovaci_misto_id,
            raw.ockovaci_misto_nazev,
            raw.ockovaci_misto_adresa,
            raw.latitude,
            raw.longitude,
        )
        _.assign(
            this,
            _.pick(
                raw,
                [
                    'okres_nuts_kod',
                    'operacni_status',
                    'nrpzs_kod',
                    'minimalni_kapacita',
                    'bezbarierovy_pristup',
                ]
            )
        )
    }
}
