import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageWithLayout } from '@/pages/_app'
import DynamicCreatePost from '@/components/posts/create/DynamicCreatePost'
import { PostItemReason } from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const CreateFind: NextPageWithLayout = () => {
  return (
    <DynamicCreatePost
      name='Находка'
      description='Опишите найденную вещь, чтобы хозяин смог легко ее узнать'
      postItemReason={PostItemReason.FOUND}
      routePushOnExit='/finds'
    />
  )
}

CreateFind.getLayout = function getLayout(page: JSX.Element) {
  return <DynamicLayout pageName='Сообщить о находке'>{page}</DynamicLayout>
}

export default CreateFind
