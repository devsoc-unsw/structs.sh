import { Ticket } from '../model/admin/Ticket';
import { CreateTicketInput } from '../model/input/admin/CreateTicketInput';
import { UpdateTicketInput } from '../model/input/admin/UpdateTicketInput';
import { TicketModel } from '../schemas/admin/ticket';

/**
 * Database controller for the user collection in GalacticEd
 */
export class AdminMongoService {
  /**
   * Get all tickets stored in GalacticEd
   */
  public async getAllTickets(): Promise<Ticket[]> {
    try {
      const allTickets = (await TicketModel.find({})) as Ticket[];
      return allTickets;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Get a ticket by id from GalacticEd's admin system
   */
  public async getTicketById(id: string): Promise<Ticket> {
    try {
      const ticket = (await TicketModel.findById(id)) as Ticket;
      return ticket;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Create a new ticket in GalacticEd's admin system
   */
  public async createTicket(ticket: CreateTicketInput): Promise<Ticket> {
    try {
      const createTicketResponse = (await TicketModel.create({
        ...ticket,
      })) as Ticket;
      return createTicketResponse;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Update an existing ticket in GalacticEd's admin system
   */
  public async updateTicket(ticket: UpdateTicketInput): Promise<Ticket> {
    try {
      await TicketModel.updateOne({ _id: ticket._id }, { ...ticket });
      const updatedTicket = (await TicketModel.findById(ticket._id)) as Ticket;
      return updatedTicket;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Delete a ticket from GalacticEd's admin system
   */
  public async deleteTicket(id: string): Promise<string> {
    try {
      await TicketModel.deleteOne({ _id: id });
      return `Successfully deleted ticket with id ${id}`;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
