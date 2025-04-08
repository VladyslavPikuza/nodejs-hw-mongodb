import { KEYS_OF_CONTACTS } from '../constants/enum/constants.js';
import { SORT_ORDER } from '../constants/enum/sort.js';

const parseSortOrder = (sortOrder) => {
  const isKnownOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnownOrder) return sortOrder;
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keysOfContacts = [
    KEYS_OF_CONTACTS.ID,
    KEYS_OF_CONTACTS.NAME,
    KEYS_OF_CONTACTS.PHONENUMBER,
    KEYS_OF_CONTACTS.EMAIL,
    KEYS_OF_CONTACTS.ISFAVOURITE,
    KEYS_OF_CONTACTS.CONTACTTYPE,
    KEYS_OF_CONTACTS.CREATEDAT,
    KEYS_OF_CONTACTS.UPDATEDAT,
  ];

  if (keysOfContacts.includes(sortBy)) {
    return sortBy;
  }

  return KEYS_OF_CONTACTS.ID;
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortOrder: parsedSortOrder,
    sortBy: parsedSortBy,
  };
};
