export interface IUser {
  _id?: string;
  username: string;
}

export interface ICountry {
  _id?: string;
  name: string;
}

export interface IGenre {
  _id?: string;
  name: string;
}

export interface ILanguage {
  _id?: string;
  name: string;
}
export interface IVolume {
  _id?: string;
  name: string;
  year?: number;
  cabinet?: number;
  shelf?: number;
  picture?: string;
}

export interface IAuthorDb {
  _id?: string;
  name: string;
  fullName: string;
  originalName: string;
  countryId: string;
}

export interface IAuthor {
  _id?: string;
  name: string;
  fullName?: string;
  originalName?: string;
  country?: ICountry;
}

export interface IBookDb {
  _id?: string;
  name: string;
  originalName: string;
  authorMainId: string;
  authorsIds: string[];
  languageId: string;
  genreMainId: string;
  genresIds: string[];
  year: number;
  volumesIds: string[];
  countryId: string;
}

export interface IBook {
  _id?: string;
  name: string;
  originalName?: string;
  authorMain?: IAuthor;
  authors?: IAuthor[];
  language: ILanguage;
  genreMain?: IGenre;
  genres?: IGenre[];
  year?: number;
  volumes: IVolume[];
  country?: ICountry;
}
