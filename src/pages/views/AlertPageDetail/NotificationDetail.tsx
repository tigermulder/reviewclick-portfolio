import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"
const NotificationDetail = () => {
  const navigate = useNavigate()
  return (
    <>
      <ReuseHeader title="새소식" onBack={() => navigate(RoutePath.Alert)} />
    </>
  )
}

export default NotificationDetail
