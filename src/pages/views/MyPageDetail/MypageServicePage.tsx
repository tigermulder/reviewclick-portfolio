import ReuseHeader from "@/components/ReuseHeader"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"

const MypageServicePage = () => {
  const navigate = useNavigate()
  return (
    <>
      <ReuseHeader
        title="서비스 이용가이드"
        onBack={() => navigate(RoutePath.UserProfile)}
      />
    </>
  )
}

export default MypageServicePage
