/**
 * HeaderCitySelector — compact header widget for choosing a destination city.
 *
 * UX:
 *  - Trigger shows flag + city name when a selection exists, otherwise a MapPin.
 *  - Dropdown: Radix Popover + cmdk Command for instant search + grouped results.
 *  - Keyboard: arrow keys + Enter handled natively by cmdk; Escape closes.
 *  - Accessibility: aria-expanded on trigger, role="combobox" on search input.
 */
import * as React from "react";
import { Link } from "wouter";
import { MapPin, ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cities } from "@/data/cities";
import { countries } from "@/data/countries";
import { useCityLocation } from "@/context/location-context";

// Reuse the same flag map as city-combobox to stay consistent.
const FLAG: Record<string, string> = {
  nl: "🇳🇱", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", hu: "🇭🇺",
  es: "🇪🇸", be: "🇧🇪", ch: "🇨🇭", at: "🇦🇹", pt: "🇵🇹",
  dk: "🇩🇰", se: "🇸🇪",
};

// Pre-grouped for the dropdown (order mirrors data file order).
const CITY_GROUPS = Object.entries(
  cities.reduce<Record<string, typeof cities>>((acc, c) => {
    (acc[c.countryId] ??= []).push(c);
    return acc;
  }, {}),
);

export function HeaderCitySelector() {
  const { state, setLocation, clearLocation } = useCityLocation();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const selectedCity = state.cityId
    ? cities.find((c) => c.id === state.cityId)
    : null;
  const selectedCountry = state.countryId
    ? countries.find((c) => c.id === state.countryId)
    : null;

  function handleSelect(cityId: string, countryId: string) {
    setLocation(countryId, cityId);
    setOpen(false);
    // Return focus to trigger so keyboard users stay oriented.
    setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function handleClear(e: React.MouseEvent | React.KeyboardEvent) {
    e.stopPropagation(); // don't re-open the popover
    clearLocation();
  }

  const triggerLabel =
    selectedCity && selectedCountry
      ? `${FLAG[selectedCountry.id] ?? ""} ${selectedCity.name}`
      : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          aria-label={
            triggerLabel
              ? `Destination: ${selectedCity?.name}. Change city`
              : "Select your destination city"
          }
          aria-expanded={open}
          aria-haspopup="listbox"
          className="flex items-center gap-1.5 text-sm font-medium rounded-md border border-border px-2.5 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        >
          {triggerLabel ? (
            <>
              <span className="max-w-[130px] truncate leading-none">
                {triggerLabel}
              </span>
              {/* Separate clear affordance — stops propagation so popover doesn't open */}
              <span
                role="button"
                tabIndex={0}
                aria-label={`Clear destination: ${selectedCity?.name}`}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClear(e);
                }}
                className="ml-0.5 rounded p-0.5 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3 h-3" />
              </span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden />
              <span>Your city</span>
              <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-60" aria-hidden />
            </>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" sideOffset={6} className="p-0 w-64">
        <Command>
          <CommandInput
            placeholder="Search country or city…"
            aria-label="Search destination"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-4 text-center text-sm text-muted-foreground">
              No cities found
            </CommandEmpty>

            {CITY_GROUPS.map(([countryId, countryCities]) => {
              const country = countries.find((c) => c.id === countryId);
              return (
                <CommandGroup
                  key={countryId}
                  heading={`${FLAG[countryId] ?? ""} ${country?.name ?? countryId}`}
                >
                  {countryCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      // cmdk searches on this value — include country name for cross-search
                      value={`${city.name} ${country?.name ?? ""}`}
                      onSelect={() => handleSelect(city.id, countryId)}
                      className="cursor-pointer flex items-center justify-between"
                    >
                      <span>{city.name}</span>
                      {city.id === state.cityId && (
                        <span
                          aria-label="Currently selected"
                          className="text-accent text-xs font-semibold"
                        >
                          ✓
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>

          {/* Footer link */}
          <div className="border-t px-3 py-2">
            <Link
              href="/countries"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Not sure yet? Browse all countries →
            </Link>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
