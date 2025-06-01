
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search designs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default SearchBar;
