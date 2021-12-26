// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// see https://docs.cypress.io/api/events/catalog-of-events.html#Examples
Cypress.on('uncaught:exception', (err, runnable) => {
    // this error happens form time to time -- we just ignore it
    // see https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    if (err.message && /ResizeObserver loop limit exceeded/.test(err.message)) {
        return false;
    }
    // return false to prevent the error from
    // failing this test
    return false
});
