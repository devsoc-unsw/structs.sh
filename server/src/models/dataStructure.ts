import mongoose from 'mongoose';

interface IDataStructure {
  owner: string;
  type: string;
  name: string;
  data: number[];
}

interface dataStructureModelInterface extends mongoose.Model<dataStructureDoc> {
  build: (attr: IDataStructure) => dataStructureDoc;
}

interface dataStructureDoc extends mongoose.Document {
  owner: string;
  type: string;
  name: string;
  data: number[];
}

const dataStructureSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    type: [Number],
    required: true,
  },
});

dataStructureSchema.statics.build = (attr: IDataStructure) => {
  return new dataStructure(attr);
};

const dataStructure = mongoose.model<
  dataStructureDoc,
  dataStructureModelInterface
>('DataStructure', dataStructureSchema);

export { dataStructure };