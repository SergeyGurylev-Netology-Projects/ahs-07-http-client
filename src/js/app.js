import HelpDesk from '../help-desk/help-desk';

const helpDesk = new HelpDesk();

document.addEventListener('DOMContentLoaded', e => helpDesk.getAllTickets(e));
