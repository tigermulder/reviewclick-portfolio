import { Campaign } from "@/types/api-types/campaign-type"
export interface CampaignDetailsProps {
  campaign: Campaign
  handleViewProduct: () => void
  shouldAnimateButton?: boolean
}
