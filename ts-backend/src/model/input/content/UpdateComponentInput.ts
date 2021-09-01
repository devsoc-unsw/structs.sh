import mongoose from 'mongoose';
import { Component } from 'src/model/content/Component';

/**
 * This is the model for updating a component rendered in a question
 */

export interface UpdateComponentInput extends Component {}
