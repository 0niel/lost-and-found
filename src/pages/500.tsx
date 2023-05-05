import Error from '@/components/Error'

export default function InternalServerError() {
  return (
    <Error
      code={500}
      name='Ошибка сервера'
      description='Попытайтесь обратиться к приложению позже.'
      hideRecommendationLinks
    />
  )
}
