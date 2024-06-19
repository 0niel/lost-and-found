import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import React from 'react'

type DefaultSeoProps = Partial<Pick<React.ComponentProps<typeof NextSeo>, 'title' | 'description'>>

export default function DefaultSeo(props: DefaultSeoProps) {
  return (
    <NextSeo
      title={props.title ?? env.NEXT_PUBLIC_SITE_NAME}
      description={props.description ?? env.NEXT_PUBLIC_SITE_DESCRIPTION}
      canonical={env.NEXT_PUBLIC_SITE_URL}
      openGraph={{
        url: env.NEXT_PUBLIC_SITE_URL,
        title: env.NEXT_PUBLIC_SITE_NAME,
        description: env.NEXT_PUBLIC_SITE_DESCRIPTION,
        images: [
          {
            url: '/logo-icons/apple-touch-icon-precomposed.png',
            width: 300,
            height: 300,
            alt: `Логотип Mirea Ninja`,
          },
        ],
      }}
    />
  )
}
