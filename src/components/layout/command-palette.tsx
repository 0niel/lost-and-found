import { Fragment, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { FaceFrownIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames/dedupe'
import { api } from '@/lib/api'
import errorToast from '@/components/toasts/error-toast'
import { useRouter } from 'next/router'
import { PostItemReason } from '@prisma/client'

interface CommandPaletteProps {
  open: boolean
  setOpen: (state: boolean) => void
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const querySearch = api.posts.searchPosts.useQuery(
    { query },
    {
      onError: (error) => {
        errorToast(error.message)
      },
      enabled: query !== '',
    },
  )

  const fetchPost = (postId: string, reason: PostItemReason) => {
    return () => {
      setOpen(false)
      void router.push(reason === PostItemReason.FOUND ? `/finds/${postId}` : `/losses/${postId}`)
    }
  }

  const closePalette = () => setOpen(false)

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'>
              <Combobox>
                <div className='relative'>
                  <MagnifyingGlassIcon
                    className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <Combobox.Input
                    className='h-12 w-full border-0 bg-transparent pl-11 pr-12 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm'
                    placeholder='Поиск...'
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <kbd
                    onClick={closePalette}
                    className='absolute right-4 top-3.5 rounded-md border border-gray-200 p-1 text-[0.5rem] text-gray-800 hover:border-gray-300 hover:shadow-sm'
                  >
                    ESC
                  </kbd>
                </div>
                {query === '' && (
                  <div className='border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14'>
                    <GlobeAmericasIcon
                      className='mx-auto h-6 w-6 text-gray-400'
                      aria-hidden='true'
                    />
                    <p className='mt-4 font-semibold text-gray-900'>
                      Поиск объявлений о находках и пропажах
                    </p>
                    <p className='mt-2 text-gray-500'>Быстрый доступ к активным объявлениям.</p>
                  </div>
                )}

                {querySearch.data && querySearch.data.length > 0 && (
                  <Combobox.Options
                    static
                    className='max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2'
                  >
                    {querySearch.data.map((category) => (
                      <li key={category.name}>
                        <h2 className='bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900'>
                          {category.name}
                        </h2>
                        <ul className='mt-2 text-sm text-gray-800'>
                          {category.posts.map((item) => (
                            <Combobox.Option
                              key={item.id}
                              value={item}
                              onClick={fetchPost(item.id, category.reason)}
                              className={({ active }) =>
                                classNames(
                                  'cursor-default select-none px-4 py-2',
                                  active && 'bg-indigo-600 text-white',
                                )
                              }
                            >
                              {item.name}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </Combobox.Options>
                )}

                {query !== '' && querySearch.data && querySearch.data.length === 0 && (
                  <div className='border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14'>
                    <FaceFrownIcon className='mx-auto h-6 w-6 text-gray-400' aria-hidden='true' />
                    <p className='mt-4 font-semibold text-gray-900'>Результатов не найдено</p>
                    <p className='mt-2 text-gray-500'>
                      Мы не смогли найти ничего по этому запросу.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
