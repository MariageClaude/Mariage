// Email service for sending invitations
// This example uses a generic email service - you can adapt it to your preferred provider

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text: string
}

export interface GuestInvitation {
  guestName: string
  guestEmail: string
  password: string
  loginUrl: string
}

export function generateInvitationEmail(invitation: GuestInvitation): EmailTemplate {
  const { guestName, password, loginUrl } = invitation

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invitation de Mariage - Julie & George</title>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { color: #5d6c46; font-size: 28px; margin-bottom: 10px; }
        .subtitle { color: #6d6d6d; font-size: 18px; }
        .content { background: #f8f6ed; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .credentials { background: #e9ede1; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .button { display: inline-block; background: #5d6c46; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6d6d6d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Vous êtes invité(e) !</h1>
          <p class="subtitle">Rejoignez-nous pour notre jour spécial</p>
        </div>
        
        <div class="content">
          <p>Cher(e) ${guestName},</p>
          
          <p>Nous sommes ravis de vous inviter à célébrer notre mariage ! Votre présence rendrait ce jour encore plus spécial pour nous.</p>
          
          <p>Veuillez utiliser les identifiants ci-dessous pour accéder à votre invitation personnalisée et confirmer votre présence aux cérémonies :</p>
          
          <div class="credentials">
            <p><strong>Site web :</strong> ${loginUrl}</p>
            <p><strong>Mot de passe :</strong> <code>${password}</code></p>
          </div>
          
          <p>Nous organisons deux cérémonies :</p>
          <ul>
            <li><strong>Cérémonie Traditionnelle (DOT)</strong> - Samedi 15 juin 2024, 14h00</li>
            <li><strong>Cérémonie Civile</strong> - Dimanche 16 juin 2024, 11h00</li>
          </ul>
          
          <p>Veuillez confirmer votre présence pour chaque cérémonie via le lien ci-dessous :</p>
          
          <a href="${loginUrl}" class="button">Confirmer ma présence</a>
          
          <p>Si vous avez des questions ou des besoins spéciaux, n'hésitez pas à nous contacter.</p>
          
          <p>Nous avons hâte de célébrer avec vous !</p>
          
          <p>Avec amour,<br><strong>Julie & George</strong></p>
        </div>
        
        <div class="footer">
          <p>Cette invitation est personnelle et confidentielle.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
    Vous êtes invité(e) au mariage de Julie & George !
    
    Cher(e) ${guestName},
    
    Nous sommes ravis de vous inviter à célébrer notre mariage !
    
    Détails de connexion :
    Site web : ${loginUrl}
    Mot de passe : ${password}
    
    Cérémonies :
    - Cérémonie Traditionnelle (DOT) - Samedi 15 juin 2024, 14h00
    - Cérémonie Civile - Dimanche 16 juin 2024, 11h00
    
    Veuillez confirmer votre présence via le site web.
    
    Avec amour,
    Julie & George
  `

  return {
    to: invitation.guestEmail,
    subject: "Invitation de Mariage - Julie & George 💕",
    html,
    text,
  }
}

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    // This is a placeholder - replace with your actual email service
    // Examples: SendGrid, Mailgun, AWS SES, Resend, etc.

    console.log("Sending email to:", template.to)
    console.log("Subject:", template.subject)

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would use your email service here:
    /*
    const response = await fetch('https://api.your-email-service.com/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text
      })
    })
    
    return response.ok
    */

    return true
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}
