import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver
} from '@nestjs/graphql';
import { Schema as MSchema } from 'mongoose';

import { Record, RecordDocument } from './record.model';
import {
	CreateRecordInput,
	ListRecordInput,
	UpdateRecordInput
} from './record.input';
import { RecordService } from './record.service';
import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { AppointmentContent } from '../appointment-content/appointment-content.model';

@Resolver(() => Record)
export class RecordResolver {
	constructor(private recordService: RecordService) {}

	@Query(() => Record)
	async record(
		@Args('_id', { type: () => String }) _id: MSchema.Types.ObjectId
	) {
		return this.recordService.getById(_id);
	}

	@Query(() => [Record])
	async records(@Args('filters') filters: ListRecordInput) {
		return this.recordService.list(filters);
	}

	@Mutation(() => Record)
	async createRecord(@Args('payload') payload: CreateRecordInput) {
		return this.recordService.create(payload);
	}

	@Mutation(() => Record)
	async updateRecord(@Args('payload') payload: UpdateRecordInput) {
		return this.recordService.update(payload);
	}

	@Mutation(() => Record)
	async deleteRecord(
		@Args('_id', { type: () => String }) _id: MSchema.Types.ObjectId
	) {
		return this.recordService.delete(_id);
	}

	@ResolveField(() => Doctor)
	async actualDoc(
		@Parent() record: RecordDocument,
		@Args('populate') populate: boolean
	) {
		if (populate)
			await record
				.populate({
					path: 'actualDoc',
					model: Doctor.name
				})
				.execPopulate();
		return record.actualDoc;
	}

	@ResolveField(() => Patient)
	async patientId(
		@Parent() record: RecordDocument,
		@Args('populate') populate: boolean
	) {
		if (populate)
			await record
				.populate({
					path: 'patientId',
					model: Patient.name
				})
				.execPopulate();
		return record.patientId;
	}

	@ResolveField(() => AppointmentContent)
	async content(
		@Parent() record: RecordDocument,
		@Args('populate') populate: boolean
	) {
		if (populate)
			await record
				.populate({
					path: 'content',
					model: AppointmentContent.name
				})
				.execPopulate();
		return record.content;
	}
}
