/*
 * The IF to describe a company entity
 */
export interface Company {
    id: number;
    name: string;
    // A placeholder will be used if not given
    logo?: string;
    specialities: string[];
    city: string;
}
