import type { IncomingMessage } from 'connect';
import type { ServerResponse } from 'http';
// This is the only downside for this package. No ts definitions yet.
import { JsonRoutes } from 'meteor/simple:json-routes';
import { CompanyQueryData, validateCompanySearchData } from '/imports/model/CompanyQueryData';
import { companyQuery } from '/imports/db/companyQuery';
/*
 * This module sets up our rest api endpoint(s).
 */

// Make sure that these endpoints can be called from anywhere
JsonRoutes.add('options', '/api/v1/*', (_: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
});

/*
 * The req object we got from this package (can be moved to global.d.ts)
 */
interface Request extends IncomingMessage {
    params: Record<string, string>;
    query: Record<string, string>;
    body: object;
    originalUrl: string;
}

function sendResult(res: ServerResponse, code: number, message: string) {
    JsonRoutes.sendResult(res, {
        code,
        data: {
            status: code,
            message,
        },
    });
}

JsonRoutes.add('post', '/api/v1/companies/search', (req: Request, res: ServerResponse) => {
    // Let's start with data validation
    if (!validateCompanySearchData(req.body)) {
        console.error('Validation failed');
        sendResult(res, 400, 'Invalid search data');
        return;
    }

    // QueryData validated
    const query = req.body as CompanyQueryData;

    // Query data
    const result = companyQuery(query);

    // And send it back
    res.write(JSON.stringify(result, null, 2));
    res.end();
});
