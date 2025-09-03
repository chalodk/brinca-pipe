export async function sendDealWebhook(profitCenterName: string, dealId: number, dealTitle: string, ownerName: string, companyName: string) {
  try {
    const webhookUrl = "https://n8n-fastmvp-u38739.vm.elestio.app/webhook/send_email"
    const payload = {
      profit_center: profitCenterName,
      deal_url: `brinca.pipedrive.com/deal/${dealId}`,
      deal_title: dealTitle,
      owner_name: ownerName,
      company_name: companyName
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`)
    }

    console.log("Webhook sent successfully for deal:", dealId)
    return { success: true }
  } catch (error) {
    console.error("Error sending webhook:", error)
    return { success: false, error }
  }
}