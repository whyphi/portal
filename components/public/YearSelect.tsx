import React from 'react';
import { Select, SelectProps } from 'flowbite-react';

interface YearSelectProps extends SelectProps {
  startYear: number;
  endYear: number;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

export default function YearSelect({ 
  startYear,
  endYear,
  value,
  onChange,
  ...props
}: YearSelectProps)  {
  
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  
  return (
    <Select 
      value={value}
      onChange={onChange}
      {...props}
    >
      <option value="" disabled>Select Year</option>
      {years.map(year => (
        <option key={year} value={year.toString()}>
          {year}
        </option>
      ))}
    </Select>
  );
};
