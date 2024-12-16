import { useSuspenseQuery } from "@tanstack/react-query"
import { getFaqList } from "@/services/faq"
import FaqItem from "./FaqItem"
import styled from "styled-components"

const FaqContent = () => {
  //** 리액트쿼리 나의 FAQ리스트 */
  const fetchFaqList = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getFaqList(requestData)
    return response
  }
  const { data } = useSuspenseQuery({
    queryKey: ["faqList"],
    queryFn: fetchFaqList,
    refetchOnMount: false,
    staleTime: 0,
  })
  const faqList = data?.list

  return (
    <section>
      <ListContainer>
        {faqList?.map((faqItem) => {
          return <FaqItem key={faqItem.faqId} faqItem={faqItem} />
        })}
      </ListContainer>
    </section>
  )
}

export default FaqContent

const ListContainer = styled.ul`
  li {
    padding: 2.2rem 0;
    display: flex;
    border-bottom: 0.1rem solid var(--WSmoke);
  }
`
