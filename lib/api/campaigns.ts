export async function createCampaign(data: {
  name: string
  type: string
  description?: string
  amountPerPerson: number
  paymentType: string
  expectedMembers: number
  deadline: string
}) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Failed to create campaign')
  }

  return response.json() as Promise<{ campaign: CampaignRow }>
}

// ── Types shared between client and server ────────────────────────────────────
export interface CampaignRow {
  id: string
  organiser_id: string
  name: string
  type: string
  description: string | null
  amount_per_person: number
  payment_type: string
  deadline: string
  virtual_account_number: string
  virtual_account_bank: string
  virtual_account_name: string
  status: 'active' | 'completed' | 'expired'
  total_members: number
  paid_count: number
  total_collected: number
  target_amount: number
  created_at: string
}
