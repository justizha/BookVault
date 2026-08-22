import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function CategoryCombobox({
    categories,
    value,
    onChange,
}: {
    categories: { category: string; count: number }[];
    value?: string;
    onChange: (value: string | undefined) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-52 justify-between"
                    />
                }
            >
                {value ?? "All categories"}
                <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-52 p-0">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="all"
                                onSelect={() => {
                                    onChange(undefined);
                                    setOpen(false);
                                }}
                            >
                                <CheckIcon
                                    className={cn(
                                        "mr-2 size-4",
                                        !value ? "opacity-100" : "opacity-0",
                                    )}
                                />
                                All categories
                            </CommandItem>
                            {categories.map((c) => (
                                <CommandItem
                                    key={c.category}
                                    value={c.category}
                                    onSelect={(currentValue) => {
                                        onChange(
                                            currentValue === value
                                                ? undefined
                                                : currentValue,
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 size-4",
                                            value === c.category
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {c.category} ({c.count})
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
