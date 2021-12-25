import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import * as basicData from './basic_company_data.json';
import type { Company } from '/imports/model/Company';
import { CompanyQueryData } from '/imports/model/CompanyQueryData';
import type { QueryResult } from '/imports/model/SearchResult';
import { getAllSpecialities } from '/imports/db/specialities';

const TEST_COMPANIES = 512;

let specialities: string[] = [];
const companies: Company[] = [];

function generateCompany(): Company {
    const specNumber = Math.round(Math.random() * specialities.length);
    const specs: string[] = [];
    for (let i = 0; i < specNumber; i++) {
        specs.push(specialities[Math.floor(Math.random() * specialities.length)]);
    }

    return {
        id: companies.length,
        name: faker.company.companyName(),
        specialities: specs,
        city: faker.address.city(),
        logo: faker.image.business(100, 100),
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

    const matches = companies.filter(specialityFilter).filter(searchTermFilter);
    const from = query.skip != null ? query.skip : 0;
    const to = query.limit ? Math.max(matches.length - 1, from + query.limit) : matches.length - 1;

    return {
        data: matches.slice(from, to),
        from,
        to,
        total: matches.length,
    };
}
