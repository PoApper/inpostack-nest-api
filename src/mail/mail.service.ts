import {Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
  }

  async sendVerificationMail(email: string, uuid: string) {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.GMAIL_USER,
      subject: '[InPoStack] 가입 인증',
      html: `
      <html>
        <head>
            <meta charset="utf-8">
            <style>
            </style>
        </head>
        <body>
          <h2>InPoStack 가입 인증</h2>
          <p>InPoStack과 함께 하는 더 행복한 배달 생활!</p>
          <p>- <b>Team InPoStack</b> 드림 -</p>
          <br/>
          <div style="padding: 2px; background-color: crimson; color: white; text-align: center;">
            <a href="http://localhost:4000/auth/activateAccount/${uuid}" style="text-decoration: inherit;">계정 활성하기</a>
          </div>
          <p>😱본인이 시도한 회원가입이 아니라면, 즉시 InPoStack 관리팀에게 연락바랍니다.😱</p>
        </body>
      </html>`,
    });
    console.log(`success to mailing: ${email}`);
  }
}