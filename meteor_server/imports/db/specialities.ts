import * as specJson from './specialities_data.json';
/*
 * This thin module provides the specialities' data. The available specialities are read from a json file.
 * For the sake of simplicity, the client also gets this data directly.
 */

const specialities = specJson.specialities;

export function getAllSpecialities() {
    return specialities.slice().sort();
}

export function numberOfSpecialities() {
    return specialities.length;
}
