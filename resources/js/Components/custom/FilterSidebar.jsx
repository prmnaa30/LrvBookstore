// resources/js/Components/FilterSidebar.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
// import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";

const SearchableFilterList = ({ title, items, selected, onChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AccordionItem value={title}>
            <AccordionTrigger>{title}</AccordionTrigger>
            <AccordionContent className="space-y-4">
                <Input
                    placeholder={`Cari ${title.toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-neutral-50"
                />
                <ScrollArea className="h-48 pr-3">
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`${title}-${item.id}`}
                                    checked={selected.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        const newSelected = checked
                                            ? [...selected, item.id]
                                            : selected.filter(
                                                  (id) => id !== item.id
                                              );
                                        onChange(newSelected);
                                    }}
                                />
                                <Label
                                    htmlFor={`${title}-${item.id}`}
                                    className="font-normal"
                                >
                                    {item.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </AccordionContent>
        </AccordionItem>
    );
};

export function FilterSidebar({ filterData, activeFilters, onApplyFilters }) {
    const [categories, setCategories] = useState(
        activeFilters.categories || []
    );
    const [categoryLogic, setCategoryLogic] = useState(
        activeFilters.category_logic || "OR"
    );
    const [authors, setAuthors] = useState(activeFilters.authors || []);
    const [stores, setStores] = useState(activeFilters.stores || []);
    const [status, setStatus] = useState(activeFilters.status || []);
    const [yearRange, setYearRange] = useState([
        activeFilters.year_min || filterData.year_range.min,
        activeFilters.year_max || filterData.year_range.max,
    ]);
    const [ratingRange, setRatingRange] = useState([
        activeFilters.rating_min || filterData.rating_range.min,
        activeFilters.rating_max || filterData.rating_range.max,
    ]);

    const handleApply = () => {
        onApplyFilters({
            categories,
            category_logic: categoryLogic,
            authors,
            stores,
            status,
            year_min: yearRange[0],
            year_max: yearRange[1],
            rating_min: ratingRange[0],
            rating_max: ratingRange[1],
        });
    };

    const handleReset = () => {
        setCategories([]);
        setCategoryLogic("OR");
        setAuthors([]);
        setStores([]);
        setStatus([]);
        setYearRange([filterData.year_range.min, filterData.year_range.max]);
        setRatingRange([
            filterData.rating_range.min,
            filterData.rating_range.max,
        ]);

        onApplyFilters({});
    };

    return (
        <aside className="lg:col-span-1 mt-10 lg:mt-0">
            <div className="sticky top-24 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Filter</h3>
                    <Button size="sm" onClick={handleReset}>
                        Reset
                    </Button>
                </div>

                <Accordion type="multiple" defaultValue={["Kategori"]}>
                    {/* Filter Kategori (dengan AND/OR) */}
                    <AccordionItem value="Kategori">
                        <AccordionTrigger>Kategori</AccordionTrigger>
                        <AccordionContent>
                            <RadioGroup
                                value={categoryLogic}
                                onValueChange={setCategoryLogic}
                                className="my-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="OR" id="or-logic" />
                                    <Label htmlFor="or-logic">
                                        Logika ATAU (default)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="AND"
                                        id="and-logic"
                                    />
                                    <Label htmlFor="and-logic">
                                        Logika DAN (lebih ketat)
                                    </Label>
                                </div>
                            </RadioGroup>
                            <SearchableFilterList
                                title="Daftar Kategori"
                                items={filterData.categories}
                                selected={categories}
                                onChange={setCategories}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Filter Penulis */}
                    <SearchableFilterList
                        title="Penulis"
                        items={filterData.authors}
                        selected={authors}
                        onChange={setAuthors}
                    />

                    {/* Filter Toko */}
                    <SearchableFilterList
                        title="Lokasi Toko"
                        items={filterData.stores}
                        selected={stores}
                        onChange={setStores}
                    />

                    {/* Filter Status */}
                    <AccordionItem value="Status">
                        <AccordionTrigger>Status Ketersediaan</AccordionTrigger>
                        <AccordionContent className="space-y-2 pt-2">
                            {["available", "rented", "reserved"].map((s) => (
                                <div
                                    key={s}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={`status-${s}`}
                                        checked={status.includes(s)}
                                        onCheckedChange={(checked) => {
                                            const newStatus = checked
                                                ? [...status, s]
                                                : status.filter(
                                                      (val) => val !== s
                                                  );
                                            setStatus(newStatus);
                                        }}
                                    />
                                    <Label
                                        htmlFor={`status-${s}`}
                                        className="font-normal capitalize"
                                    >
                                        {s}
                                    </Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Filter Tahun Terbit */}
                    <AccordionItem value="Tahun Terbit">
                        <AccordionTrigger>
                            Tahun Terbit ({yearRange[0]} - {yearRange[1]})
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2">
                            <Slider
                                min={filterData.year_range.min}
                                max={filterData.year_range.max}
                                step={1}
                                value={yearRange}
                                onValueChange={setYearRange}
                                minStepsBetweenThumbs={1}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{filterData.year_range.min}</span>
                                <span>{filterData.year_range.max}</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Filter Rating */}
                    <AccordionItem value="Rating">
                        <AccordionTrigger>
                            Rating ({ratingRange[0]} - {ratingRange[1]})
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-2">
                            <Slider
                                min={filterData.rating_range.min}
                                max={filterData.rating_range.max}
                                step={1}
                                value={ratingRange}
                                onValueChange={setRatingRange}
                                minStepsBetweenThumbs={1}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{filterData.rating_range.min} ★</span>
                                <span>{filterData.rating_range.max} ★</span>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <Button size="lg" className="w-full" onClick={handleApply}>
                    Terapkan Filter
                </Button>
            </div>
        </aside>
    );
}
