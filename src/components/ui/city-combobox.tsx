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
import { cities } from "@/data/cities";
import { countries } from "@/data/countries";

// ── Country metadata ────────────────────────────────────────────────────────
// Flag emoji keyed by country ID — single source of truth for flag display.
// `countries.ts` stores 2-letter codes in flagEmoji; real emoji lives here.
const FLAG_EMOJI: Record<string, string> = {
  nl: "🇳🇱", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", hu: "🇭🇺",
  es: "🇪🇸", be: "🇧🇪", ch: "🇨🇭", at: "🇦🇹", pt: "🇵🇹",
  dk: "🇩🇰", se: "🇸🇪", gb: "🇬🇧", pl: "🇵🇱", cz: "🇨🇿",
};

// Auto-derived from countries data — always in sync, no manual maintenance.
const COUNTRY_META: Record<string, { label: string; flag: string }> = Object.fromEntries(
  countries.map((c) => [c.id, { label: c.name, flag: FLAG_EMOJI[c.id] ?? "" }])
);

// Group cities by country, preserving natural order
const CITY_GROUPS = Object.entries(
  cities.reduce<Record<string, typeof cities>>((acc, city) => {
    const key = city.countryId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(city);
    return acc;
  }, {})
);

interface CityComboboxProps {
  value: string;
  onChange: (value: string) => void;
  /** City ID to dim (already selected in the other slot) */
  excludeId?: string;
  placeholder?: string;
  /** aria-label for the trigger button */
  label?: string;
  "data-testid"?: string;
}

export function CityCombobox({
  value,
  onChange,
  excludeId,
  placeholder = "Search cities…",
  label = "Select a city",
  "data-testid": testId,
}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedCity = cities.find((c) => c.id === value);

  function handleSelect(cityId: string) {
    onChange(cityId);
    setOpen(false);
    // Return focus to trigger so keyboard users stay oriented
    setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation(); // don't open the popover
    onChange("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          data-testid={testId}
          className={cn(
            // Match the visual style of other form controls on the page
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            open && "ring-2 ring-ring ring-offset-2"
          )}
        >
          <span className={cn("truncate", !selectedCity && "text-muted-foreground")}>
            {selectedCity ? selectedCity.name : placeholder}
          </span>

          <span className="ml-2 flex items-center gap-1 flex-shrink-0">
            {selectedCity && (
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear ${label}`}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onChange("");
                  }
                }}
                className="rounded p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground opacity-60" />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        // Width tracks the trigger button
        className="p-0 w-[var(--radix-popover-trigger-width)]"
      >
        <Command>
          <CommandInput
            placeholder="Search cities…"
            aria-label="Search cities"
            className="h-10"
          />
          <CommandList className="max-h-[min(320px,60dvh)]">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No cities found.
            </CommandEmpty>

            {CITY_GROUPS.map(([countryId, countryCities]) => {
              const meta = COUNTRY_META[countryId] ?? { label: countryId, flag: "" };
              return (
                <CommandGroup
                  key={countryId}
                  heading={`${meta.flag} ${meta.label}`}
                >
                  {countryCities.map((city) => {
                    const isSelected = city.id === value;
                    const isExcluded = city.id === excludeId;

                    return (
                      <CommandItem
                        key={city.id}
                        value={`${city.name} ${meta.label}`} // search both city + country
                        disabled={isExcluded}
                        onSelect={() => {
                          if (!isExcluded) handleSelect(city.id);
                        }}
                        className={cn(
                          "flex items-center justify-between py-2.5 cursor-pointer",
                          isExcluded && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <span>{city.name}</span>
                        <span className="ml-auto flex items-center gap-2 flex-shrink-0">
                          {isExcluded && (
                            <span className="text-xs text-muted-foreground">
                              already selected
                            </span>
                          )}
                          {isSelected && (
                            <Check className="h-4 w-4 text-accent" aria-hidden="true" />
                          )}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
