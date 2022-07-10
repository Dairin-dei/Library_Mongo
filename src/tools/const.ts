import {
  IAuthor,
  IAuthorDb,
  IBook,
  IBookDb,
  ICountry,
  IGenre,
  ILanguage,
  IVolume,
} from './interfaces';

export const EMPTY_COUNTRY: ICountry = {
  name: '',
};

export const EMPTY_LANGUAGE: ILanguage = {
  name: '',
};

export const EMPTY_GENRE: IGenre = {
  name: '',
};

export const EMPTY_AUTHOR: IAuthor = {
  name: '',
};

export const EMPTY_VOLUME: IVolume = {
  name: '',
};

export const EMPTY_AUTHORDB: IAuthorDb = {
  name: '',
  fullName: '',
  originalName: '',
  countryId: '',
};

export const EMPTY_BOOKDB: IBookDb = {
  name: '',
  originalName: '',
  authorMainId: '',
  authorsIds: [],
  languageId: '',
  genreMainId: '',
  genresIds: [],
  year: 0,
  volumesIds: [],
  countryId: '',
};

export const EMPTY_BOOK: IBook = {
  name: '',
  language: undefined,
  volumes: [],
};
