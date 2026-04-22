// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { supabase, mapToFrontend } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(' [DEBUG] Incoming Data:', JSON.stringify(body));

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    const rawPhone = body.phone || '';
    const cleanPhone = rawPhone.replace(/\s+/g, '');
    const phoneRegex = /^\+?[0-9]{7,20}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json({ success: false, error: 'Invalid phone format.' }, { status: 400 });
    }

    const uniqueId = Date.now(); 

    const inquiryData = {
      id: uniqueId,
      name: body.name || 'Anonymous',
      email: body.email || 'no-email',
      phone: cleanPhone,
      company: body.company || '',
      message: body.message || '',
      product_name: body.productName || body.product_name || 'General',
      product_id: body.productId || body.product_id || null,
      producttype: body.productType || body.producttype || 'General',
      attachment: body.attachment || null,
      ip_address: ip,
      status: 'New',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select();

    if (error) {
      console.error(' [DB ERROR] Details:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // --- EMAIL FORWARDING LOGIC ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Hangfan Website" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL, // Receive inquiries here
        subject: `New Inquiry from ${body.name} - ${body.productName || 'General'}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">New Inquiry Received</h2>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Phone/WhatsApp:</strong> ${cleanPhone}</p>
            <p><strong>Company:</strong> ${body.company || 'N/A'}</p>
            <p><strong>Product:</strong> ${body.productName || 'General'}</p>
            <p><strong>Message:</strong><br/>${body.message}</p>
            ${body.attachment ? `<p><strong>Attachment:</strong> <a href="${body.attachment}" style="color: #2563eb;">View File</a></p>` : ''}
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #999;">Sent from High Fasteners Website System</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(' [EMAIL SUCCESS] Inquiry forwarded to:', process.env.ADMIN_EMAIL);
    } catch (emailErr) {
      console.error(' [EMAIL ERROR] Failed to forward inquiry:', emailErr);
      // We don't return error to user if email fails but DB succeeds
    }

    return NextResponse.json({ success: true, data: data });

  } catch (err: any) {
    console.error(' [CRITICAL ERROR]:', err.message);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapToFrontend(data));
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase
       .from('inquiries')
       .delete()
       .eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
