// api/send-quote.js — Vercel Serverless Function
// Deploy this file to Vercel. Set RESEND_API_KEY in Vercel environment variables.

const COMPANY_EMAIL = 'comercio@jmsolutionschile.com';
// TEMPORARY: using onboarding@resend.dev until jmsolutionschile.com verifies in Resend
// Once verified, change to: 'JM Solutions <noreply@jmsolutionschile.com>'
const FROM_ADDRESS = 'JM Solutions <noreply@jmsolutionschile.com>';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Handle CORS preflight
  if (req.method === 'OPTIONS') {
        Object.entries(CORS_HEADERS).forEach(([k,v]) => res.setHeader(k,v));
        return res.status(204).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k,v]) => res.setHeader(k,v));

  if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
        ref_number,
        customer_name,
        customer_email,
        customer_phone,
        company,
        job_title,
        site_location,
        urgency,
        items_summary,
        file_attached,
        notes,
  } = req.body;

  // Basic validation
  if (!customer_email || !ref_number) {
        return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
        // Email 1: Customer confirmation
      const customerEmail = {
              from: FROM_ADDRESS,
              to: customer_email,
              reply_to: COMPANY_EMAIL,
              subject: `Quote Request Received — ${ref_number}`,
              html: `
                      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a2a3a">
                                <div style="background:#0d1f35;padding:24px 32px">
                                            <h2 style="color:#fff;margin:0;font-size:18px;font-weight:800;letter-spacing:-0.5px">JM Solutions</h2>
                                                        <p style="color:#5a7fa8;margin:4px 0 0;font-size:12px;letter-spacing:2px;text-transform:uppercase">Authorized Bergstrom Distributor</p>
                                                                  </div>
                                                                            <div style="padding:32px">
                                                                                        <p style="margin-top:0">Hi ${customer_name},</p>
                                                                                                    <p>Thank you for contacting JM Solutions. We've received your quote request and a specialist will review it and be in touch within <strong>1–2 business days</strong>.</p>
                                                                                                                <div style="background:#f0f4f8;border-left:4px solid #1d5fad;padding:16px 20px;margin:24px 0">
                                                                                                                              <p style="margin:0 0 4px;font-size:11px;color:#5a7fa8;letter-spacing:2px;text-transform:uppercase;font-weight:700">Your Quote Reference</p>
                                                                                                                                            <p style="margin:0;font-size:22px;font-weight:900;color:#0d1f35;font-family:monospace;letter-spacing:2px">${ref_number}</p>
                                                                                                                                                          <p style="margin:4px 0 0;font-size:12px;color:#5a7fa8">Keep this number for your records</p>
                                                                                                                                                                      </div>
                                                                                                                                                                                  <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1d5fad;border-bottom:1px solid #e0e8f0;padding-bottom:8px">Items Requested</h3>
                                                                                                                                                                                              <pre style="font-family:Arial,sans-serif;font-size:14px;color:#1a2a3a;white-space:pre-line;margin:0">${items_summary}</pre>
                                                                                                                                                                                                          ${file_attached && file_attached !== 'None' ? `<p style="margin-top:16px;font-size:13px;color:#5a7fa8">You also attached a file: <strong>${file_attached}</strong></p>` : ''}
                                                                                                                                                                                                                      <hr style="border:none;border-top:1px solid #e0e8f0;margin:28px 0"/>
                                                                                                                                                                                                                                  <p style="font-size:13px;color:#5a7fa8">Need a faster response? Call us at <strong style="color:#0d1f35">+56 9 7164 8224</strong> and quote your reference number.</p>
                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                      <div style="background:#f0f4f8;padding:16px 32px;font-size:11px;color:#8fa8c8">
                                                                                                                                                                                                                                                                  JM Solutions — Sociedad Comercial JIP Morales Ltda · RUT 76.423.793-5<br>
                                                                                                                                                                                                                                                                              Av. Las Parcelas 4049, Iquique, Región de Tarapacá, Chile<br>
                                                                                                                                                                                                                                                                                          comercio@jmsolutionschile.com · +56 9 7164 8224
                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                                                                                                                  `,
      };

      // Email 2: Company notification
      const companyEmail = {
              from: FROM_ADDRESS,
              to: COMPANY_EMAIL,
              reply_to: customer_email,
              subject: `New Quote Request — ${ref_number} · ${company || customer_name}`,
              html: `
                      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a2a3a">
                                <div style="background:#0d1f35;padding:24px 32px">
                                            <h2 style="color:#fff;margin:0;font-size:16px;font-weight:800">New Quote Request</h2>
                                                        <p style="color:#7eb8f7;margin:4px 0 0;font-size:20px;font-family:monospace;letter-spacing:2px;font-weight:900">${ref_number}</p>
                                                                  </div>
                                                                            <div style="padding:24px 32px">
                                                                                        <table style="width:100%;border-collapse:collapse;font-size:14px">
                                                                                                      <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8;width:140px">Customer</td><td style="padding:10px 0;font-weight:700">${customer_name}</td></tr>
                                                                                                                    <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Email</td><td style="padding:10px 0"><a href="mailto:${customer_email}" style="color:#1d5fad">${customer_email}</a></td></tr>
                                                                                                                                  <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Phone</td><td style="padding:10px 0">${customer_phone || '—'}</td></tr>
                                                                                                                                                <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Company</td><td style="padding:10px 0">${company || '—'}</td></tr>
                                                                                                                                                              <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Job Title</td><td style="padding:10px 0">${job_title || '—'}</td></tr>
                                                                                                                                                                            <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Site / Location</td><td style="padding:10px 0">${site_location || '—'}</td></tr>
                                                                                                                                                                                          <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">Urgency</td><td style="padding:10px 0">${urgency || '—'}</td></tr>
                                                                                                                                                                                                        <tr style="border-bottom:1px solid #e0e8f0"><td style="padding:10px 0;color:#5a7fa8">File Attached</td><td style="padding:10px 0">${file_attached || 'None'}</td></tr>
                                                                                                                                                                                                                    </table>
                                                                                                                                                                                                                                <h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1d5fad;border-bottom:1px solid #e0e8f0;padding-bottom:8px;margin-top:28px">Items Requested</h3>
                                                                                                                                                                                                                                            <pre style="font-family:Arial,sans-serif;font-size:14px;color:#1a2a3a;white-space:pre-line;background:#f0f4f8;padding:16px;margin:0">${items_summary}</pre>
                                                                                                                                                                                                                                                        ${notes ? `<h3 style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#1d5fad;border-bottom:1px solid #e0e8f0;padding-bottom:8px;margin-top:28px">Notes</h3><p style="margin:0;font-size:14px">${notes}</p>` : ''}
                                                                                                                                                                                                                                                                    <div style="margin-top:28px">
                                                                                                                                                                                                                                                                                  <a href="mailto:${customer_email}?subject=Re: Quote ${ref_number}" style="background:#1d5fad;color:#fff;padding:10px 20px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block">Reply to Customer →</a>
                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                      `,
      };

      // Send both via Resend
      const apiKey = process.env.RESEND_API_KEY;

      const [r1, r2] = await Promise.all([
              fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(customerEmail),
              }),
              fetch('https://api.resend.com/emails', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(companyEmail),
              }),
            ]);

      if (!r1.ok || !r2.ok) {
              const e1 = await r1.text();
              const e2 = await r2.text();
              console.error('Resend errors:', e1, e2);
              return res.status(500).json({ error: 'Email send failed', detail: e1 });
      }

      return res.status(200).json({ success: true, ref: ref_number });

  } catch (err) {
        console.error('Handler error:', err);
        return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
