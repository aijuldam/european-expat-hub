/**
 * AppCombobox — the site-wide standard for dropdown/select inputs.
 *
 * Built on Radix Popover + cmdk Command so it inherits:
 *   - portal rendering (no z-index / overflow-clip issues)
 *   - viewport-aware collision detection + collisionPadding (set in popover.tsx)
 *   - full keyboard nav: arrows, Enter, Escape, Tab
 *   - close on outside click or Escape automatically
 *
 * Usage patterns:
 *   // Simple list (search hidden when ≤8 options by default)
 *   <AppCombobox value={val} onChange={setVal} options={OPTIONS} />
 *
 *   // Force search on (17-country salary calculator)
 *   <AppCombobox value={val} onChange={setVal} options={OPTIONS} searchable />
 *
 *   // Grouped options
 *   <AppCombobox options={[{ value:"a", label:"A", group:"Group 1" }, ...]} ... />
 *
 *   // Clearable
 *   <AppCombobox clearable value={val} onChange={setVal} options={OPTIONS} />
 */

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  /** Primary label rendered in the list and trigger */
  label: string;
  /** Optional secondary text (e.g. currency code) — shown in list only */
  sublabel?: string;
  /** Optional group heading. Options sharing the same group string are grouped */
  group?: string;
  disabled?: boolean;
}

export interface AppComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  /** Placeholder shown when nothing is selected */
  placeholder?: string;
  /** Placeholder inside the search input */
  searchPlaceholder?: string;
  /**
   * Show the search input.
   * Auto-defaults to true when options.length > 8, false otherwise.
   * Pass explicitly to override.
   */
  searchable?: boolean;
  /** Show a clear (×) button when a value is selected */
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  /** Accessible label for the trigger button */
  "aria-label"?: string;
  "data-testid"?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function AppCombobox({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  searchable,
  clearable = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  "data-testid": testId,
}: AppComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  // Auto-enable search for long lists
  const isSearchable = searchable ?? options.length > 8;

  const selected = options.find((o) => o.value === value) ?? null;

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
    // Return focus to trigger so keyboard users stay oriented
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleClear(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation();
    onChange("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  // ── Group options ──────────────────────────────────────────────────────────
  // Build an ordered map: { groupName -> options[] }
  // Options without a group go into the "" (ungrouped) bucket rendered first.
  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const opt of options) {
      const key = opt.group ?? "";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(opt);
    }
    return map;
  }, [options]);

  const hasGroups = groups.size > 1 || (groups.size === 1 && !groups.has(""));

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel ?? placeholder}
          aria-disabled={disabled}
          data-testid={testId}
          disabled={disabled}
          className={cn(
            // Matches h-9 of shadcn Select on desktop, min 44 px touch target on mobile
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            open && "ring-2 ring-ring ring-offset-2",
            className
          )}
        >
          {/* Selected label or placeholder */}
          <span className={cn("truncate", !selected && "text-muted-foreground")}>
            {selected ? selected.label : placeholder}
          </span>

          {/* Right slot: clear + chevron */}
          <span className="ml-2 flex flex-shrink-0 items-center gap-1">
            {clearable && selected && (
              <button
                type="button"
                aria-label={`Clear selection`}
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
                // Ensure the inner button doesn't accidentally open the popover
                onPointerDown={(e) => e.stopPropagation()}
                className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-60" aria-hidden="true" />
          </span>
        </button>
      </PopoverTrigger>

      {/* ── Dropdown panel ── */}
      <PopoverContent
        align="start"
        sideOffset={4}
        // Width always matches the trigger button
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        // Prevent closing when clicking inside (Radix default is to close on outside only)
        onOpenAutoFocus={(e) => {
          // Auto-focus the search input when searchable, otherwise the list
          if (!isSearchable) e.preventDefault();
        }}
      >
        <Command>
          {/* Search input — shown only when searchable */}
          {isSearchable && (
            <CommandInput
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-10"
            />
          )}

          <CommandList
            // Viewport-aware max-height: 320px desktop, 60dvh mobile
            className="max-h-[min(320px,60dvh)]"
            aria-label="Options"
          >
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>

            {hasGroups
              ? // ── Grouped rendering ─────────────────────────────────────
                Array.from(groups.entries()).map(([groupName, opts]) => (
                  <CommandGroup key={groupName} heading={groupName || undefined}>
                    {opts.map((opt) => (
                      <OptionItem
                        key={opt.value}
                        opt={opt}
                        isSelected={opt.value === value}
                        onSelect={handleSelect}
                      />
                    ))}
                  </CommandGroup>
                ))
              : // ── Flat rendering ────────────────────────────────────────
                options.map((opt) => (
                  <OptionItem
                    key={opt.value}
                    opt={opt}
                    isSelected={opt.value === value}
                    onSelect={handleSelect}
                  />
                ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// ── Single option row ────────────────────────────────────────────────────────

function OptionItem({
  opt,
  isSelected,
  onSelect,
}: {
  opt: ComboboxOption;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <CommandItem
      // cmdk uses `value` for fuzzy search matching — include sublabel so
      // e.g. "CZK" matches "Czech Republic (CZK)"
      value={opt.sublabel ? `${opt.label} ${opt.sublabel}` : opt.label}
      disabled={opt.disabled}
      onSelect={() => {
        if (!opt.disabled) onSelect(opt.value);
      }}
      // min 44 px touch target via py-2.5
      className={cn(
        "flex cursor-pointer items-center justify-between py-2.5",
        opt.disabled && "cursor-not-allowed opacity-40"
      )}
      aria-selected={isSelected}
    >
      <span className="flex flex-col">
        <span>{opt.label}</span>
        {opt.sublabel && (
          <span className="text-xs text-muted-foreground">{opt.sublabel}</span>
        )}
      </span>
      {isSelected && (
        <Check className="ml-auto h-4 w-4 flex-shrink-0 text-accent" aria-hidden="true" />
      )}
    </CommandItem>
  );
}
