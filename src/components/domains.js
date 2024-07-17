import { Fragment } from 'react';
import { Disclosure, Transition, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/solid';

export default function DomainsTable({ domains }) {
  return (
    <div className="w-full max-w-md p-4 mx-auto bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-yellow-500 mb-4">Available Domains</h2>
      <div className="w-full px-4 pt-2">
        <div className="bg-gray-700 p-4 rounded-md mb-2">
          <p className="text-lg font-medium text-gray-300">Main Domain</p>
          <p className="text-gray-400">{domains.main}</p>
        </div>
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-yellow-500 bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-yellow-500 focus-visible:ring-opacity-75">
                <span>Mirror Domains</span>
                <ChevronUpIcon
                  className={`${
                    open ? 'transform rotate-180' : ''
                  } w-5 h-5 text-yellow-500`}
                />
              </DisclosureButton>
              <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <DisclosurePanel className="pt-4 pb-2 text-sm text-gray-400">
                  <ul>
                    {domains.mirrors.map((domain, index) => (
                      <li key={index} className="py-1">{domain}</li>
                    ))}
                  </ul>
                </DisclosurePanel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
