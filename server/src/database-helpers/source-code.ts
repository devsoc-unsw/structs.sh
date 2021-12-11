import { SourceCodeModel } from '../schemas/source-code/source-code';
import { SourceCode } from '../typedefs/source-code/SourceCode';

export class SourceCodeMongoService {
    public async createSourceCode(
        topicId: string,
        title: string,
        code: string
    ): Promise<SourceCode> {
        try {
            const newSourceCode = (await SourceCodeModel.create({
                topicId: topicId,
                title: title,
                code: code,
            })) as SourceCode;
            return newSourceCode;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public async getSourceCodeSnippets(topicId: string): Promise<SourceCode[]> {
        try {
            const sourceCodes = (await SourceCodeModel.find({
                topicId: topicId,
            })) as SourceCode[];
            return sourceCodes;
        } catch (err) {
            const reg = /Cast to ObjectId failed/;
            if (reg.exec(err)) {
                throw new Error('Lesson requested does not exist.');
            }
            throw new Error(err.message);
        }
    }

    public async getSourceCodeById(sourceCodeId: string): Promise<SourceCode> {
        try {
            const sourceCode = (await SourceCodeModel.findById(
                sourceCodeId
            )) as SourceCode;
            return sourceCode;
        } catch (err) {
            const reg = /Cast to ObjectId failed/;
            if (reg.exec(err)) {
                throw new Error('Lesson requested does not exist.');
            }
            throw new Error(err.message);
        }
    }

    public async updateSourceCodeById(
        sourceCodeId: string,
        title: string,
        code: string
    ): Promise<SourceCode> {
        try {
            const returnData = (await SourceCodeModel.findByIdAndUpdate(
                sourceCodeId,
                {
                    title: title,
                    code: code,
                },
                { new: true, useFindAndModify: false }
            )) as SourceCode;
            return returnData;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
