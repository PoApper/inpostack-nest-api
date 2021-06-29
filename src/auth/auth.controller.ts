import { Body, Controller, Get, Inject, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { AccountService } from "../inpostack/account/account.service";
import { AccountStatus } from "../inpostack/account/account.meta";
import { AccountCreateDto } from "../inpostack/account/account.dto";
import { ApiOperation } from "@nestjs/swagger";
import { MailService } from "../mail/mail.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

/**
 * This is for handle "verifyToken", "login", "logout" tasks
 */

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountService: AccountService,
    private readonly mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger
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
    try {
      const user: any = req.user;
      const token = this.authService.generateJwtToken(user);
      res.setHeader(
        "Set-Cookie", `Authentication=${token}; HttpOnly; Path=/;`
      );
      this.accountService.updateLoginById(user.id);
      this.logger.info(`Login Succeed!: uuid=${user.uuid}`)
      return res.send(user);
    } catch(err) {
      this.logger.error(`Failed to login...${err}`);
    }
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt"))
  logout(@Res() res: Response) {
    try {
      res.setHeader("Set-Cookie",
        `Authentication=; HttpOnly; Path=/; Max-Age=0`);
      this.logger.info(`Logout Succeed!`);
      return res.sendStatus(200);
    } catch(err) {
      this.logger.error(`Failed to logout...${err}`);
    }
  }

  @Post("register")
  @ApiOperation({ summary: "회원가입", description: "계정 생성 & 인증 메일 발송" })
  async register(@Body() dto: AccountCreateDto, @Query("sendMail") sendMail: boolean) {
    try {
      const newAccount = await this.accountService.save(dto);
      console.log(newAccount.uuid);
      console.log(newAccount.email);
      try {
        if (sendMail) {
          this.mailService.sendVerificationMail(newAccount.email, newAccount.uuid);
          this.logger.info("Succeed to send email!");
        }
        this.logger.info(`Succeed to register: uuid=${newAccount.uuid}`);
        return newAccount;
      } catch(err) {
        this.logger.error(`Failed to send email...${err}`);
      }
    } catch(err) {
      this.logger.error(`Failed to register...${err}`);
    }
  }

  @Get("activateAccount/:uuid")
  async activateAccount(@Param("uuid") uuid: string, @Res() res: Response) {
    try {
      await this.accountService.findOneOrFail({ uuid: uuid });
      await this.accountService.update({ uuid: uuid }, { account_status: AccountStatus.activated });
      this.logger.info(`Succeed to active account: uuid=${uuid}`);
      res.redirect(process.env.public_web);
    } catch(err) {
      this.logger.error(`Failed to activate account...${err}`);
    }
  }
}
