import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import * as basicData from './basic_company_data.json';
import type { Company } from '/imports/model/Company';
import { CompanyQueryData } from '/imports/model/CompanyQueryData';
import type { QueryResult } from '/imports/model/QueryResult';
import { getAllSpecialities } from '/imports/db/specialities';
import { LOGO_HEIGHT, LOGO_WIDTH, TEST_COMPANIES } from '/imports/consts';
/*
 * This module emulates the db layer for the company data.
 *
 * It's responsible for populating the company data to memory.
 * Besides the json data it also generates random company data
 *
 * The other main responsibility that it provides a companyQuery() function to properly filter the data
 */
let specialities: string[] = [];
const companies: Company[] = [];

function generateCompany(): Company {
    const specNumber = Math.round(Math.random() * specialities.length);
    const specs: string[] = [];
    for (let i = 0; i < specNumber; i++) {
        specs.push(specialities[Math.floor(Math.random() * specialities.length)]);
    }

    return {
        id: companies.length + 1,
        name: faker.company.companyName(),
        // Only save each speciality once
        specialities: specs.filter((v, i, a) => a.indexOf(v) === i),
        city: faker.address.city(),
        logo: faker.image.business(LOGO_WIDTH, LOGO_HEIGHT),
    };
}

Meteor.startup(() => {
    console.log('*** Generating company data');
    // We assume that the basic json data is correct
    specialities = getAllSpecialities();
    basicData.data.forEach((d) => {
        companies.push(d);
    });

    // Generate more company data
    for (let i = 0; i < TEST_COMPANIES; i++) {
        companies.push(generateCompany());
    }
});

export function companyQuery(query: CompanyQueryData): QueryResult<Company> {
    const specialityFilter = query.specialities
        ? (c: Company) => c.specialities.filter((s) => query.specialities.includes(s)).length
        : () => true;

    const searchTermFilter = query.searchTerm
        ? (c: Company) => c.name.toLowerCase().indexOf(query.searchTerm.toLowerCase()) > -1
        : () => true;

    const filteredData = companies.filter(specialityFilter).filter(searchTermFilter);
    const from = query.skip != null ? query.skip : 0;
    const to = query.limit ? Math.max(filteredData.length - 1, from + query.limit) : filteredData.length - 1;

    return {
        data: filteredData.slice(from, to),
        from,
        to,
        total: filteredData.length,
    };
}
