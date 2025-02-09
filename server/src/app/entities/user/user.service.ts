import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MSchema } from 'mongoose';

import { User, UserDocument } from './user.model';
import { CreateUserInput, UpdateUserInput, ListUserInput } from './user.input';
import { sendEmailConfirmationCode } from 'app/lib/email.util';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	getById(_id: MSchema.Types.ObjectId) {
		return this.userModel.findById(_id).exec();
	}

	list(filters: ListUserInput) {
		return this.userModel.find({ ...filters }).exec();
	}

	getByEmail(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async create(payload: CreateUserInput) {
		const newUser = new this.userModel(payload);
		newUser.password = await User.hashPwd(payload.password);
		newUser.role = User.assignRole(payload.role);
		newUser.save().then((savedUser: UserDocument) => {
			sendEmailConfirmationCode(origin, savedUser);
			return savedUser;
		});
	}

	update(payload: UpdateUserInput) {
		return this.userModel
			.findByIdAndUpdate(payload._id, payload, {
				new: true
			})
			.exec();
	}

	delete(_id: MSchema.Types.ObjectId) {
		return this.userModel.findByIdAndDelete(_id).exec();
	}
}
