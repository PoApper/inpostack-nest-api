import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AccountService } from "../inpostack/account/account.service";
import { AccountStatus } from "../inpostack/account/account.meta";
import { AccountCreateDto } from "../inpostack/account/account.dto";
import { ApiOperation } from "@nestjs/swagger";
import { MailService } from "../mail/mail.service";

/**
 * This is for handle 'verifyToken', 'login', 'logout' tasks
 */

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountService: AccountService,
    private readonly mailService: MailService
  ) {
  }

  @Get("verifyToken")
  @UseGuards(AuthGuard("jwt"))
  verifyToken(@Req() req: Request) {
    const user: any = req.user;
    return user;
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  async login(@Req() req: Request, @Res() res: Response) {
    const user: any = req.user;
    const token = this.authService.generateJwtToken(user);
    res.setHeader(
      "Set-Cookie", `Authentication=${token}; HttpOnly; Path=/;`
    );
    this.accountService.updateLoginById(user.id);
    return res.send(user);
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt"))
  logout(@Res() res: Response) {
    res.setHeader("Set-Cookie",
      `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    return res.sendStatus(200);
  }

  @Post("register")
  @ApiOperation({ summary: "회원가입", description: "계정 생성 & 인증 메일 발송" })
  async register(@Body() dto: AccountCreateDto, @Query("sendMail") sendMail: boolean) {
    const newAccount = await this.accountService.save(dto);
    console.log(newAccount.uuid);
    console.log(newAccount.email);
    if (sendMail) {
      this.mailService.sendVerificationMail(newAccount.email, newAccount.uuid);
    }
    return newAccount;
  }

  @Get("activateAccount/:uuid")
  async activateAccount(@Param("uuid") uuid: string, @Res() res: Response) {
    await this.accountService.findOneOrFail({ uuid: uuid });
    await this.accountService.update({ uuid: uuid }, { account_status: AccountStatus.activated });
    res.redirect(process.env.public_web);
  }
}
