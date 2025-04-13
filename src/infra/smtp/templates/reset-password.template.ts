export class ResetPasswordTemplate {
  public static new(data: { firstName: string; resetUrl: string; companyName: string; supportEmail: string }): string {
    const head: string = `
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Redefinir Senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                .btn {
                    display: inline-block;
                    background-color: #007bff;
                    color: #ffffff;
                    padding: 12px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    text-decoration: none;
                    text-align: center;
                }
                .footer {
                    font-size: 14px;
                    text-align: center;
                    color: #777;
                }
            </style>
        </head>
    `;

    const body = `
        <body>
            <div class="container">
                <div class="header">
                    <h2>Solicitação de Redefinição de Senha</h2>
                </div>
                <div class="content">
                    <p>Olá, <strong>${data.firstName}</strong>,</p>
                    <p>Recebemos uma solicitação para redefinir a sua senha na nossa plataforma. Para continuar, clique no link abaixo:</p>
                    <p><a href="${data.resetUrl}" class="btn">Redefinir Senha</a></p>
                    <p>Se você não fez essa solicitação, por favor ignore este e-mail. Sua senha permanece inalterada.</p>
                </div>
                <div class="footer">
                    <p>Atenciosamente,</p>
                    <p><strong>${data.companyName}</strong></p>
                    <p>Se precisar de ajuda, entre em contato com nosso suporte: ${data.supportEmail}</p>
                </div>
            </div>
        </body>
    `;

    return `
      <!DOCTYPE html>
        <html lang="pt-br">
            ${head}
            ${body}
        </html>
    `;
  }
}
