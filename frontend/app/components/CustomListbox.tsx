"use client"
import { Fragment, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface Option {
  value: string
  label: string
}

interface CustomListboxProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  label: string
}

export default function CustomListbox({ options, value, onChange, label }: CustomListboxProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const selected = options.find(option => option.value === value) || options[0]

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button 
          ref={buttonRef}
          className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left text-black focus:outline-none border border-[#FFD700]"
        >
          <span className="block truncate">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-[#FFD700]" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="relative" style={{ zIndex: 9998 }}>
            <Listbox.Options 
              className="absolute top-full mt-1 w-full max-h-[135px] overflow-auto rounded-md bg-black/100 py-1 shadow-lg ring-1 ring-[#FFD700] ring-opacity-20 focus:outline-none z-[9999]"
            >
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-[#FFD700]/20 text-white' : 'text-gray-300'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate ${selected ? 'font-medium text-[#FFD700]' : 'font-normal'}`}>
                      {option.label}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Transition>
      </div>
    </Listbox>
  )
}
