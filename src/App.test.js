import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from "./test-utils";
import App from "./App";
describe("App Component", () => {
    describe("Rendering", () => {
        test("renders main heading", () => {
            render(_jsx(App, {}));
            const heading = screen.getByTestId("main-heading");
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveTextContent("Vite + React");
        });
        test("renders Tailwind demo section", () => {
            render(_jsx(App, {}));
            const demoSection = screen.getByTestId("tailwind-demo");
            expect(demoSection).toBeInTheDocument();
            expect(demoSection).toHaveTextContent("Hello Tailwind + React!");
            expect(demoSection).toHaveTextContent("Your setup is working 🎉");
        });
        test("renders instruction text", () => {
            render(_jsx(App, {}));
            const instructionText = screen.getByTestId("instruction-text");
            expect(instructionText).toBeInTheDocument();
            expect(instructionText).toHaveTextContent("Click on the Vite and React logos to learn more");
        });
        test("renders Vite and React logos", () => {
            render(_jsx(App, {}));
            const viteLogo = screen.getByTestId("vite-logo");
            const reactLogo = screen.getByTestId("react-logo");
            expect(viteLogo).toBeInTheDocument();
            expect(viteLogo).toHaveAttribute("alt", "Vite logo");
            expect(reactLogo).toBeInTheDocument();
            expect(reactLogo).toHaveAttribute("alt", "React logo");
            expect(reactLogo).toHaveClass("animate-spin-slow");
        });
    });
    describe("Interactions", () => {
        test("increments counter on button click", () => {
            render(_jsx(App, {}));
            const button = screen.getByTestId("counter-button");
            // Initial state
            expect(button).toHaveTextContent("count is 0");
            // Click once
            fireEvent.click(button);
            expect(button).toHaveTextContent("count is 1");
            // Click again
            fireEvent.click(button);
            expect(button).toHaveTextContent("count is 2");
        });
        test("counter button has correct styles", () => {
            render(_jsx(App, {}));
            const button = screen.getByTestId("counter-button");
            expect(button).toHaveClass("bg-blue-600");
            expect(button).toHaveClass("text-white");
            expect(button).toHaveClass("rounded-lg");
        });
    });
    describe("Links", () => {
        test("Vite link has correct attributes", () => {
            render(_jsx(App, {}));
            const viteLink = screen.getByTestId("vite-link");
            expect(viteLink).toHaveAttribute("href", "https://vite.dev");
            expect(viteLink).toHaveAttribute("target", "_blank");
            expect(viteLink).toHaveAttribute("rel", "noopener noreferrer");
        });
        test("React link has correct attributes", () => {
            render(_jsx(App, {}));
            const reactLink = screen.getByTestId("react-link");
            expect(reactLink).toHaveAttribute("href", "https://react.dev");
            expect(reactLink).toHaveAttribute("target", "_blank");
            expect(reactLink).toHaveAttribute("rel", "noopener noreferrer");
        });
    });
    describe("Styling", () => {
        test("applies correct container classes", () => {
            render(_jsx(App, {}));
            const container = screen.getByTestId("app-container");
            expect(container).toHaveClass("min-h-screen");
            expect(container).toHaveClass("bg-gray-50");
            expect(container).toHaveClass("flex");
        });
    });
});
