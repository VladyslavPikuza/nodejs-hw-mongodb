const { getAllContacts } = require('../services/contacts');

const getContactsData = async ({ userId, ...query }) => {
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;
  const sortBy = query.sortBy || 'name';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const contactType = query.type;
  const email = query.email;
  const isFavourite = query.isFavourite ? JSON.parse(query.isFavourite) : undefined;

  let filter = { userId };
  if (contactType) filter.contactType = contactType;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite;
  if (email) filter.email = email;

  const { contacts, totalItems } = await getAllContacts(userId, filter, page, perPage, sortBy, sortOrder);
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

module.exports = { getContactsData };
