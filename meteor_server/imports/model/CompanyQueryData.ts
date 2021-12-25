import { Validator } from 'jsonschema';

/*
 * The IF to describe the query data to filter companies
 */
export interface CompanyQueryData {
    searchTerm?: string;
    specialities?: string[];
    skip?: number;
    limit?: number;
}

const companyQueryDataSchema = {
    type: 'object',
    properties: {
        searchTerm: {
            type: 'string',
        },
        specialities: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        skip: {
            type: 'number',
        },
        limit: {
            type: 'number',
        },
    },
};

const validator = new Validator();

export function validateCompanySearchData(data: object | undefined): boolean {
    if (data == null) {
        return false;
    }

    return validator.validate(data, companyQueryDataSchema).valid;
}
