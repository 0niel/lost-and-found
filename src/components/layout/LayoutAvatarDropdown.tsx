import { type LayoutAvatarProps } from '@/components/layout/LayoutAvatar'
import { Menu, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import Avatar from '@/components/avatar/Avatar'
import Link from 'next/link'
import classNames from 'classnames/dedupe'

export default function LayoutAvatarDropdown(props: LayoutAvatarProps) {
  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <Menu.Button className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
          <span className='sr-only'>Открыть пользовательское меню</span>
          <Avatar
            size='sm'
            placeholderInitials={props.session.user.nickname.slice(0, 2).toUpperCase()}
            src={props.session.user.image}
            rounded
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='px-4 py-3'>
            <Link href={`/u/${props.session.user.nickname}`}>
              <p className='text-sm'>Вы вошли как</p>
              <p className='w-40 truncate text-ellipsis text-sm font-semibold text-gray-900'>
                {props.session.user.nickname}
              </p>
            </Link>
          </div>
          {props.userNavigation.map((navigationChunk, index) => (
            <div className='py-1' key={index}>
              {navigationChunk.map((navigation) => (
                <Menu.Item key={navigation.name}>
                  {({ active }) => (
                    <a
                      onClick={navigation.func}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      )}
                    >
                      {navigation.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}