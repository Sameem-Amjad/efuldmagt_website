import { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { getUsers } from "../../../services/user.services";
import { getCompanies } from "../../../services/company.services";
import { useSelector } from "react-redux";

export default function SearchBar({ className, setSelectedUser, onFocus }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("user");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const { user: loginUser } = useSelector((s) => s.user);
    const containerRef = useRef();
    const inputRef = useRef();

    // ✅ Helper to perform the actual API call based on current state
    const fetchResults = async (query, type) => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            let searchResults = [];

            if (type === "user") {
                const res = await getUsers({ q: query });
                const currentUserId = loginUser?._id;
                searchResults = (res.data?.data?.users || [])
                    .filter((u) => u._id !== currentUserId)
                    .map((u) => ({ ...u, id: u._id, name: u.name, type: 'user' }));
            } else {
                const res = await getCompanies({ token: localStorage.getItem('token'), q: query });
                searchResults = (res.data?.data?.companies || [])
                    .map((c) => ({ ...c, id: c._id, name: c.companyName, type: 'company' }));
            }
            setResults(searchResults);
        } catch (err) {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Debounce wrapper that accepts both query and type to avoid stale closures
    const debouncedSearch = useCallback(
        debounce((query, type) => fetchResults(query, type), 400),
        [loginUser]
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsOpen(true);
        setFocusedIndex(-1);
        // ✅ Pass the current searchType explicitly to the debounced function
        debouncedSearch(value, searchType);
    };

    const handleTypeChange = (type) => {
        setSearchType(type);
        setResults([]);
        if (searchTerm.trim()) {
            // ✅ Trigger immediate search with the NEW type
            fetchResults(searchTerm, type);
        }
    };

    // ... handleSelect, handleClear, handleKeyDown remain the same ...
    const handleSelect = (item) => {
        setSelectedUser(item);
        setSearchTerm(item.name);
        setResults([]);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const handleClear = () => {
        setSearchTerm("");
        setResults([]);
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <div className="flex gap-4 mb-3 ml-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="radio"
                        name="searchType"
                        checked={searchType === "user"}
                        onChange={() => handleTypeChange("user")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm font-medium ${searchType === 'user' ? 'text-blue-600' : 'text-gray-500'}`}>
                        User
                    </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="radio"
                        name="searchType"
                        checked={searchType === "company"}
                        onChange={() => handleTypeChange("company")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm font-medium ${searchType === 'company' ? 'text-blue-600' : 'text-gray-500'}`}>
                        Company
                    </span>
                </label>
            </div>

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    placeholder={`Search for a ${searchType}...`}
                    value={searchTerm}
                    onChange={handleChange}
                    onFocus={() => { if (searchTerm) setIsOpen(true); if (onFocus) onFocus(); }}
                />
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-auto z-50">
                    {isLoading ? (
                        <div className="p-4 text-gray-500 text-sm flex items-center gap-2">Searching...</div>
                    ) : (
                        results.map((item, index) => (
                            <div
                                key={item.id}
                                className={`p-3 mx-2 my-1 rounded-lg cursor-pointer ${focusedIndex === index ? "bg-blue-50" : "hover:bg-gray-50"}`}
                                onClick={() => handleSelect(item)}
                            >
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-500">
                                    {/* ✅ Display logic now matches the actual results returned */}
                                    {item.type === "user" ? item.email : `CVR: ${item.cvr}`}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
