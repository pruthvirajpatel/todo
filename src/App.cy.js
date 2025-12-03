import { jsx as _jsx } from "react/jsx-runtime";
import App from './App';
describe('<App />', () => {
    it('renders', () => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(_jsx(App, {}));
    });
});
