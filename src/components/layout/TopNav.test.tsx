import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { TopNav } from "./TopNav";
import { NAV_ITEMS } from "@/nav";

// Stub wouter — no Router context needed in unit tests
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
  useLocation: () => ["/quiz", () => {}],
}));


describe("TopNav", () => {
  it("renders all 5 nav item labels in the DOM", () => {
    render(<TopNav />);
    for (const item of NAV_ITEMS) {
      // Each label may appear in multiple responsive variants
      expect(screen.getAllByText(item.label).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("marks the active route with aria-current=page", () => {
    // useLocation returns "/quiz" → "Where to Move" links should be aria-current
    render(<TopNav />);
    const links = screen.getAllByRole("link", { name: "Where to Move" });
    expect(links.some((el) => el.getAttribute("aria-current") === "page")).toBe(true);
  });

  it("does not mark an inactive link as aria-current", () => {
    render(<TopNav />);
    const links = screen.getAllByRole("link", { name: "Compare Cities" });
    expect(links.every((el) => el.getAttribute("aria-current") === null)).toBe(true);
  });

  it("renders the mobile hamburger button", () => {
    render(<TopNav />);
    const btn = screen.getByRole("button", { name: /open menu/i });
    expect(btn).toBeDefined();
  });
});
