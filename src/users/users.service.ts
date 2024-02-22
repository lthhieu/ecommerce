import { BadRequestException, Inject, Injectable, Req, Res, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCartDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import crypto from 'crypto'
import { FOUND_EMAIL, INVALID_ID, INVALID_TOKEN_2, NOT_USER_BY_ID, RESET_PASSWORD_TOKEN_EXPIRE } from 'src/configs/response.constants';
import aqp from 'api-query-params';
import { Request, Response, } from 'express';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService) { }
  hashPassword(plaintext: string) {
    const salt = genSaltSync(10);
    return hashSync(plaintext, salt);
  }
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }
  comparePassword(pass: string, hash: string) {
    return compareSync(pass, hash)
  }

  async create(createUserDto: CreateUserDto, response: Response) {
    //check mail exist
    let check = await this.findOneByEmail(createUserDto.email)
    if (check) {
      throw new BadRequestException(FOUND_EMAIL)
    }
    //create
    const token = crypto.randomBytes(16).toString('hex')
    response.cookie('data_new_user', { ...createUserDto, token }, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('REGISTER_USER_EXPIRE'))
    })
    return this.mailService.sendEmailConfirmEmail(createUserDto, token)
  }

  async confirmCreate(request: Request, token: string, response: Response) {
    const { cookies } = request
    if (!cookies || cookies?.data_new_user?.token !== token) throw new BadRequestException(INVALID_TOKEN_2)
    let createNewUser = await this.userModel.create({
      firstName: cookies?.data_new_user?.firstName,
      lastName: cookies?.data_new_user?.lastName,
      email: cookies?.data_new_user?.email,
      mobile: cookies?.data_new_user?.mobile,
      password: this.hashPassword(cookies?.data_new_user?.password)
    })
    response.clearCookie('data_new_user', { httpOnly: true, secure: true })
    return {
      _id: createNewUser._id
    }
  }

  async findAll(page: number, limit: number, qs: string) {
    let { filter, projection, population } = aqp(qs);
    let { sort }: { sort: any } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    page = page ? page : 1
    limit = limit ? limit : 10
    let skip = (page - 1) * limit

    const totalItems = (await this.userModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / limit)

    if (!sort) {
      sort = '-updatedAt'
    }

    let users = await this.userModel.find(filter).select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .populate(population)
      .exec();

    return {
      meta: {
        current: page,
        pageSize: limit,
        pages: totalPages,
        total: totalItems
      },
      result: users
    }
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const user = await this.userModel.findOne({ _id: id }).select('-password -refreshToken')
      .populate('cart.product', 'title price')
    if (!user) {
      throw new BadRequestException(NOT_USER_BY_ID)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { email } = updateUserDto
    const user = await this.findOneByEmail(email)
    //check unique email
    if (user && JSON.stringify(user._id) !== JSON.stringify(id)) {
      throw new BadRequestException(FOUND_EMAIL)
    }
    return await this.userModel.updateOne({ _id: id }, updateUserDto)
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.deleteOne({ _id: id })
  }
  updateRefreshToken = async (refreshToken: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.findByIdAndUpdate(id, {
      refreshToken
    })
  }
  updatePasswordToken = async (passwordResetToken: string, passwordResetExpire: string, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.findByIdAndUpdate(id, {
      passwordResetToken, passwordResetExpire
    })
  }
  async checkResetPasswordToken(passwordResetToken: string) {
    return await this.userModel.findOne({
      passwordResetToken, passwordResetExpire: { $gt: Date.now() }
    })
  }
  async resetPassword(token: string, password: string) {
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const checkToken = await this.checkResetPasswordToken(passwordResetToken)
    if (!checkToken) throw new BadRequestException(RESET_PASSWORD_TOKEN_EXPIRE)
    if (!mongoose.Types.ObjectId.isValid(checkToken._id)) {
      throw new BadRequestException(INVALID_ID)
    }
    return await this.userModel.findByIdAndUpdate(checkToken._id, {
      password: this.hashPassword(password), passwordResetToken: null, passwordResetExpire: null, passwordChangeAt: Date.now()
    }).select('_id')
  }

  async updateCart(id: string, updateCartDto: UpdateCartDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(INVALID_ID)
    }
    const { cart } = updateCartDto
    const { cart: oldCart, ...user } = await this.findOne(id)
    //kiểm tra id của product có trong cart hay chưa ?
    const checkColor = oldCart.find(item => JSON.stringify(item.product) === JSON.stringify(cart.product)
      && item.color === cart.color)
    if (checkColor) {
      //cập nhật số lượng
      return await this.userModel.updateOne({ _id: id, cart: { $elemMatch: checkColor } }, {
        $set: { "cart.$.quantity": cart.quantity }
      })
    } else {
      //thêm sản phẩm mới
      return await this.userModel.updateOne({ _id: id }, {
        $push: { cart }
      })
    }
  }
}
