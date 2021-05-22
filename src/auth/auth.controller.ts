import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import {AccountService} from "../inpostack/account/account.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly accountService: AccountService
  ) {
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

  @Get("verifyToken")
  @UseGuards(AuthGuard("jwt"))
  verifyToken(@Req() req: Request) {
    const user: any = req.user;
    return user;
  }

  @Get("logout")
  @UseGuards(AuthGuard("jwt"))
  logout(@Res() res: Response) {
    res.setHeader('Set-Cookie',
      `Authentication=; HttpOnly; Path=/; Max-Age=0`);
    return res.sendStatus(200);
  }

}
