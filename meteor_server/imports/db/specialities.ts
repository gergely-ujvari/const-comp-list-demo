import * as specJson from './specialities_data.json';

/*
 * For the sake of simplicity of this demo, the specialities are read staticly from a json file
 * and the client also gets this data
 */

const specialities = specJson.specialities;

export function getAllSpecialities() {
    return specialities.slice().sort();
}
