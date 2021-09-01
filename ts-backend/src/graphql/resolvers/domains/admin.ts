import { CreateTicketInput } from '../../../model/input/admin/CreateTicketInput';
import { AdminMongoService } from '../../../dbHandlers/admin';
import { UpdateTicketInput } from '../../../model/input/admin/UpdateTicketInput';

const adminService = new AdminMongoService();

/**
 * All resolvers for the Admin Domain - here we look at tickets.
 */
export const adminResolvers = {
  Query: {
    getAllTickets: async () => {
      return await adminService.getAllTickets();
    },
    getTicketById: async (_, args: { id: string }) => {
      return await adminService.getTicketById(args.id);
    },
  },
  Mutation: {
    createTicket: async (_, args: { ticket: CreateTicketInput }) => {
      return await adminService.createTicket(args.ticket);
    },
    updateTicket: async (_, args: { ticket: UpdateTicketInput }) => {
      return await adminService.updateTicket(args.ticket);
    },
    deleteTicket: async (_, args: { id: string }) => {
      return await adminService.deleteTicket(args.id);
    },
  },
};
