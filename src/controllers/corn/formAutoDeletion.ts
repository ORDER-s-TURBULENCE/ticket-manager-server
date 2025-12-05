import { deleteExpiredForms } from "../../service/corn/formAutoDeletion.js";

export default async function handler() {
  try {
    await deleteExpiredForms();
    return new Response('Expired forms deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting expired forms:', error);
    return new Response('Failed to delete expired forms', { status: 500 });
  }
}
