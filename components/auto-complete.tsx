"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AutoCompleteProps {
    data: string[];
    placeholder?: string;
    className?: string;
    onValueChange?: (value: string) => void;
    maxSuggestions?: number;
    debounceMs?: number;
}

// Type untuk preprocessed data
interface PreprocessedItem {
    original: string;
    lowercase: string;
}

function AutoComplete({
    data,
    placeholder = "Ketik nama...",
    className,
    onValueChange,
    maxSuggestions = 50,
    debounceMs = 100
}: AutoCompleteProps) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showPopover, setShowPopover] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isPending, startTransition] = useTransition();

    const inputRef = useRef<HTMLInputElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const requestIdRef = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Preprocessing: lowercase semua data di awal [web:11]
    const preprocessedData = useMemo<PreprocessedItem[]>(() => {
        return data.map(item => ({
            original: item,
            lowercase: item.toLowerCase()
        }));
    }, [data]);

    // Worker code yang menggunakan preprocessed data
    const workerCode = useMemo(() => `
        self.onmessage = function(e) {
            const { preprocessedData, query, maxResults, requestId } = e.data;
            
            if (!query || query.length === 0) {
                self.postMessage({ results: [], query, requestId });
                return;
            }
            
            const lowerQuery = query.toLowerCase();
            const results = [];
            
            // Filter menggunakan preprocessed lowercase data
            // Tidak perlu toLowerCase() lagi di sini!
            for (let i = 0; i < preprocessedData.length && results.length < maxResults; i++) {
                if (preprocessedData[i].lowercase.includes(lowerQuery)) {
                    results.push(preprocessedData[i].original);
                }
            }
            
            self.postMessage({ results, query, requestId });
        };
    `, []);

    // Initialize Web Worker
    useEffect(() => {
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);

        try {
            workerRef.current = new Worker(workerUrl);

            workerRef.current.onmessage = (e) => {
                const { results, requestId } = e.data;

                if (requestId === requestIdRef.current) {
                    startTransition(() => {
                        setSuggestions(results);
                        setShowPopover(results.length > 0);
                    });
                }
            };

            workerRef.current.onerror = (error) => {
                console.error('Worker error:', error);
            };
        } catch (error) {
            console.error('Failed to create worker:', error);
        }

        return () => {
            if (workerRef.current) {
                workerRef.current.terminate();
                URL.revokeObjectURL(workerUrl);
            }
        };
    }, [workerCode]);

    const filterSuggestions = useCallback((value: string, requestId: number) => {
        if (!workerRef.current) {
            // Fallback: gunakan preprocessed data juga
            if (value.length === 0) {
                setSuggestions([]);
                setShowPopover(false);
                return;
            }

            const lowerValue = value.toLowerCase();
            const filtered = preprocessedData
                .filter(item => item.lowercase.includes(lowerValue))
                .slice(0, maxSuggestions)
                .map(item => item.original);

            startTransition(() => {
                setSuggestions(filtered);
                setShowPopover(filtered.length > 0);
            });
            return;
        }

        if (value.length === 0) {
            setSuggestions([]);
            setShowPopover(false);
            return;
        }

        // Kirim preprocessed data ke worker
        workerRef.current.postMessage({
            preprocessedData: preprocessedData,
            query: value,
            maxResults: maxSuggestions,
            requestId
        });
    }, [preprocessedData, maxSuggestions]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setInputValue(value);
        setSelectedIndex(-1);

        if (onValueChange) {
            onValueChange(value);
        }

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        requestIdRef.current += 1;
        const currentRequestId = requestIdRef.current;

        debounceTimerRef.current = setTimeout(() => {
            filterSuggestions(value, currentRequestId);
        }, debounceMs);
    }, [onValueChange, filterSuggestions, debounceMs]);



    // Tambahkan useEffect ini setelah useEffect worker initialization
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowPopover(false);
                setSuggestions([]);
                setSelectedIndex(-1);
            }
        }

        // Hanya attach listener jika popover sedang terbuka
        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopover]);
    const handleSelectSuggestion = useCallback((suggestion: string) => {
        setInputValue(suggestion);
        setShowPopover(false);
        setSuggestions([]);
        setSelectedIndex(-1);
        inputRef.current?.focus();

        if (onValueChange) {
            onValueChange(suggestion);
        }
    }, [onValueChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showPopover) return;

        switch (e.key) {
            case 'Tab':
                if (suggestions.length > 0) {
                    const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;
                    handleSelectSuggestion(suggestions[indexToSelect]);
                } else {
                    setShowPopover(false);
                    setSuggestions([]);
                    setSelectedIndex(-1);
                }
                break;

            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSelectSuggestion(suggestions[selectedIndex]);
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;

            case 'Escape':
                setShowPopover(false);
                setSuggestions([]);
                setSelectedIndex(-1);
                break;
        }
    }, [showPopover, selectedIndex, suggestions, handleSelectSuggestion]);


    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={cn("mb-3 capitalize md:text-sm text-xs", className)}
                autoComplete="off"
            />

            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="animate-spin rounded-full h-4 w-4 mb-2 border-2 border-primary border-t-transparent" />
                </div>
            )}

            {showPopover && (
                <Card className="absolute top-full left-0 right-0 mt-1 p-1 z-50 max-h-60 overflow-auto shadow-lg">
                    <div className="p-1">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={`${suggestion}-${index}`}
                                onClick={() => handleSelectSuggestion(suggestion)}
                                onMouseEnter={() => setSelectedIndex(index)}
                                className={cn(
                                    "px-3 py-2 rounded-sm cursor-pointer transition-colors capitalize",
                                    selectedIndex === index
                                        ? 'bg-accent text-accent-foreground'
                                        : 'hover:bg-accent/50'
                                )}
                            >
                                {suggestion}
                            </div>
                        ))}
                        {suggestions.length === maxSuggestions && (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center border-t mt-1 pt-2">
                                Menampilkan {maxSuggestions} hasil pertama
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default AutoComplete;
