import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // 1. Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse and validate request body
  const body = await request.json()
  const {
    name,
    type,
    description,
    amountPerPerson,
    paymentType,
    expectedMembers,
    deadline,
  } = body

  if (!name || !type || !amountPerPerson || !paymentType || !deadline || !expectedMembers) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (amountPerPerson < 100) {
    return NextResponse.json(
      { error: 'Amount per person must be at least ₦100' },
      { status: 400 }
    )
  }

  const campaignId = crypto.randomUUID()

  // 3. Call Nomba API to create virtual sub-account
  let virtualAccountNumber = ''
  let virtualAccountBank = ''

  try {
    const nombaRes = await fetch(
      `${process.env.NOMBA_BASE_URL}/v1/accounts/virtual`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NOMBA_API_KEY}`,
          'x-nomba-secret': process.env.NOMBA_SECRET_KEY!,
        },
        body: JSON.stringify({
          accountName: `${name} - PaySmall`,
          accountReference: campaignId,
          bvn: '',           // provide if required
          callbackUrl: process.env.NOMBA_WEBHOOK_URL ?? '',
        }),
      }
    )

    if (!nombaRes.ok) {
      const errBody = await nombaRes.text()
      console.error('Nomba error response:', nombaRes.status, errBody)
      throw new Error(`Nomba returned ${nombaRes.status}`)
    }

    const nombaData = await nombaRes.json()
    // Adjust field paths to match live Nomba API response shape
    virtualAccountNumber =
      nombaData?.data?.accountNumber ??
      nombaData?.accountNumber ??
      ''
    virtualAccountBank =
      nombaData?.data?.bankName ??
      nombaData?.bankName ??
      'Nomba (Zenith)'
  } catch (err) {
    console.error('Nomba API error:', err)
    return NextResponse.json(
      {
        error:
          'Could not generate a virtual account. Please check your Nomba API credentials and try again.',
      },
      { status: 502 }
    )
  }

  // 4. Calculate target amount
  const targetAmount = Number(amountPerPerson) * Number(expectedMembers)

  // 5. Save campaign to Supabase
  const { data: campaign, error: dbError } = await supabase
    .from('campaigns')
    .insert({
      id: campaignId,
      organiser_id: user.id,
      name,
      type,
      description: description || null,
      amount_per_person: Number(amountPerPerson),
      payment_type: paymentType,
      deadline,
      virtual_account_number: virtualAccountNumber,
      virtual_account_bank: virtualAccountBank,
      virtual_account_name: `${name} - PaySmall`,
      status: 'active',
      total_members: 0,
      paid_count: 0,
      total_collected: 0,
      target_amount: targetAmount,
    })
    .select()
    .single()

  if (dbError) {
    console.error('Supabase insert error:', dbError)
    return NextResponse.json({ error: 'Failed to save campaign' }, { status: 500 })
  }

  return NextResponse.json({ campaign })
}
