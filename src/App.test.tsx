import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Vite React app", () => {
  render(<App />);
  expect(screen.getByText("Vite + React")).toBeInTheDocument();
});

test("renders Vite + React + SCSS heading", () => {
  render(<App />);
  expect(screen.getByText("Vite + React")).toBeInTheDocument();
});
