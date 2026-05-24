import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface Option {
  id: string | number;
  name: string;
}

interface Props {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  className = '',
  error = false,
}: Props) {
  const [query, setQuery] = useState('');

  const selectedOption = options.find((opt) => opt.id === value) || null;

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          (option.name || '').toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className={`relative ${className}`}>
      <Combobox value={selectedOption} onChange={(val: Option | null) => val && onChange(val.id)}>
        <div className="relative">
          <Combobox.Input
            className={`w-full px-4 py-2.5 pr-10 bg-background hover:bg-muted/50 border rounded-xl text-sm text-foreground outline-none transition-all ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-border/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50'
            }`}
            displayValue={(option: Option) => option?.name || ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
            <ChevronsUpDown className="w-4 h-4" />
          </Combobox.Button>
        </div>
        <Combobox.Options className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-xl bg-background border border-border/50 shadow-lg py-1 text-sm outline-none">
          {filteredOptions.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
              Tidak ditemukan.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2.5 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-foreground'
                  }`
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-bold' : 'font-normal'}`}>
                      {option.name}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  );
}
