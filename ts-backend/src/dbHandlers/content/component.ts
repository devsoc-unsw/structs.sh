import { ComponentModel } from '../../schemas/content/component';
import { Component } from '../../model/content/Component';
import { CreateComponentInput } from '../../model/input/content/CreateComponentInput';

/**
 * Database controller for the user collection in GalacticEd
 */
export class ComponentMongoService {
  /**
   * Get all Components for a question
   */
  public async getAllComponents(questionId: string): Promise<Component[]> {
    try {
      return (await ComponentModel.find({
        questionId: questionId,
      })) as Component[];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a component by id from GalacticEd's content system
   */
  public async getComponentById(id: string): Promise<Component> {
    try {
      return (await ComponentModel.findById(id)) as Component;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a component for a question in GalacticEd
   */
  public async createComponent(
    component: CreateComponentInput
  ): Promise<Component> {
    try {
      return (await ComponentModel.create({
        ...component,
      })) as Component;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a component from GalacticEd's content system
   */
  public async deleteComponent(id: string): Promise<void> {
    try {
      await ComponentModel.deleteOne({ _id: id });
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
