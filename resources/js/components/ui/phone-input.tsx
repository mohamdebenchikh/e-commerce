import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Common country codes for Morocco and international
const COUNTRY_CODES = [
  { code: '+212', country: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: '+90', country: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: '+965', country: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+974', country: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: '+973', country: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: '+962', country: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: '+961', country: 'LB', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+216', country: 'TN', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+213', country: 'DZ', name: 'Algeria', flag: '🇩🇿' },
];

interface PhoneInputProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
  label?: string;
  defaultCountryCode?: string;
}

export default function PhoneInput({
  id,
  value = '',
  onChange,
  placeholder = 'Enter phone number',
  disabled = false,
  required = false,
  className,
  error = false,
  label,
  defaultCountryCode = '+212',
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Parse existing value on mount
  useEffect(() => {
    if (value) {
      const matchedCountry = COUNTRY_CODES.find(country => 
        value.startsWith(country.code)
      );
      
      if (matchedCountry) {
        setCountryCode(matchedCountry.code);
        setPhoneNumber(value.substring(matchedCountry.code.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Update parent component when values change
  useEffect(() => {
    const fullNumber = phoneNumber ? `${countryCode} ${phoneNumber}` : '';
    if (onChange && fullNumber !== value) {
      onChange(fullNumber);
    }
  }, [countryCode, phoneNumber, onChange, value]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove any non-digit characters except spaces and dashes
    const cleanValue = inputValue.replace(/[^\d\s-]/g, '');
    setPhoneNumber(cleanValue);
  };

  const selectedCountry = COUNTRY_CODES.find(country => country.code === countryCode);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className="text-right flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <Select value={countryCode} onValueChange={setCountryCode} disabled={disabled}>
          <SelectTrigger className={cn(
            "w-32 text-right",
            error && "border-destructive"
          )}>
            <SelectValue>
              <div className="flex items-center gap-2">
                <span>{selectedCountry?.flag}</span>
                <span className="text-sm">{countryCode}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_CODES.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.code}</span>
                  <span className="text-xs text-muted-foreground">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <Input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            "flex-1",
            error && "border-destructive"
          )}
        />
      </div>
    </div>
  );
}
