import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import App from "./App";
test("renders Vite React app", () => {
    render(_jsx(App, {}));
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
});
test("renders Vite + React + SCSS heading", () => {
    render(_jsx(App, {}));
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
});
