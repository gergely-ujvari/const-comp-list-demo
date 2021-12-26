import React from 'react';
import { CompanyList } from '/imports/ui/CompanyList';

export const App = () => (
    <div className="ccl-root">
        <h1 className="ccl-main-title">ConstComp Test Application</h1>
        <div>
            <CompanyList />
        </div>
    </div>
);
