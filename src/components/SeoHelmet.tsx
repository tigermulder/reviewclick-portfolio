import { Helmet } from "react-helmet-async"
import { SeoHelmetProps } from "@/types/component-types/seo-helmet-type"

function SeoHelmet({ title, description }: SeoHelmetProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:locale" content="ko_KR" />
    </Helmet>
  )
}
export default SeoHelmet
