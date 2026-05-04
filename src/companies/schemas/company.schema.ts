import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument} from 'mongoose';


export type CompanyDocument = HydratedDocument<Company>;

@Schema({timestamps:true})//timestamps:true => tự động tạo createdAt và updatedAt
export class Company {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop()
  logo: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: boolean;

  @Prop({type: Object})
  deletedBy: {
     _id : mongoose.Schema.Types.ObjectId,
    email : string
  }; 

  @Prop({type: Object})
  createdBy: {
    _id : mongoose.Schema.Types.ObjectId,
    email : string
  };

  @Prop({type: Object})
  updatedBy: {
    _id : mongoose.Schema.Types.ObjectId,
    email : string
  };

}

export const CompanySchema = SchemaFactory.createForClass(Company  );
